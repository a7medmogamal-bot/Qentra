const GEMINI_API_KEY = 'AIzaSyDvZKxAB4BT3iQmAc721NSu-y9sw16xACo';
const GEMINI_MODEL = 'gemini-3.6-flash';

const state = {
    currentImage: null,
    currentQuestions: null,
    currentChatId: null,
    deviceId: null,
    settings: {
        theme: 'light',
        language: 'en'
    },
    chats: [],
    dailyUsage: {
        attemptUsed: false,
        chancesLeft: 3,
        date: null
    }
};

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
    lightThemeBtn: document.getElementById('lightThemeBtn'),
    darkThemeBtn: document.getElementById('darkThemeBtn'),
    enLangBtn: document.getElementById('enLangBtn'),
    arLangBtn: document.getElementById('arLangBtn')
};

function generateDeviceId() {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        navigator.hardwareConcurrency,
        navigator.platform,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    ];
    
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
    } catch (error) {
        console.error('Storage error:', error);
    }
}

function getFromStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
}

function checkDailyUsage() {
    const today = new Date().toISOString().split('T')[0];
    const usage = getFromStorage('qentra_daily_usage');
    
    if (!usage || usage.date !== today) {
        state.dailyUsage = {
            attemptUsed: false,
            chancesLeft: 3,
            date: today
        };
        saveToStorage('qentra_daily_usage', state.dailyUsage);
    } else {
        state.dailyUsage = usage;
    }
    
    return state.dailyUsage;
}

function updateDailyUsage(success) {
    if (success) {
        state.dailyUsage.attemptUsed = true;
        state.dailyUsage.chancesLeft = 0;
    } else {
        state.dailyUsage.chancesLeft--;
        if (state.dailyUsage.chancesLeft <= 0) {
            state.dailyUsage.attemptUsed = true;
        }
    }
    saveToStorage('qentra_daily_usage', state.dailyUsage);
}

function loadSettings() {
    const settings = getFromStorage('qentra_settings');
    if (settings) {
        state.settings = { ...state.settings, ...settings };
    }
    applySettings();
}

function saveSettings() {
    saveToStorage('qentra_settings', state.settings);
}

function applySettings() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    
    if (state.settings.theme === 'dark') {
        elements.darkThemeBtn.classList.add('active');
        elements.lightThemeBtn.classList.remove('active');
    } else {
        elements.lightThemeBtn.classList.add('active');
        elements.darkThemeBtn.classList.remove('active');
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
}

function loadChats() {
    const chats = getFromStorage('qentra_chats');
    if (chats) {
        state.chats = chats;
    }
    renderChatList();
}

function saveChats() {
    saveToStorage('qentra_chats', state.chats);
}

function renderChatList() {
    elements.chatList.innerHTML = '';
    
    if (state.chats.length === 0) {
        elements.chatList.innerHTML = '<p style="color: var(--text-muted); font-size: 13px; padding: 8px;">No chats yet</p>';
        return;
    }
    
    state.chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.dataset.chatId = chat.id;
        
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        
        icon.appendChild(path);
        
        const preview = document.createElement('span');
        preview.className = 'chat-preview';
        preview.textContent = chat.preview || 'Chat';
        
        chatItem.appendChild(icon);
        chatItem.appendChild(preview);
        
        chatItem.addEventListener('click', () => {
            loadChatFromHistory(chat.id);
        });
        
        elements.chatList.appendChild(chatItem);
    });
}

function loadChatFromHistory(chatId) {
    const chat = state.chats.find(c => c.id === chatId);
    if (chat && chat.questions) {
        state.currentChatId = chatId;
        state.currentQuestions = chat.questions;
        displayQuestions(chat.questions);
        showView('home');
    }
}

function showView(view) {
    elements.homeView.style.display = 'none';
    elements.plansView.style.display = 'none';
    elements.settingsView.style.display = 'none';
    
    if (view === 'home') elements.homeView.style.display = 'block';
    else if (view === 'plans') elements.plansView.style.display = 'block';
    else if (view === 'settings') elements.settingsView.style.display = 'block';
    
    elements.sidebar.classList.remove('open');
}

function showLoading(message) {
    elements.loadingState.style.display = 'block';
    elements.loadingText.textContent = message;
    elements.errorMessage.style.display = 'none';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

function resetUI() {
    state.currentImage = null;
    state.currentQuestions = null;
    
    elements.uploadArea.style.display = 'block';
    elements.imagePreview.style.display = 'none';
    elements.loadingState.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.questionsSection.style.display = 'none';
    elements.chatSection.style.display = 'none';
    elements.answersList.style.display = 'none';
    elements.showAnswersBtn.style.display = 'block';
    
    elements.fileInput.value = '';
    elements.previewImg.src = '';
    elements.fileName.textContent = '';
    elements.fileSize.textContent = '';
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    elements.chatMessages.innerHTML = '';
    elements.chatInput.value = '';
}

function handleFileSelect(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
        showError('Please upload a valid image (JPG, PNG, or WEBP).');
        return;
    }
    
    if (file.size > maxSize) {
        showError('Image size must be less than 5MB.');
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

function compressImage(dataUrl, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}

async function callGemini(imageBase64, prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt },
                        { 
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: imageBase64.split(',')[1] || imageBase64
                            }
                        }
                    ]
                }
            ]
        })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response from Gemini');
}

const QUESTION_PROMPT = `You are QENTRA AI, an educational assessment tool.

YOUR PRIMARY SPECIALTY:
Mathematics content in ENGLISH.
You are an EXPERT in English Mathematics.

YOUR GENERAL CAPABILITY:
You can process ALL educational content.

SPECIAL CASE - ARABIC MATHEMATICS:
If the image contains Mathematics in ARABIC:
1. If you recognize it: Generate questions with note "These questions may not be fully accurate as I specialize in English Mathematics"
2. If you CANNOT recognize it: Return { "success": false, "error": "math_apology" }

CONTENT MODERATION:
Reject: Adult content, Violence, Hate speech, Harassment, Drugs, Weapons.

STRICT RULES:
- Generate EXACTLY 10 questions
- Questions based ONLY on the uploaded image
- Questions 1-3: Easy (definitions, facts)
- Questions 4-7: Medium (relationships, understanding)
- Questions 8-10: Hard (reasoning, connections)
- Do NOT solve homework
- Do NOT use outside knowledge

RETURN ONLY VALID JSON:
{
  "success": true,
  "questions": [
    {
      "number": 1,
      "difficulty": "easy",
      "question": "Question text",
      "answer": "Answer text"
    }
  ]
}

For errors:
{ "success": false, "error": "error_type" }
`;

async function generateQuestions() {
    if (!state.currentImage) {
        showError('Please upload an image first.');
        return;
    }
    
    const usage = checkDailyUsage();
    
    if (usage.attemptUsed) {
        showError('You have used your free generation for today. Try again tomorrow.');
        return;
    }
    
    hideError();
    showLoading('Analyzing your material...');
    
    try {
        const compressedImage = await compressImage(state.currentImage);
        const text = await callGemini(compressedImage, QUESTION_PROMPT);
        
        let parsedResponse;
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedResponse = JSON.parse(cleanText);
        } catch (error) {
            parsedResponse = { success: false, error: 'unclear_image' };
        }
        
        if (parsedResponse.success && parsedResponse.questions && parsedResponse.questions.length === 10) {
            hideLoading();
            state.currentQuestions = parsedResponse.questions;
            displayQuestions(parsedResponse.questions);
            showChat();
            addChatToHistory(parsedResponse.questions);
            updateDailyUsage(true);
        } else {
            hideLoading();
            updateDailyUsage(false);
            
            const chancesLeft = state.dailyUsage.chancesLeft;
            
            if (parsedResponse.error === 'math_apology') {
                showError('I apologize, I am specialized in Mathematics.');
            } else if (parsedResponse.error === 'inappropriate_content') {
                showError('This content is not appropriate for educational use.');
            } else if (parsedResponse.error === 'insufficient_content') {
                showError('Not enough information to generate 10 questions.');
            } else {
                showError('Could not read the image clearly. You have ' + chancesLeft + ' chances left.');
            }
        }
    } catch (error) {
        hideLoading();
        console.error('API error:', error);
        showError('Something went wrong. Please try again.');
    }
}

function addChatToHistory(questions) {
    const chatData = {
        id: state.currentChatId || 'chat_' + Date.now(),
        preview: questions[0] ? questions[0].question.substring(0, 30) + '...' : 'Questions',
        questions: questions,
        date: new Date().toISOString()
    };
    
    state.chats.unshift(chatData);
    if (state.chats.length > 50) {
        state.chats = state.chats.slice(0, 50);
    }
    
    saveChats();
    renderChatList();
}

function displayQuestions(questions) {
    elements.questionsList.innerHTML = '';
    elements.answersList.innerHTML = '';
    elements.answersList.style.display = 'none';
    elements.showAnswersBtn.style.display = 'block';
    
    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card';
        
        const header = document.createElement('div');
        header.className = 'question-header';
        
        const number = document.createElement('span');
        number.className = 'question-number';
        number.textContent = 'Q' + String(q.number).padStart(2, '0');
        
        const badge = document.createElement('span');
        badge.className = 'difficulty-badge difficulty-' + q.difficulty;
        badge.textContent = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
        
        header.appendChild(number);
        header.appendChild(badge);
        
        const text = document.createElement('p');
        text.className = 'question-text';
        text.textContent = q.question;
        
        card.appendChild(header);
        card.appendChild(text);
        
        elements.questionsList.appendChild(card);
    });
    
    elements.questionsSection.style.display = 'block';
    elements.imagePreview.style.display = 'none';
    elements.uploadArea.style.display = 'none';
    elements.questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayAnswers() {
    if (!state.currentQuestions) return;
    
    elements.answersList.innerHTML = '';
    
    state.currentQuestions.forEach(q => {
        const item = document.createElement('div');
        item.className = 'answer-item';
        
        const number = document.createElement('span');
        number.className = 'answer-number';
        number.textContent = 'Q' + String(q.number).padStart(2, '0') + ': ';
        
        const text = document.createElement('span');
        text.textContent = q.answer;
        
        item.appendChild(number);
        item.appendChild(text);
        elements.answersList.appendChild(item);
    });
    
    elements.answersList.style.display = 'block';
    elements.showAnswersBtn.style.display = 'none';
}

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

async function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    addChatMessage('user', message);
    elements.chatInput.value = '';
    
    const context = state.currentQuestions ? JSON.stringify(state.currentQuestions) : '';
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { 
                                text: `You are QENTRA AI. Answer based on these questions:\n${context}\n\nUser question: ${message}` 
                            }
                        ]
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            addChatMessage('ai', reply);
        } else {
            addChatMessage('ai', 'Sorry, an error occurred.');
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage('ai', 'Sorry, an error occurred.');
    }
}

// Event Listeners
elements.landingBtn.addEventListener('click', () => {
    saveToStorage('qentra_seen_landing', true);
    elements.landingOverlay.style.display = 'none';
    elements.appContainer.style.display = 'flex';
});

elements.mobileMenuBtn.addEventListener('click', () => {
    elements.sidebar.classList.toggle('open');
});

elements.newChatBtn.addEventListener('click', () => {
    state.currentChatId = 'chat_' + Date.now();
    resetUI();
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
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
});

elements.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
});

elements.removeBtn.addEventListener('click', () => {
    state.currentImage = null;
    elements.imagePreview.style.display = 'none';
    elements.uploadArea.style.display = 'block';
    elements.fileInput.value = '';
});

elements.generateBtn.addEventListener('click', generateQuestions);
elements.showAnswersBtn.addEventListener('click', displayAnswers);

elements.newQuestionsBtn.addEventListener('click', () => {
    state.currentChatId = 'chat_' + Date.now();
    resetUI();
    showView('home');
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

elements.enLangBtn.addEventListener('click', () => {
    state.settings.language = 'en';
    saveSettings();
    applySettings();
});

elements.arLangBtn.addEventListener('click', () => {
    state.settings.language = 'ar';
    saveSettings();
    applySettings();
});

elements.sendChatBtn.addEventListener('click', sendChatMessage);

elements.chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

// Init
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
    
    const hasSeenLanding = getFromStorage('qentra_seen_landing');
    
    if (!hasSeenLanding) {
        elements.landingOverlay.style.display = 'flex';
        elements.appContainer.style.display = 'none';
    } else {
        elements.landingOverlay.style.display = 'none';
        elements.appContainer.style.display = 'flex';
    }
    
    resetUI();
    showView('home');
}

init();
