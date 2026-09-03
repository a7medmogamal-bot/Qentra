// ============ Configuration ============
const GROQ_API_KEY = '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';
const GROQ_MODEL = 'qwen/qwen3.6-27b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ============ System Prompt - Identity & Rules ============
const QENTRA_SYSTEM_PROMPT = `أنت Qentra، مساعد دراسي ذكي ومتخصص. هويتك وصفاتك:

1. هويتك:
   - اسمك Qentra (كينترا)
   - أنت مساعد دراسي متخصص، مهمتك الأساسية هي شرح المواد الدراسية وتوضيح المفاهيم الصعبة
   - أنت لست أداة لحل الواجبات، ولكنك مرشد لفهم المواد بشكل أعمق

2. تخصصاتك الأساسية:
   - اللغة العربية: إعراب، بلاغة، نحو، صرف، أدب، نصوص
   - اللغة الإنجليزية: قواعد، ترجمة، تحليل نصوص، محادثة
   - التاريخ: تاريخ مصر، تاريخ العالم، حضارات
   - الجغرافيا: خرائط، تضاريس، مناخ، دول
   - العلوم: فيزياء، كيمياء، أحياء (مفاهيم أساسية)
   - الرياضيات: (فقط المسائل المكتوبة بالإنجليزية، أما العربية فتشرح المفاهيم فقط)

3. قواعد السلوك الصارمة:
   - لا تخرج عن إطار الدراسة أبداً
   - لا ترسل أي روابط أو مواقع إلا إذا كانت من وزارة التربية والتعليم المصرية فقط (moe.gov.eg)
   - لا تحل واجبات الطالب، بل اشرح له المفاهيم واعده للفهم
   - أجوبتك مختصرة ومفيدة (3-4 جمل كحد أقصى)
   - استخدم نفس لغة المستخدم

4. طريقة الرد:
   - اشرح أولاً: وضح المفهوم أو القاعدة
   - ثم قدم سؤالاً تطبيقياً: "🎯 جرّب بنفسك: ..." بعد كل شرح
   - شجع الطالب على التفكير بنفسه`;

// ============ Translations ============
const translations = {
    ar: {
        uploadFirst: 'يرجى رفع صورة أولا',
        dailyLimitReached: 'لقد استخدمت توليد الأسئلة المجاني اليوم. حاول مرة أخرى غدا.',
        chatLimitReached: 'لقد استخدمت رسائلك العشرة اليوم. حاول مرة أخرى غدا.',
        analyzing: 'جاري التحليل مع Qentra...',
        error_connection: 'حدثت مشكلة في الاتصال بـ Qentra. جرب في وقت لاحق.',
        error_invalid_image: 'الصورة غير صالحة. يرجى رفع صورة JPG أو PNG أو WEBP.',
        error_size: 'حجم الصورة أكبر من 5 ميجابايت.',
        error_unclear: 'تعذر قراءة الصورة بوضوح. لديك ',
        chances_left: ' فرص متبقية اليوم.',
        no_chats: 'لا توجد محادثات بعد',
        placeholder: 'اسأل Qentra عن أي شيء...',
        dark_mode: 'داكن',
        light_mode: 'فاتح',
        explain_question: '📖 اشرح لي',
        study_mode: '📚 Qentra - مساعدك الدراسي',
        upload_coming: '📸 رفع الصور تحت التطوير - قريباً',
        math_english_only: '📐 للأسف، أنا متخصص في حل المسائل الرياضية المكتوبة بالإنجليزية فقط. لكن يمكنني مساعدتك في فهم المفاهيم الرياضية بالعربية!',
        about_me: 'أنا Qentra، مساعدك الدراسي الذكي. متخصص في: الإعراب وفروع اللغة العربية، اللغة الإنجليزية، التاريخ، الجغرافيا، والعلوم المختلفة.',
        give_question: '🎯 جرّب بنفسك',
        try_question: '📝 سؤال تطبيقي'
    },
    en: {
        uploadFirst: 'Please upload an image first',
        dailyLimitReached: 'You have used your free question generation today. Try again tomorrow.',
        chatLimitReached: 'You have used your 10 messages today. Try again tomorrow.',
        analyzing: 'Analyzing with Qentra...',
        error_connection: 'Connection error with Qentra. Try again later.',
        error_invalid_image: 'Invalid image. Please upload JPG, PNG, or WEBP.',
        error_size: 'Image size is larger than 5MB.',
        error_unclear: 'Could not read the image clearly. You have ',
        chances_left: ' chances left today.',
        no_chats: 'No chats yet',
        placeholder: 'Ask Qentra anything...',
        dark_mode: 'Dark',
        light_mode: 'Light',
        explain_question: '📖 Explain',
        study_mode: '📚 Qentra - Your Study Assistant',
        upload_coming: '📸 Image upload coming soon',
        math_english_only: '📐 I specialize in solving math problems written in English only. However, I can help you understand mathematical concepts in Arabic!',
        about_me: 'I am Qentra, your smart study assistant. Specialized in: Arabic grammar and branches, English language, History, Geography, and various sciences.',
        give_question: '🎯 Try it yourself',
        try_question: '📝 Practice Question'
    }
};

// ============ State ============
const state = {
    currentImage: null,
    currentQuestions: null,
    currentChatId: null,
    deviceId: null,
    settings: { theme: 'dark', language: 'ar' },
    chats: [],
    dailyUsage: { attemptUsed: false, chancesLeft: 3, date: null },
    chatUsage: { messagesUsed: 0, date: null },
    isProcessing: false,
    chatHistory: [],
    lastExplanation: null,
    isStudyMode: true
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

// ============ Helper Functions ============
function t(key) {
    return translations[state.settings.language][key] || key;
}

function saveToStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function getFromStorage(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
}

// ============ Settings ============
function loadSettings() {
    const settings = getFromStorage('qentra_settings');
    if (settings) {
        state.settings = { ...state.settings, ...settings };
    } else {
        state.settings.theme = 'dark';
    }
    applySettings();
}

function saveSettings() { saveToStorage('qentra_settings', state.settings); }

function applySettings() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    
    if (state.settings.theme === 'dark') {
        elements.darkThemeBtn.classList.add('active');
        elements.lightThemeBtn.classList.remove('active');
        elements.darkThemeBtn.style.background = '#000000';
        elements.darkThemeBtn.style.color = '#ffffff';
        elements.lightThemeBtn.style.background = 'transparent';
        elements.lightThemeBtn.style.color = 'var(--text-primary)';
    } else {
        elements.lightThemeBtn.classList.add('active');
        elements.darkThemeBtn.classList.remove('active');
        elements.lightThemeBtn.style.background = 'var(--accent)';
        elements.lightThemeBtn.style.color = '#ffffff';
        elements.darkThemeBtn.style.background = 'transparent';
        elements.darkThemeBtn.style.color = 'var(--text-primary)';
    }

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
    elements.darkThemeBtn.textContent = t('dark_mode');
    elements.lightThemeBtn.textContent = t('light_mode');
}

// ============ Chat History ============
function loadChats() {
    const chats = getFromStorage('qentra_chats');
    if (chats) state.chats = chats;
    renderChatList();
}

function saveChats() { saveToStorage('qentra_chats', state.chats); }

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
            if (c) {
                state.currentQuestions = c.questions || null;
                state.chatHistory = c.chatHistory || [];
                if (c.questions) {
                    displayQuestions(c.questions);
                }
                showView('home');
                if (c.chatHistory) {
                    elements.chatMessages.innerHTML = '';
                    c.chatHistory.forEach(msg => {
                        addChatMessage(msg.sender, msg.text);
                    });
                }
                elements.chatSection.style.display = 'block';
                elements.questionsSection.style.display = c.questions ? 'block' : 'none';
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

function hideLoading() { elements.loadingState.style.display = 'none'; }

function showError(key, extra) {
    let msg = t(key);
    if (extra) msg += extra;
    elements.errorMessage.textContent = msg;
    elements.errorMessage.style.display = 'block';
    hideLoading();
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

function canSendMessage() { return checkChatUsage().messagesUsed < 10; }

function incrementMessage() {
    state.chatUsage.messagesUsed++;
    saveToStorage('qentra_chat_usage', state.chatUsage);
}

// ============ File Upload (معطل - تحت التطوير) ============
function handleFileSelect(file) {
    showError('upload_coming');
    elements.fileInput.value = '';
}

function compressImage() {
    // معطل
}

// ============ Groq API ============
async function callGroqAPI(message, imageBase64 = null) {
    const content = imageBase64 ? [
        { type: 'text', text: QENTRA_SYSTEM_PROMPT + '\n\nالمستخدم: ' + message },
        { type: 'image_url', image_url: { url: imageBase64, detail: 'high' } }
    ] : [
        { type: 'text', text: QENTRA_SYSTEM_PROMPT + '\n\nالمستخدم: ' + message }
    ];

    const payload = {
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: content }],
        max_tokens: 1000,
        temperature: 0.7
    };

    try {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + GROQ_API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error('خطأ ' + response.status + ': ' + (data.error?.message || 'Unknown'));
        }
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        }
        throw new Error('لا توجد استجابة');
    } catch (error) {
        throw error;
    }
}

// ============ Chat Functions ============
function addChatMessage(sender, text, extraButtons = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message ' + sender;
    
    // Process text for question button
    let processedText = text;
    let hasQuestion = false;
    
    if (text.includes('🎯 جرّب بنفسك') || text.includes('📝 سؤال تطبيقي') || text.includes('Try it yourself')) {
        hasQuestion = true;
        const questionMatch = text.match(/(?:🎯 جرّب بنفسك|📝 سؤال تطبيقي|Try it yourself)[\s\S]*/);
        if (questionMatch) {
            state.lastExplanation = {
                fullText: text,
                question: questionMatch[0]
            };
        }
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.textContent = processedText;
    msgDiv.appendChild(contentDiv);
    
    if (hasQuestion || (sender === 'ai' && text.includes('؟'))) {
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;';
        
        const questionBtn = document.createElement('button');
        questionBtn.className = 'question-btn';
        questionBtn.textContent = t('give_question');
        questionBtn.style.cssText = `
            background: var(--accent);
            color: white;
            border: none;
            padding: 6px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.3s;
        `;
        questionBtn.onmouseover = () => { questionBtn.style.opacity = '0.8'; };
        questionBtn.onmouseout = () => { questionBtn.style.opacity = '1'; };
        
        questionBtn.addEventListener('click', function() {
            let questionToSend = '';
            if (state.lastExplanation && state.lastExplanation.question) {
                questionToSend = 'أعطني سؤالاً تطبيقياً مشابهاً: ' + state.lastExplanation.question;
            } else {
                const lines = text.split('\n');
                for (let line of lines) {
                    if (line.includes('؟') || line.includes('?')) {
                        questionToSend = 'أعطني سؤالاً مشابهاً: ' + line.trim();
                        break;
                    }
                }
                if (!questionToSend) {
                    questionToSend = 'أعطني سؤالاً تطبيقياً عن الموضوع الذي شرحته لي';
                }
            }
            elements.chatInput.value = questionToSend;
            sendChatMessage();
        });
        
        btnContainer.appendChild(questionBtn);
        msgDiv.appendChild(btnContainer);
    }
    
    elements.chatMessages.appendChild(msgDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    state.chatHistory.push({ sender, text });
    const chat = state.chats.find(c => c.id === state.currentChatId);
    if (chat) {
        chat.chatHistory = state.chatHistory;
        saveChats();
    }
}

function showTyping() {
    elements.typingIndicator.style.display = 'flex';
    elements.chatMessages.appendChild(elements.typingIndicator);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function hideTyping() { elements.typingIndicator.style.display = 'none'; }

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
        const response = await callGroqAPI(message);
        hideTyping();
        addChatMessage('ai', response);
    } catch (e) {
        hideTyping();
        addChatMessage('ai', t('error_connection'));
    }
}

// ============ Generate Questions (معطل - تحت التطوير) ============
async function generateQuestions() {
    showError('upload_coming');
}

function displayQuestions(questions) {
    // معطل
}

function displayAnswers() {
    // معطل
}

function showChat() { 
    elements.chatSection.style.display = 'block'; 
}

// ============ Events ============
elements.landingBtn.addEventListener('click', () => {
    saveToStorage('qentra_seen_landing', true);
    elements.landingOverlay.style.display = 'none';
    elements.appContainer.style.display = 'flex';
    elements.chatSection.style.display = 'block';
    setTimeout(() => {
        addChatMessage('ai', '📚 أهلاً بك في Qentra! أنا مساعدك الدراسي الذكي.\n\nمتخصص في:\n• اللغة العربية (إعراب، نحو، بلاغة)\n• اللغة الإنجليزية\n• التاريخ والجغرافيا\n• العلوم المختلفة\n\nاسألني عن أي شيء تريد فهمه، وسأشرح لك بطريقة مبسطة مع سؤال تطبيقي لتتأكد من فهمك. 🎯');
    }, 500);
});

elements.mobileMenuBtn.addEventListener('click', () => elements.sidebar.classList.toggle('open'));

elements.newChatBtn.addEventListener('click', () => {
    state.currentImage = null;
    state.currentQuestions = null;
    state.chatHistory = [];
    state.lastExplanation = null;
    state.currentChatId = 'chat_' + Date.now();
    elements.questionsSection.style.display = 'none';
    elements.chatSection.style.display = 'block';
    elements.uploadArea.style.display = 'block';
    elements.imagePreview.style.display = 'none';
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    elements.chatMessages.innerHTML = '';
    showView('home');
    addChatMessage('ai', '📚 مرحباً! اسألني عن أي موضوع دراسي، وسأشرح لك بإيجاز مع سؤال تطبيقي. 🎯');
});

elements.plansBtn.addEventListener('click', () => showView('plans'));
elements.plansBackBtn.addEventListener('click', () => showView('home'));
elements.settingsBtn.addEventListener('click', () => showView('settings'));
elements.backBtn.addEventListener('click', () => showView('home'));

// ============ زر رفع الصور معطل ============
elements.browseBtn.addEventListener('click', () => {
    showError('upload_coming');
});
elements.uploadArea.addEventListener('click', () => {
    showError('upload_coming');
});
elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        showError('upload_coming');
        elements.fileInput.value = '';
    }
});

elements.generateBtn.addEventListener('click', generateQuestions);
elements.showAnswersBtn.addEventListener('click', displayAnswers);

elements.newQuestionsBtn.addEventListener('click', () => {
    elements.questionsSection.style.display = 'none';
    elements.chatSection.style.display = 'block';
    elements.uploadArea.style.display = 'block';
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    state.currentQuestions = null;
    state.currentImage = null;
    elements.imagePreview.style.display = 'none';
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
    if (state.chatHistory.length > 0) {
        saveToStorage('qentra_current_session', {
            chatId: state.currentChatId,
            questions: state.currentQuestions,
            chatHistory: state.chatHistory,
            timestamp: Date.now()
        });
    }
});

// ============ Init ============
function init() {
    state.deviceId = getFromStorage('qentra_device_id');
    if (!state.deviceId) {
        state.deviceId = 'device_' + Date.now().toString(36);
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
        elements.chatSection.style.display = 'block';
        
        const session = getFromStorage('qentra_current_session');
        if (session && session.chatHistory && session.chatHistory.length > 0) {
            state.currentQuestions = session.questions || null;
            state.chatHistory = session.chatHistory || [];
            if (session.questions) {
                displayQuestions(session.questions);
            }
            session.chatHistory.forEach(msg => {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'chat-message ' + msg.sender;
                msgDiv.textContent = msg.text;
                elements.chatMessages.appendChild(msgDiv);
            });
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        } else {
            setTimeout(() => {
                addChatMessage('ai', '📚 أهلاً بك في Qentra! أنا مساعدك الدراسي الذكي.\n\nمتخصص في:\n• اللغة العربية (إعراب، نحو، بلاغة)\n• اللغة الإنجليزية\n• التاريخ والجغرافيا\n• العلوم المختلفة\n\nاسألني عن أي شيء تريد فهمه، وسأشرح لك بطريقة مبسطة مع سؤال تطبيقي لتتأكد من فهمك. 🎯');
            }, 500);
        }
    }

    showView('home');
    console.log('QENTRA AI - Study Assistant initialized');
}

init();
