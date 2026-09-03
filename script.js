// ============ Configuration ============
const HF_API_KEY = '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';
const HF_IMAGE_MODEL = 'Salesforce/blip-image-captioning-large';
const HF_TEXT_MODEL = 'microsoft/Phi-3-mini-4k-instruct';

// ============ Translations ============
const translations = {
    ar: {
        uploadFirst: 'يرجى رفع صورة أولاً',
        dailyLimitReached: 'لقد استخدمت توليد الأسئلة المجاني اليوم. حاول مرة أخرى غداً.',
        chatLimitReached: 'لقد استخدمت رسائلك العشرة اليوم. حاول مرة أخرى غداً.',
        analyzing: 'جاري تحليل المادة مع Hugging Face...',
        error_connection: 'حدثت مشكلة في الاتصال بـ Qentra. جرب في وقت لاحق.',
        error_invalid_image: 'الصورة غير صالحة. يرجى رفع صورة JPG أو PNG أو WEBP.',
        error_size: 'حجم الصورة أكبر من 5 ميجابايت. يرجى رفع صورة أصغر.',
        error_unclear: 'تعذر قراءة الصورة بوضوح. لديك ',
        chances_left: ' فرص متبقية اليوم.',
        error_inappropriate: 'هذا المحتوى غير مناسب للاستخدام التعليمي.',
        error_math: 'أعتذر، أنا متخصص في الرياضيات.',
        error_insufficient: 'لا توجد معلومات كافية لتوليد 10 أسئلة.',
        no_chats: 'لا توجد محادثات بعد',
        placeholder: 'اسأل عن الأسئلة...',
        timeout: 'انتهى وقت التحليل، حاول مرة أخرى',
        processing: 'جاري المعالجة...',
        attempt: 'محاولة',
        of: 'من'
    },
    en: {
        uploadFirst: 'Please upload an image first',
        dailyLimitReached: 'You have used your free question generation today. Try again tomorrow.',
        chatLimitReached: 'You have used your 10 messages today. Try again tomorrow.',
        analyzing: 'Analyzing your material with Hugging Face...',
        error_connection: 'A problem occurred connecting to Qentra. Try again later.',
        error_invalid_image: 'Invalid image. Please upload JPG, PNG, or WEBP.',
        error_size: 'Image size is larger than 5MB. Please upload a smaller image.',
        error_unclear: 'Could not read the image clearly. You have ',
        chances_left: ' chances left today.',
        error_inappropriate: 'This content is not appropriate for educational use.',
        error_math: 'I apologize, I am specialized in Mathematics.',
        error_insufficient: 'Not enough information to generate 10 questions.',
        no_chats: 'No chats yet',
        placeholder: 'Ask about the questions...',
        timeout: 'Analysis timeout, please try again',
        processing: 'Processing...',
        attempt: 'Attempt',
        of: 'of'
    }
};

// ============ State ============
const state = {
    currentImage: null,
    currentQuestions: null,
    currentChatId: null,
    deviceId: null,
    settings: { theme: 'light', language: 'ar' },
    chats: [],
    dailyUsage: { attemptUsed: false, chancesLeft: 3, date: null },
    chatUsage: { messagesUsed: 0, date: null },
    isProcessing: false,
    timeoutId: null
};

// ============ DOM Elements ============
const elements = {
    landingOverlay: document.getElementById('landingOverlay'),
    landingBtn: document.getElementById('landingBtn'),
    appContainer: document.getElementById('appContainer'),
    sidebar: document.getElementById('sidebar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    plansBtn: document.getElementById('plansBtn'),
    plansBackBtn: document.getElementById('plansBackBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    backBtn: document.getElementById('backBtn'),
    chatList: document.getElementById('chatList'),
    homeView: document.getElementById('homeView'),
    plansView: document.getElementById('plansView'),
    settingsView: document.getElementById('settingsView'),
    uploadArea: document.getElementById('uploadArea'),
    browseBtn: document.getElementById('browseBtn'),
    fileInput: document.getElementById('fileInput'),
    imagePreview: document.getElementById('imagePreview'),
    previewImg: document.getElementById('previewImg'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    removeBtn: document.getElementById('removeBtn'),
    generateBtn: document.getElementById('generateBtn'),
    loadingState: document.getElementById('loadingState'),
    loadingText: document.getElementById('loadingText'),
    errorMessage: document.getElementById('errorMessage'),
    questionsSection: document.getElementById('questionsSection'),
    questionsList: document.getElementById('questionsList'),
    showAnswersBtn: document.getElementById('showAnswersBtn'),
    answersList: document.getElementById('answersList'),
    newQuestionsBtn: document.getElementById('newQuestionsBtn'),
    chatSection: document.getElementById('chatSection'),
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendChatBtn: document.getElementById('sendChatBtn'),
    typingIndicator: document.getElementById('typingIndicator'),
    lightThemeBtn: document.getElementById('lightThemeBtn'),
    darkThemeBtn: document.getElementById('darkThemeBtn'),
    arLangBtn: document.getElementById('arLangBtn'),
    enLangBtn: document.getElementById('enLangBtn')
};

// ============ Helpers ============
function t(key) {
    return translations[state.settings.language][key] || key;
}

function generateDeviceId() {
    const components = [navigator.userAgent, navigator.language, screen.width, screen.height, navigator.hardwareConcurrency, navigator.platform, Intl.DateTimeFormat().resolvedOptions().timeZone];
    const fingerprint = components.join('|');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'device_' + Math.abs(hash).toString(36);
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
}

function getFromStorage(key) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
    } catch (e) {
        return null;
    }
}

// ============ Settings ============
function loadSettings() {
    const settings = getFromStorage('qentra_settings');
    if (settings) {
        state.settings = { ...state.settings, ...settings };
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) state.settings.theme = 'dark';
    }
    applySettings();
}

function saveSettings() {
    saveToStorage('qentra_settings', state.settings);
}

function applySettings() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    elements.darkThemeBtn.classList.toggle('active', state.settings.theme === 'dark');
    elements.lightThemeBtn.classList.toggle('active', state.settings.theme === 'light');

    if (state.settings.language === 'ar') {
        elements.arLangBtn.classList.add('active');
        elements.enLangBtn.classList.remove('active');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        elements.enLangBtn.classList.add('active');
        elements.arLangBtn.classList.remove('active');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }

    document.querySelectorAll('[data-ar]').forEach(el => {
        if (el.dataset.ar && el.dataset.en) {
            el.textContent = state.settings.language === 'ar' ? el.dataset.ar : el.dataset.en;
        }
    });

    elements.chatInput.placeholder = t('placeholder');
}

// ============ Chat History ============
function loadChats() {
    const chats = getFromStorage('qentra_chats');
    if (chats) state.chats = chats;
    renderChatList();
}

function saveChats() {
    saveToStorage('qentra_chats', state.chats);
}

function renderChatList() {
    elements.chatList.innerHTML = '';
    if (state.chats.length === 0) {
        elements.chatList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px;">' + t('no_chats') + '</p>';
        return;
    }
    state.chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2"/></svg>';
        const preview = document.createElement('span');
        preview.className = 'chat-preview';
        preview.textContent = chat.preview || 'Chat';
        item.appendChild(preview);
        item.addEventListener('click', () => {
            const c = state.chats.find(x => x.id === chat.id);
            if (c && c.questions) {
                state.currentQuestions = c.questions;
                displayQuestions(c.questions);
                showView('home');
            }
        });
        elements.chatList.appendChild(item);
    });
}

// ============ Views ============
function showView(view) {
    elements.homeView.style.display = 'none';
    elements.plansView.style.display = 'none';
    elements.settingsView.style.display = 'none';
    if (view === 'home') elements.homeView.style.display = 'block';
    else if (view === 'plans') elements.plansView.style.display = 'block';
    else if (view === 'settings') elements.settingsView.style.display = 'block';
    elements.sidebar.classList.remove('open');
}

// ============ UI ============
function showLoading(msg) {
    elements.loadingState.style.display = 'block';
    elements.loadingText.textContent = msg;
    elements.errorMessage.style.display = 'none';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
        state.timeoutId = null;
    }
}

function showError(key, extra) {
    let msg = t(key);
    if (extra) msg += extra;
    elements.errorMessage.textContent = msg;
    elements.errorMessage.style.display = 'block';
    hideLoading();
}

// ============ Loading with Timer ============
function showLoadingWithTimer(message, timeoutSeconds = 60) {
    let seconds = timeoutSeconds;
    state.isProcessing = true;
    
    elements.loadingState.style.display = 'block';
    updateLoadingText(message, seconds);
    
    // تحديث العد التنازلي كل ثانية
    const timerInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            updateLoadingText(message, seconds);
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
    
    // تعيين timeout
    if (state.timeoutId) {
        clearTimeout(state.timeoutId);
    }
    
    state.timeoutId = setTimeout(() => {
        clearInterval(timerInterval);
        state.isProcessing = false;
        hideLoading();
        showError('timeout');
        // إعادة تعيين الزر
        elements.generateBtn.disabled = false;
        elements.generateBtn.textContent = t('analyzing');
    }, timeoutSeconds * 1000);
    
    // حفظ references للإيقاف
    elements.loadingState._timerInterval = timerInterval;
}

function updateLoadingText(message, seconds) {
    const lang = state.settings.language;
    const attemptText = lang === 'ar' ? 'محاولة' : 'Attempt';
    const ofText = lang === 'ar' ? 'من' : 'of';
    const processingText = lang === 'ar' ? 'جاري المعالجة...' : 'Processing...';
    
    elements.loadingText.innerHTML = `
        <div style="text-align: center; direction: ${lang === 'ar' ? 'rtl' : 'ltr'};">
            <div style="font-size: 16px; margin-bottom: 12px;">${message}</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 8px 0;">
                <div style="position: relative; width: 60px; height: 60px;">
                    <svg style="transform: rotate(-90deg); width: 60px; height: 60px;">
                        <circle cx="30" cy="30" r="25" stroke="var(--border-color)" stroke-width="4" fill="none"/>
                        <circle cx="30" cy="30" r="25" stroke="var(--accent)" stroke-width="4" fill="none"
                            stroke-dasharray="157" 
                            stroke-dashoffset="${157 - (seconds / 60) * 157}"
                            stroke-linecap="round"
                            style="transition: stroke-dashoffset 1s ease;"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 18px; font-weight: bold; color: var(--accent);">
                        ${seconds}s
                    </div>
                </div>
                <div style="font-size: 14px; color: var(--text-secondary);">
                    ${processingText}<br>
                    <span style="font-size: 12px;">${attemptText} 1 ${ofText} 3</span>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">
                ${lang === 'ar' ? '⏳ قد يستغرق التحليل حتى 60 ثانية' : '⏳ Analysis may take up to 60 seconds'}
            </div>
        </div>
    `;
}

// ============ Daily Usage ============
function checkDailyUsage() {
    const today = new Date().toISOString().split('T')[0];
    const usage = getFromStorage('qentra_daily_usage');
    if (!usage || usage.date !== today) {
        state.dailyUsage = { attemptUsed: false, chancesLeft: 3, date: today };
        saveToStorage('qentra_daily_usage', state.dailyUsage);
    } else state.dailyUsage = usage;
    return state.dailyUsage;
}

function updateDailyUsage(success) {
    if (success) {
        state.dailyUsage.attemptUsed = true;
        state.dailyUsage.chancesLeft = 0;
    } else {
        state.dailyUsage.chancesLeft--;
        if (state.dailyUsage.chancesLeft <= 0) state.dailyUsage.attemptUsed = true;
    }
    saveToStorage('qentra_daily_usage', state.dailyUsage);
}

function checkChatUsage() {
    const today = new Date().toISOString().split('T')[0];
    const usage = getFromStorage('qentra_chat_usage');
    if (!usage || usage.date !== today) {
        state.chatUsage = { messagesUsed: 0, date: today };
        saveToStorage('qentra_chat_usage', state.chatUsage);
    } else state.chatUsage = usage;
    return state.chatUsage;
}

function canSendMessage() {
    return checkChatUsage().messagesUsed < 10;
}

function incrementMessage() {
    state.chatUsage.messagesUsed++;
    saveToStorage('qentra_chat_usage', state.chatUsage);
}

// ============ File Upload ============
function handleFileSelect(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
        showError('error_invalid_image');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showError('error_size');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        state.currentImage = e.target.result;
        elements.previewImg.src = e.target.result;
        elements.fileName.textContent = file.name;
        elements.fileSize.textContent = (file.size / 1024).toFixed(2) + ' KB';
        elements.uploadArea.style.display = 'none';
        elements.imagePreview.style.display = 'block';
        elements.errorMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth = 600, quality = 0.5) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width,
                h = img.height;
            if (w > maxWidth) {
                h = (h * maxWidth) / w;
                w = maxWidth;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}

// ============ Hugging Face API with Retry ============
async function describeImage(imageBase64, retries = 3) {
    let imageData = imageBase64;
    if (imageBase64.includes(',')) {
        imageData = imageBase64.split(',')[1];
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // تحديث النص مع رقم المحاولة
            const lang = state.settings.language;
            const attemptText = lang === 'ar' ? 'محاولة' : 'Attempt';
            const ofText = lang === 'ar' ? 'من' : 'of';
            
            updateLoadingText(
                lang === 'ar' ? '📸 جاري قراءة الصورة...' : '📸 Reading image...',
                60 - (attempt - 1) * 5
            );

            const response = await fetch(`https://api-inference.huggingface.co/models/${HF_IMAGE_MODEL}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: imageData,
                    parameters: {
                        max_new_tokens: 200
                    }
                })
            });

            if (response.status === 503) {
                console.log('⏳ النموذج بيشتغل... استنى 5 ثواني');
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ خطأ:', errorData);
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }
                throw new Error(`خطأ ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ تم وصف الصورة:', data);

            if (Array.isArray(data) && data[0]?.generated_text) {
                return data[0].generated_text;
            } else if (data.generated_text) {
                return data.generated_text;
            } else if (typeof data === 'string') {
                return data;
            }
            return 'لم يتم التعرف على الصورة';

        } catch (error) {
            console.error(`❌ محاولة ${attempt} فشلت:`, error);
            if (attempt === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

async function generateQuestionsFromText(text, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const lang = state.settings.language;
            updateLoadingText(
                lang === 'ar' ? '🤖 جاري توليد الأسئلة...' : '🤖 Generating questions...',
                60 - (attempt - 1) * 5
            );

            const prompt = `Based on this text: "${text}"

Generate EXACTLY 10 questions about this content.
Rules:
- Questions 1-3: Easy
- Questions 4-7: Medium
- Questions 8-10: Hard

Return ONLY valid JSON:
{
    "success": true,
    "questions": [
        {"number": 1, "difficulty": "easy", "question": "Question", "answer": "Answer"},
        {"number": 2, "difficulty": "easy", "question": "Question", "answer": "Answer"}
    ]
}

If text is unclear:
{"success": false, "error": "unclear"}`;

            const response = await fetch(`https://api-inference.huggingface.co/models/${HF_TEXT_MODEL}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 2000,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            if (response.status === 503) {
                console.log('⏳ النموذج بيشتغل... استنى 5 ثواني');
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ خطأ:', errorData);
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }
                throw new Error(`خطأ ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ تم توليد الأسئلة:', data);

            let result = '';
            if (Array.isArray(data) && data[0]?.generated_text) {
                result = data[0].generated_text;
            } else if (data.generated_text) {
                result = data.generated_text;
            } else if (typeof data === 'string') {
                result = data;
            } else {
                result = JSON.stringify(data);
            }

            return result;

        } catch (error) {
            console.error(`❌ محاولة ${attempt} فشلت:`, error);
            if (attempt === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

function extractQuestionsFromText(text) {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion = null;

    for (const line of lines) {
        const qMatch = line.match(/(?:Q|Question|سؤال)\s*(\d+)[\s:.-]*([^?؟]+[?؟]?)/i);
        if (qMatch) {
            if (currentQuestion) {
                questions.push(currentQuestion);
            }
            currentQuestion = {
                number: parseInt(qMatch[1]) || questions.length + 1,
                difficulty: questions.length < 3 ? 'easy' : questions.length < 7 ? 'medium' : 'hard',
                question: qMatch[2].trim(),
                answer: 'الإجابة موجودة في المادة'
            };
        }
    }

    if (currentQuestion) {
        questions.push(currentQuestion);
    }

    while (questions.length < 10) {
        questions.push({
            number: questions.length + 1,
            difficulty: questions.length < 3 ? 'easy' : questions.length < 7 ? 'medium' : 'hard',
            question: `سؤال ${questions.length + 1}: استخلص الإجابة من المادة`,
            answer: 'الإجابة موجودة في المادة'
        });
    }

    return {
        success: true,
        questions: questions.slice(0, 10)
    };
}

async function chatWithHuggingFace(message) {
    try {
        console.log('💬 محادثة مع Hugging Face...');

        const response = await fetch(`https://api-inference.huggingface.co/models/${HF_TEXT_MODEL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `You are QENTRA AI, an educational assistant. Answer in the same language as the user. User: ${message}`,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ خطأ:', errorData);
            throw new Error(`خطأ ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ تم الرد:', data);

        let result = '';
        if (Array.isArray(data) && data[0]?.generated_text) {
            result = data[0].generated_text;
        } else if (data.generated_text) {
            result = data.generated_text;
        } else if (typeof data === 'string') {
            result = data;
        } else {
            result = 'عذراً، لم أفهم';
        }

        return result;

    } catch (error) {
        console.error('❌ خطأ في المحادثة:', error);
        throw error;
    }
}

// ============ Generate Questions ============
async function generateQuestions() {
    if (state.isProcessing) {
        return;
    }

    if (!state.currentImage) {
        showError('uploadFirst');
        return;
    }

    const usage = checkDailyUsage();
    if (usage.attemptUsed) {
        showError('dailyLimitReached');
        return;
    }

    // تعطيل الزر
    elements.generateBtn.disabled = true;
    elements.generateBtn.textContent = '⏳ جاري...';

    try {
        const compressed = await compressImage(state.currentImage, 600, 0.5);
        console.log('✅ تم ضغط الصورة');

        // بدء العد التنازلي
        const lang = state.settings.language;
        showLoadingWithTimer(
            lang === 'ar' ? '🔍 جاري التحليل مع Hugging Face...' : '🔍 Analyzing with Hugging Face...',
            60
        );

        const description = await describeImage(compressed);
        console.log('📝 وصف الصورة:', description);

        const questionsText = await generateQuestionsFromText(description);
        console.log('📝 الأسئلة الخام:', questionsText);

        // إيقاف المؤقت
        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
            state.timeoutId = null;
        }
        if (elements.loadingState._timerInterval) {
            clearInterval(elements.loadingState._timerInterval);
        }

        let cleanText = questionsText.replace(/```json/g, '').replace(/```/g, '').trim();
        const match = cleanText.match(/\{[\s\S]*\}/);
        if (match) cleanText = match[0];

        let parsed;
        try {
            parsed = JSON.parse(cleanText);
        } catch (e) {
            console.error('❌ فشل تحليل JSON:', e);
            parsed = extractQuestionsFromText(cleanText);
        }

        hideLoading();

        if (parsed.success && parsed.questions && parsed.questions.length === 10) {
            state.currentQuestions = parsed.questions;
            displayQuestions(parsed.questions);
            showChat();
            updateDailyUsage(true);

            const chat = {
                id: state.currentChatId,
                preview: parsed.questions[0].question.substring(0, 30) + '...',
                questions: parsed.questions
            };
            state.chats.unshift(chat);
            if (state.chats.length > 20) state.chats.pop();
            saveChats();
            renderChatList();

            const errorMsg = document.getElementById('errorMessage');
            errorMsg.style.display = 'block';
            errorMsg.style.background = '#dcfce7';
            errorMsg.style.color = '#16a34a';
            errorMsg.style.border = '1px solid #86efac';
            errorMsg.textContent = '✅ تم توليد 10 أسئلة بنجاح!';
            setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);

        } else {
            updateDailyUsage(false);
            const left = state.dailyUsage.chancesLeft;
            showError('error_unclear', ' ' + left + ' ' + t('chances_left'));
        }

    } catch (e) {
        console.error('❌ خطأ:', e);
        hideLoading();
        showError('error_connection');
    } finally {
        state.isProcessing = false;
        elements.generateBtn.disabled = false;
        elements.generateBtn.textContent = t('analyzing');
    }
}

// ============ Display Questions ============
function displayQuestions(questions) {
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    elements.answersList.style.display = 'none';
    elements.showAnswersBtn.style.display = 'block';

    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <span class="question-number">Q${String(q.number).padStart(2, '0')}</span>
                <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
            </div>
            <p class="question-text"></p>
        `;
        card.querySelector('.question-text').textContent = q.question;
        elements.questionsList.appendChild(card);
    });

    elements.questionsSection.style.display = 'block';
    elements.imagePreview.style.display = 'none';
    elements.uploadArea.style.display = 'none';
}

function displayAnswers() {
    if (!state.currentQuestions) return;
    elements.answersList.innerHTML = '';
    state.currentQuestions.forEach(q => {
        const item = document.createElement('div');
        item.className = 'answer-item';
        const num = document.createElement('span');
        num.className = 'answer-number';
        num.textContent = 'Q' + String(q.number).padStart(2, '0') + ': ';
        const txt = document.createElement('span');
        txt.textContent = q.answer;
        item.appendChild(num);
        item.appendChild(txt);
        elements.answersList.appendChild(item);
    });
    elements.answersList.style.display = 'block';
    elements.showAnswersBtn.style.display = 'none';
}

// ============ Chat ============
function showChat() {
    elements.chatSection.style.display = 'block';
}

function addChatMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + sender;
    msg.textContent = text;
    elements.chatMessages.appendChild(msg);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function showTyping() {
    elements.typingIndicator.style.display = 'flex';
    elements.chatMessages.appendChild(elements.typingIndicator);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function hideTyping() {
    elements.typingIndicator.style.display = 'none';
}

async function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;

    if (!canSendMessage()) {
        showError('chatLimitReached');
        return;
    }

    addChatMessage('user', message);
    elements.chatInput.value = '';
    incrementMessage();
    showTyping();

    try {
        const response = await chatWithHuggingFace(message);
        hideTyping();
        addChatMessage('ai', response);
    } catch (e) {
        hideTyping();
        addChatMessage('ai', '❌ خطأ في الاتصال');
    }
}

// ============ Events ============
elements.landingBtn.addEventListener('click', () => {
    saveToStorage('qentra_seen_landing', true);
    elements.landingOverlay.style.display = 'none';
    elements.appContainer.style.display = 'flex';
});

elements.mobileMenuBtn.addEventListener('click', () => {
    elements.sidebar.classList.toggle('open');
});

elements.newChatBtn.addEventListener('click', () => {
    state.currentImage = null;
    state.currentQuestions = null;
    elements.questionsSection.style.display = 'none';
    elements.chatSection.style.display = 'none';
    elements.uploadArea.style.display = 'block';
    elements.imagePreview.style.display = 'none';
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    elements.chatMessages.innerHTML = '';
    showView('home');
});

elements.plansBtn.addEventListener('click', () => showView('plans'));
elements.plansBackBtn.addEventListener('click', () => showView('home'));
elements.settingsBtn.addEventListener('click', () => showView('settings'));
elements.backBtn.addEventListener('click', () => showView('home'));

elements.browseBtn.addEventListener('click', () => elements.fileInput.click());
elements.uploadArea.addEventListener('click', (e) => {
    if (e.target !== elements.browseBtn) elements.fileInput.click();
});

elements.uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
});

elements.uploadArea.addEventListener('dragleave', () => {
    elements.uploadArea.classList.remove('dragover');
});

elements.uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
});

elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFileSelect(e.target.files[0]);
});

elements.removeBtn.addEventListener('click', () => {
    state.currentImage = null;
    elements.imagePreview.style.display = 'none';
    elements.uploadArea.style.display = 'block';
});

elements.generateBtn.addEventListener('click', generateQuestions);
elements.showAnswersBtn.addEventListener('click', displayAnswers);

elements.newQuestionsBtn.addEventListener('click', () => {
    elements.questionsSection.style.display = 'none';
    elements.chatSection.style.display = 'none';
    elements.uploadArea.style.display = 'block';
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    state.currentQuestions = null;
});

elements.lightThemeBtn.addEventListener('click', () => {
    state.settings.theme = 'light';
    saveSettings();
    applySettings();
});

elements.darkThemeBtn.addEventListener('click', () => {
    state.settings.theme = 'dark';
    saveSettings();
    applySettings();
});

elements.arLangBtn.addEventListener('click', () => {
    state.settings.language = 'ar';
    saveSettings();
    applySettings();
});

elements.enLangBtn.addEventListener('click', () => {
    state.settings.language = 'en';
    saveSettings();
    applySettings();
});

elements.sendChatBtn.addEventListener('click', sendChatMessage);
elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// ============ Auto Save ============
window.addEventListener('beforeunload', () => {
    if (state.currentQuestions) {
        saveToStorage('qentra_current_session', {
            chatId: state.currentChatId,
            questions: state.currentQuestions,
            timestamp: Date.now()
        });
    }
});

// ============ Init ============
function init() {
    state.deviceId = getFromStorage('qentra_device_id');
    if (!state.deviceId) {
        state.deviceId = generateDeviceId();
        saveToStorage('qentra_device_id', state.deviceId);
    }
    state.currentChatId = 'chat_' + Date.now();

    loadSettings();
    loadChats();
    checkDailyUsage();
    checkChatUsage();

    const hasSeenLanding = getFromStorage('qentra_seen_landing');
    if (!hasSeenLanding) {
        elements.landingOverlay.style.display = 'flex';
        elements.appContainer.style.display = 'none';
    } else {
        elements.landingOverlay.style.display = 'none';
        elements.appContainer.style.display = 'flex';
    }

    const session = getFromStorage('qentra_current_session');
    if (session && session.questions) {
        state.currentQuestions = session.questions;
        displayQuestions(session.questions);
        showChat();
    }

    showView('home');
    console.log('🚀 QENTRA AI initialized with Hugging Face API');
    console.log('📱 Device ID:', state.deviceId);
}

init();
