// ============ Configuration ============
const DEEPSEEK_API_KEY = 'sk-d86b84d1bdc44a6f83193d6e4d02807e';
const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

// ============ Translations ============
const translations = {
    ar: {
        uploadFirst: 'يرجى رفع صورة أولاً',
        dailyLimitReached: 'لقد استخدمت توليد الأسئلة المجاني اليوم. حاول مرة أخرى غداً.',
        chatLimitReached: 'لقد استخدمت رسائلك العشرة اليوم. حاول مرة أخرى غداً.',
        analyzing: 'جاري تحليل المادة مع DeepSeek...',
        error_connection: 'حدثت مشكلة في الاتصال بـ Qentra. جرب في وقت لاحق.',
        error_invalid_image: 'الصورة غير صالحة. يرجى رفع صورة JPG أو PNG أو WEBP.',
        error_size: 'حجم الصورة أكبر من 5 ميجابايت. يرجى رفع صورة أصغر.',
        error_unclear: 'تعذر قراءة الصورة بوضوح. لديك ',
        chances_left: ' فرص متبقية اليوم.',
        error_inappropriate: 'هذا المحتوى غير مناسب للاستخدام التعليمي.',
        error_math: 'أعتذر، أنا متخصص في الرياضيات.',
        error_insufficient: 'لا توجد معلومات كافية لتوليد 10 أسئلة.',
        no_chats: 'لا توجد محادثات بعد',
        placeholder: 'اسأل عن الأسئلة...'
    },
    en: {
        uploadFirst: 'Please upload an image first',
        dailyLimitReached: 'You have used your free question generation today. Try again tomorrow.',
        chatLimitReached: 'You have used your 10 messages today. Try again tomorrow.',
        analyzing: 'Analyzing your material with DeepSeek...',
        error_connection: 'A problem occurred connecting to Qentra. Try again later.',
        error_invalid_image: 'Invalid image. Please upload JPG, PNG, or WEBP.',
        error_size: 'Image size is larger than 5MB. Please upload a smaller image.',
        error_unclear: 'Could not read the image clearly. You have ',
        chances_left: ' chances left today.',
        error_inappropriate: 'This content is not appropriate for educational use.',
        error_math: 'I apologize, I am specialized in Mathematics.',
        error_insufficient: 'Not enough information to generate 10 questions.',
        no_chats: 'No chats yet',
        placeholder: 'Ask about the questions...'
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
    chatUsage: { messagesUsed: 0, date: null }
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
}

function showError(key, extra) { 
    let msg = t(key); 
    if (extra) msg += extra; 
    elements.errorMessage.textContent = msg; 
    elements.errorMessage.style.display = 'block'; 
}

// ============ Daily Usage ============
function checkDailyUsage() {
    const today = new Date().toISOString().split('T')[0];
    const usage = getFromStorage('qentra_daily_usage');
    if (!usage || usage.date !== today) { 
        state.dailyUsage = { attemptUsed: false, chancesLeft: 3, date: today }; 
        saveToStorage('qentra_daily_usage', state.dailyUsage); 
    }
    else state.dailyUsage = usage;
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
    }
    else state.chatUsage = usage;
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
    const allowed = ['image/jpeg','image/png','image/webp'];
    if (!allowed.includes(file.type)) { 
        showError('error_invalid_image'); 
        return; 
    }
    if (file.size > 5*1024*1024) { 
        showError('error_size'); 
        return; 
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        state.currentImage = e.target.result;
        elements.previewImg.src = e.target.result;
        elements.fileName.textContent = file.name;
        elements.fileSize.textContent = (file.size/1024).toFixed(2) + ' KB';
        elements.uploadArea.style.display = 'none';
        elements.imagePreview.style.display = 'block';
        elements.errorMessage.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
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

// ============ DeepSeek API ============
async function callDeepSeek(imageBase64, prompt) {
    let imageData = imageBase64;
    if (imageBase64.includes(',')) {
        imageData = imageBase64.split(',')[1];
    }
    
    const payload = {
        model: DEEPSEEK_MODEL,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${imageData}`
                        }
                    }
                ]
            }
        ],
        max_tokens: 2000,
        temperature: 0.7
    };
    
    try {
        console.log('📤 إرسال طلب إلى DeepSeek...');
        
        const response = await fetch(DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ خطأ API:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
        }
        
        const data = await response.json();
        console.log('✅ استجابة DeepSeek:', data);
        
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        }
        throw new Error('No response from API');
        
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        throw error;
    }
}

// ============ Generate Questions ============
async function generateQuestions() {
    if (!state.currentImage) {
        showError('uploadFirst');
        return;
    }
    
    const usage = checkDailyUsage();
    if (usage.attemptUsed) {
        showError('dailyLimitReached');
        return;
    }
    
    showLoading(t('analyzing'));
    console.log('🟢 بدء توليد الأسئلة عبر DeepSeek');
    
    try {
        const compressed = await compressImage(state.currentImage);
        console.log('✅ تم ضغط الصورة');
        
        const prompt = `You are QENTRA AI. Look at this image carefully and generate EXACTLY 10 questions based on its content.
        
Rules:
- Questions 1-3: Easy level
- Questions 4-7: Medium level  
- Questions 8-10: Hard level

Return ONLY valid JSON format (no markdown, no extra text):
{
    "success": true,
    "questions": [
        {"number": 1, "difficulty": "easy", "question": "Question text here", "answer": "Answer text here"},
        {"number": 2, "difficulty": "easy", "question": "Question text here", "answer": "Answer text here"}
    ]
}

Important: If you cannot read the image clearly, return:
{"success": false, "error": "unclear"}

If the content is not educational, return:
{"success": false, "error": "inappropriate"}`;
        
        const text = await callDeepSeek(compressed, prompt);
        console.log('📝 النص الخام:', text);
        
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const match = cleanText.match(/\{[\s\S]*\}/);
        if (match) cleanText = match[0];
        
        let parsed;
        try {
            parsed = JSON.parse(cleanText);
        } catch(e) {
            console.error('❌ فشل تحليل JSON:', e);
            parsed = { success: false, error: 'unclear' };
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
            
        } else {
            updateDailyUsage(false);
            const left = state.dailyUsage.chancesLeft;
            
            if (parsed.error === 'inappropriate') {
                showError('error_inappropriate');
            } else if (parsed.error === 'insufficient') {
                showError('error_insufficient');
            } else {
                showError('error_unclear', ' ' + left + ' ' + t('chances_left'));
            }
        }
        
    } catch(e) {
        console.error('❌ خطأ في التوليد:', e);
        hideLoading();
        showError('error_connection');
        
        const errorMsg = document.getElementById('errorMessage');
        errorMsg.textContent = '❌ ' + e.message;
        errorMsg.style.display = 'block';
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
                <span class="question-number">Q${String(q.number).padStart(2,'0')}</span>
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
        num.textContent = 'Q' + String(q.number).padStart(2,'0') + ': ';
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
        const payload = {
            model: DEEPSEEK_MODEL,
            messages: [
                { role: 'system', content: 'You are QENTRA AI, an educational assistant specialized in helping students understand their study material. Answer in the same language as the user.' },
                { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
        };
        
        const response = await fetch(DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        hideTyping();
        
        if (response.ok && data.choices && data.choices[0]) {
            addChatMessage('ai', data.choices[0].message.content);
        } else {
            addChatMessage('ai', '❌ عذراً، حدث خطأ: ' + (data.error?.message || 'Unknown'));
        }
    } catch(e) {
        hideTyping();
        addChatMessage('ai', '❌ خطأ في الاتصال: ' + e.message);
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
    console.log('🚀 QENTRA AI initialized with DeepSeek API');
    console.log('📱 Device ID:', state.deviceId);
}

init();
