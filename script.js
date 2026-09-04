/* ============================================================
   QENTRA AI - الملف الكامل (نسخة التفعيل الحقيقي)
   ============================================================ */

// ===== Configuration =====
const GEMINI_CONFIG = {
    model: 'gemini-3.6-flash',
    apiVersion: 'v1beta',
    baseUrl: 'https://generativelanguage.googleapis.com',
    maxRetries: 2,
    timeout: 30000,
    temperature: 0.7,
    maxTokens: 8192
};

// ===== متغير API الرئيسي - يتحط فيه المفتاح بعد التفعيل =====
let QENTRA_API_KEY = '';

// ===== Translations =====
const TRANSLATIONS = {
    ar: {
        uploadFirst: 'يرجى رفع صورة أولاً',
        dailyLimitReached: 'لقد استخدمت حصتك اليومية من توليد الأسئلة. حاول مرة أخرى غداً.',
        chatLimitReached: 'لقد استخدمت رسائلك العشر اليومية. حاول مرة أخرى غداً.',
        analyzing: 'جاري تحليل المادة مع QENTRA...',
        connectionError: 'حدثت مشكلة في الاتصال بـ QENTRA. حاول في وقت لاحق.',
        invalidImage: 'الصورة غير صالحة. يرجى رفع صورة JPG أو PNG أو WEBP.',
        imageTooLarge: 'حجم الصورة أكبر من 5 ميجابايت.',
        imageUnclear: 'تعذر قراءة الصورة بوضوح. لديك ',
        chancesLeft: ' فرص متبقية اليوم.',
        noChats: 'لا توجد محادثات بعد',
        placeholder: 'اسأل عن الأسئلة...',
        apiKeyRequired: 'يرجى إدخال مفتاح API في الإعدادات',
        apiKeyInvalid: 'مفتاح API غير صالح',
        apiKeySaved: 'تم حفظ وتفعيل مفتاح API بنجاح',
        apiKeyError: 'حدث خطأ في حفظ المفتاح',
        questionsGenerated: 'تم توليد 15 سؤالاً بنجاح',
        generating: 'جاري توليد الأسئلة...',
        showAnswers: 'عرض الإجابات والشروح',
        noQuestions: 'لم يتم العثور على أسئلة',
        themeChanged: 'تم تغيير المظهر',
        languageChanged: 'تم تغيير اللغة',
        success: 'نجاح',
        error: 'خطأ',
        warning: 'تحذير',
        info: 'معلومة',
        activating: 'جاري تفعيل المفتاح...',
        activateNow: 'تفعيل المفتاح',
        keyActive: 'المفتاح مفعل',
        keyInactive: 'المفتاح غير مفعل',
        testing: 'جاري اختبار المفتاح...',
        testSuccess: 'المفتاح يعمل بشكل صحيح',
        testFailed: 'المفتاح غير صالح'
    },
    en: {
        uploadFirst: 'Please upload an image first',
        dailyLimitReached: 'You have used your daily question generation. Try again tomorrow.',
        chatLimitReached: 'You have used your 10 daily messages. Try again tomorrow.',
        analyzing: 'Analyzing material with QENTRA...',
        connectionError: 'Connection error with QENTRA. Try again later.',
        invalidImage: 'Invalid image. Please upload JPG, PNG, or WEBP.',
        imageTooLarge: 'Image size exceeds 5MB.',
        imageUnclear: 'Could not read the image clearly. You have ',
        chancesLeft: ' chances left today.',
        noChats: 'No chats yet',
        placeholder: 'Ask about the questions...',
        apiKeyRequired: 'Please enter an API Key in settings',
        apiKeyInvalid: 'Invalid API Key',
        apiKeySaved: 'API Key saved and activated successfully',
        apiKeyError: 'Error saving API Key',
        questionsGenerated: '15 questions generated successfully',
        generating: 'Generating questions...',
        showAnswers: 'Show Answers & Explanations',
        noQuestions: 'No questions found',
        themeChanged: 'Theme changed',
        languageChanged: 'Language changed',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        activating: 'Activating API Key...',
        activateNow: 'Activate Key',
        keyActive: 'Key Active',
        keyInactive: 'Key Inactive',
        testing: 'Testing API Key...',
        testSuccess: 'API Key is working properly',
        testFailed: 'API Key is invalid'
    }
};

// ===== State =====
const state = {
    currentImage: null,
    currentQuestions: null,
    currentChatId: null,
    deviceId: null,
    apiKey: null,
    settings: { theme: 'light', language: 'ar' },
    chats: [],
    dailyUsage: { attemptUsed: false, chancesLeft: 3, date: null },
    chatUsage: { messagesUsed: 0, date: null },
    isProcessing: false,
    isApiKeyValid: false,
    isActivating: false
};

// ===== DOM Elements =====
const $ = id => document.getElementById(id);
const els = {
    landingOverlay: $('landingOverlay'),
    landingBtn: $('landingBtn'),
    appContainer: $('appContainer'),
    sidebar: $('sidebar'),
    mobileMenuBtn: $('mobileMenuBtn'),
    newChatBtn: $('newChatBtn'),
    settingsBtn: $('settingsBtn'),
    backBtn: $('backBtn'),
    chatList: $('chatList'),
    homeView: $('homeView'),
    settingsView: $('settingsView'),
    uploadArea: $('uploadArea'),
    browseBtn: $('browseBtn'),
    fileInput: $('fileInput'),
    imagePreview: $('imagePreview'),
    previewImg: $('previewImg'),
    fileName: $('fileName'),
    fileSize: $('fileSize'),
    removeBtn: $('removeBtn'),
    generateBtn: $('generateBtn'),
    loadingState: $('loadingState'),
    loadingText: $('loadingText'),
    timerDisplay: $('timerDisplay'),
    progressBar: $('progressBar'),
    notificationContainer: $('notificationContainer'),
    notificationIcon: $('notificationIcon'),
    notificationMessage: $('notificationMessage'),
    notificationClose: $('notificationClose'),
    questionsSection: $('questionsSection'),
    questionsList: $('questionsList'),
    showAnswersBtn: $('showAnswersBtn'),
    answersList: $('answersList'),
    newQuestionsBtn: $('newQuestionsBtn'),
    chatSection: $('chatSection'),
    chatMessages: $('chatMessages'),
    chatInput: $('chatInput'),
    sendChatBtn: $('sendChatBtn'),
    chatMessagesCount: $('chatMessagesCount'),
    typingIndicator: $('typingIndicator'),
    lightThemeBtn: $('lightThemeBtn'),
    darkThemeBtn: $('darkThemeBtn'),
    arLangBtn: $('arLangBtn'),
    enLangBtn: $('enLangBtn'),
    apiKeyInput: $('apiKeyInput'),
    toggleApiKeyVisibility: $('toggleApiKeyVisibility'),
    saveApiKeyBtn: $('saveApiKeyBtn'),
    apiKeyStatus: $('apiKeyStatus'),
    statusDot: $('statusDot'),
    statusText: $('statusText')
};

// ===== Helpers =====
function t(key) {
    return TRANSLATIONS[state.settings.language]?.[key] || key;
}

function saveToStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function getFromStorage(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch(e) { return null; }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ===== ============================================================
// ===== نظام تفعيل API الحقيقي - زي ما كان في الكود الأولاني =====
// ===== ============================================================

class ApiKeyActivator {
    constructor() {
        this.isActivating = false;
        this.apiKey = null;
        this.progressInterval = null;
    }

    // ===== 1. التفعيل الكامل =====
    async activateKey(apiKey) {
        if (this.isActivating) {
            return { success: false, message: 'جاري التفعيل بالفعل...' };
        }

        this.isActivating = true;
        this.apiKey = apiKey;

        // عرض شاشة التحميل
        this.showLoading('جاري تفعيل المفتاح...');

        try {
            // ===== الخطوة 1: حفظ المفتاح =====
            this.saveKey(apiKey);
            this.updateProgress(20, 'تم حفظ المفتاح');

            // ===== الخطوة 2: تحديث المتغير العام =====
            this.updateGlobalKey(apiKey);
            this.updateProgress(40, 'تم تحديث المتغيرات');

            // ===== الخطوة 3: اختبار المفتاح الحقيقي =====
            this.updateProgress(60, 'جاري اختبار المفتاح...');
            const testResult = await this.testKeyReal(apiKey);

            if (testResult.success) {
                this.updateProgress(90, 'المفتاح يعمل بشكل صحيح');
                await this.sleep(300);
                this.updateProgress(100, 'تم التفعيل بنجاح');
                
                this.showSuccess('تم تفعيل المفتاح بنجاح!');
                return { success: true, message: 'المفتاح يعمل بشكل صحيح', response: testResult.response };
            } else {
                this.showError(testResult.message);
                this.clearKey();
                return { success: false, message: testResult.message };
            }

        } catch (error) {
            this.showError('حدث خطأ أثناء التفعيل: ' + error.message);
            this.clearKey();
            return { success: false, message: error.message };
        } finally {
            this.isActivating = false;
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
            setTimeout(() => this.hideLoading(), 1500);
        }
    }

    // ===== 2. حفظ المفتاح =====
    saveKey(apiKey) {
        // تشفير بسيط
        const encrypted = this.encryptKey(apiKey);
        localStorage.setItem('qentra_api_key_encrypted', encrypted);
        localStorage.setItem('qentra_api_key_date', new Date().toISOString());
        sessionStorage.setItem('qentra_api_key', apiKey);
    }

    encryptKey(apiKey) {
        let result = '';
        for (let i = 0; i < apiKey.length; i++) {
            const code = apiKey.charCodeAt(i) ^ 42;
            result += String.fromCharCode(code);
        }
        return btoa(result);
    }

    decryptKey(encrypted) {
        try {
            const decoded = atob(encrypted);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const code = decoded.charCodeAt(i) ^ 42;
                result += String.fromCharCode(code);
            }
            return result;
        } catch { return null; }
    }

    getStoredKey() {
        const encrypted = localStorage.getItem('qentra_api_key_encrypted');
        if (encrypted) {
            return this.decryptKey(encrypted);
        }
        return null;
    }

    // ===== 3. تحديث المتغير العام =====
    updateGlobalKey(apiKey) {
        QENTRA_API_KEY = apiKey;
        window.QENTRA_API_KEY = apiKey;
        state.apiKey = apiKey;
        
        // تحديث التطبيق
        window.dispatchEvent(new CustomEvent('apiKeyUpdated', {
            detail: { apiKey: apiKey }
        }));
    }

    // ===== 4. اختبار المفتاح الحقيقي - نفس الطريقة القديمة =====
    async testKeyReal(apiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: 'مرحباً، أجب بكلمة واحدة: نعم' }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 10
                    }
                }),
                signal: AbortSignal.timeout(15000)
            });

            const data = await response.json();

            if (response.ok) {
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                
                if (text && text.length > 0) {
                    return {
                        success: true,
                        message: 'المفتاح يعمل بشكل صحيح',
                        response: text
                    };
                } else {
                    return {
                        success: false,
                        message: 'تم استلام استجابة فارغة من الخادم'
                    };
                }
            } else {
                const errorMsg = data.error?.message || 'خطأ غير معروف';
                return {
                    success: false,
                    message: errorMsg
                };
            }

        } catch (error) {
            return {
                success: false,
                message: 'فشل الاتصال بالخادم: ' + error.message
            };
        }
    }

    // ===== 5. حذف المفتاح =====
    clearKey() {
        localStorage.removeItem('qentra_api_key_encrypted');
        localStorage.removeItem('qentra_api_key_date');
        sessionStorage.removeItem('qentra_api_key');
        QENTRA_API_KEY = '';
        window.QENTRA_API_KEY = '';
        state.apiKey = null;
        state.isApiKeyValid = false;
    }

    // ===== 6. واجهة التحميل =====
    showLoading(message) {
        const container = document.getElementById('activationLoading');
        if (!container) return;

        container.style.display = 'block';
        container.innerHTML = `
            <div class="activation-loading">
                <div class="activation-spinner"></div>
                <p class="activation-message">${message}</p>
                <div class="activation-progress">
                    <div class="activation-progress-bar" id="activationProgressBar" style="width:0%"></div>
                </div>
                <p class="activation-status" id="activationStatus">جاري التهيئة...</p>
            </div>
        `;
    }

    updateProgress(percent, status) {
        const bar = document.getElementById('activationProgressBar');
        const statusEl = document.getElementById('activationStatus');
        
        if (bar) {
            bar.style.width = Math.min(percent, 100) + '%';
        }
        if (statusEl) {
            statusEl.textContent = status || '';
        }
    }

    hideLoading() {
        const container = document.getElementById('activationLoading');
        if (container) {
            container.style.display = 'none';
        }
    }

    showSuccess(message) {
        const container = document.getElementById('activationLoading');
        if (!container) return;

        container.innerHTML = `
            <div class="activation-success">
                <span class="activation-icon">✓</span>
                <p class="activation-message">${message}</p>
                <button class="activation-btn" onclick="this.closest('#activationLoading').style.display='none'">
                    متابعة
                </button>
            </div>
        `;
        container.style.display = 'block';
    }

    showError(message) {
        const container = document.getElementById('activationLoading');
        if (!container) return;

        container.innerHTML = `
            <div class="activation-error">
                <span class="activation-icon">✕</span>
                <p class="activation-message">${message}</p>
                <button class="activation-btn" onclick="this.closest('#activationLoading').style.display='none'">
                    حاول مرة أخرى
                </button>
            </div>
        `;
        container.style.display = 'block';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== ============================================================
// ===== Gemini API Call - تستخدم المفتاح المفعل =====
// ===== ============================================================

async function callGeminiAPI(imageBase64, prompt) {
    // التحقق من وجود المفتاح
    if (!QENTRA_API_KEY && !state.apiKey) {
        throw new Error('API Key not activated');
    }

    const apiKey = QENTRA_API_KEY || state.apiKey;
    
    let imageData = imageBase64;
    if (imageBase64.includes(',')) {
        imageData = imageBase64.split(',')[1];
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inline_data: { mime_type: 'image/jpeg', data: imageData } }
            ]
        }],
        generationConfig: {
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxTokens
        }
    };

    let lastError;
    for (let attempt = 0; attempt < GEMINI_CONFIG.maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(GEMINI_CONFIG.timeout)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error?.message || 'Unknown error';
                throw new Error('API Error: ' + errorMsg);
            }

            if (data.candidates && data.candidates[0]) {
                return data.candidates[0].content.parts[0].text;
            }
            throw new Error('No response from Gemini');
        } catch (error) {
            lastError = error;
            if (attempt < GEMINI_CONFIG.maxRetries - 1) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            }
        }
    }
    throw lastError;
}

// ===== ============================================================
// ===== System Prompt =====
// ===== ============================================================

const SYSTEM_PROMPT = `
أنت QENTRA AI، مساعد تعليمي ذكي ومتخصص في تحليل المواد الدراسية.

قواعد صارمة:
1. لا تحلل أي محتوى غير لائق أو خارج الإطار الدراسي
2. لا ترسل أي روابط أو مراجع خارجية
3. لا تخرج عن سياق المادة الدراسية المرفقة
4. لا تذكر أي شيء عن Google أو Gemini أو أي نموذج خارجي
5. تحدث دائماً بصيغة "أنا QENTRA" بضمير المتكلم
6. أجب باللغة العربية فقط
7. لا تستخدم الرموز التعبيرية في أي رد

المهمة:
من الصورة المرفقة، قم باستخراج 15 سؤالاً ذكياً مقسمة كالتالي:
- الأسئلة 1-5: سهلة (فهم واستيعاب)
- الأسئلة 6-10: متوسطة (تحليل وتطبيق)
- الأسئلة 11-15: صعبة (نقد واستنتاج)

أنواع الأسئلة حسب المادة:

اللغة العربية:
- أعرب الجملة التالية
- حدد نوع الصورة البيانية
- استخرج الضمائر/الأفعال/الحروف
- حلل الجملة نحوياً
- ما هو المحسن البديعي

العلوم:
- علل: لماذا يحدث كذا
- قارن بين الظاهرتين
- ما العلاقة بين كذا وكذا
- فسر علمياً ما يحدث
- ما النتائج المترتبة على كذا

الرياضيات:
- استخدم الأرقام الإنجليزية فقط (X+7=6)
- لا تستخدم الأرقام العربية (س+٦=٧)
- حل المعادلة
- أوجد الناتج
- برهن على صحة المسألة

التاريخ والجغرافيا:
- بم تفسر حدوث كذا
- حدد مصداقية العبارة (صحيحة أم خاطئة ولماذا)
- دلل على صحة العبارة مع ذكر الدليل
- ما النتائج المترتبة على الحدث
- قارن بين الحقبتين

لكل سؤال يجب تقديم:
- السؤال نفسه
- الإجابة النموذجية
- شرح تفصيلي للحل (لا يقل عن 3 أسطر)

المخرجات المطلوبة (JSON فقط):
{
  "success": true,
  "subject": "arabic|science|math|history|geography",
  "questions": [
    {
      "number": 1,
      "difficulty": "easy",
      "type": "نوع السؤال",
      "question": "نص السؤال",
      "answer": "الإجابة النموذجية",
      "explanation": "الشرح التفصيلي (3+ أسطر)"
    }
  ]
}

إذا كانت الصورة غير واضحة أو لا تحتوي على مادة دراسية:
{
  "success": false,
  "error": "unclear"
}
`;

// ===== ============================================================
// ===== Timer System =====
// ===== ============================================================

class QuestionTimer {
    constructor() {
        this.startTime = null;
        this.duration = 0;
        this.interval = null;
        this.callback = null;
        this.minDuration = 5000;
        this.maxDuration = 30000;
    }

    estimateTime(imageSize, questionCount = 15) {
        const sizeKB = imageSize / 1024;
        let baseTime = 3000;
        if (sizeKB > 1000) baseTime = 5000;
        if (sizeKB > 2000) baseTime = 7000;
        if (sizeKB > 3000) baseTime = 10000;
        const questionTime = questionCount * 500;
        const detailTime = questionCount * 200;
        let total = baseTime + questionTime + detailTime;
        total = Math.max(total, this.minDuration);
        total = Math.min(total, this.maxDuration);
        return total;
    }

    start(estimatedTime, onComplete) {
        this.startTime = Date.now();
        this.duration = estimatedTime;
        this.callback = onComplete;
        let remaining = Math.ceil(estimatedTime / 1000);
        this.updateDisplay(remaining);
        this.interval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const remainingMs = this.duration - elapsed;
            if (remainingMs <= 0) {
                this.stop();
                if (this.callback) this.callback();
                return;
            }
            const seconds = Math.ceil(remainingMs / 1000);
            this.updateDisplay(seconds);
        }, 100);
    }

    updateDisplay(seconds) {
        if (els.timerDisplay) {
            els.timerDisplay.textContent = seconds + 's';
        }
        if (els.progressBar) {
            const total = Math.ceil(this.duration / 1000);
            const progress = ((total - seconds) / total) * 100;
            els.progressBar.style.width = progress + '%';
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (els.timerDisplay) {
            els.timerDisplay.textContent = '--';
        }
        if (els.progressBar) {
            els.progressBar.style.width = '0%';
        }
    }

    async wait(estimatedTime) {
        return new Promise((resolve) => {
            this.start(estimatedTime, resolve);
        });
    }
}

const timer = new QuestionTimer();

// ===== ============================================================
// ===== Notification System =====
// ===== ============================================================

function showNotification(type, messageKey, replacements = {}) {
    let message = t(messageKey) || messageKey;
    for (const [key, value] of Object.entries(replacements)) {
        message = message.replace(`{${key}}`, value);
    }

    const container = els.notificationContainer;
    const icon = els.notificationIcon;
    const msgEl = els.notificationMessage;

    if (!container || !msgEl) return;

    container.className = 'notification-container ' + type;
    container.style.display = 'block';

    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };
    icon.textContent = icons[type] || 'i';

    msgEl.textContent = message;

    if (type !== 'error' && type !== 'warning') {
        clearTimeout(container._hideTimeout);
        container._hideTimeout = setTimeout(() => {
            container.style.opacity = '0';
            setTimeout(() => { container.style.display = 'none'; container.style.opacity = '1'; }, 300);
        }, 3000);
    }
}

function hideNotification() {
    const container = els.notificationContainer;
    if (container) {
        container.style.display = 'none';
        container.style.opacity = '1';
    }
}

// ===== ============================================================
// ===== Settings =====
// ===== ============================================================

function loadSettings() {
    const settings = getFromStorage('qentra_settings');
    if (settings) state.settings = { ...state.settings, ...settings };
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) state.settings.theme = 'dark';
    applySettings();
}

function saveSettings() {
    saveToStorage('qentra_settings', state.settings);
}

function applySettings() {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    els.darkThemeBtn?.classList.toggle('active', state.settings.theme === 'dark');
    els.lightThemeBtn?.classList.toggle('active', state.settings.theme === 'light');

    if (state.settings.language === 'ar') {
        els.arLangBtn?.classList.add('active');
        els.enLangBtn?.classList.remove('active');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        els.enLangBtn?.classList.add('active');
        els.arLangBtn?.classList.remove('active');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }

    document.querySelectorAll('[data-ar]').forEach(el => {
        if (el.dataset.ar && el.dataset.en) {
            el.textContent = state.settings.language === 'ar' ? el.dataset.ar : el.dataset.en;
        }
    });

    if (els.chatInput) els.chatInput.placeholder = t('placeholder');
    checkApiKeyStatus();
}

// ===== ============================================================
// ===== API Key UI =====
// ===== ============================================================

function checkApiKeyStatus() {
    const activator = new ApiKeyActivator();
    const storedKey = activator.getStoredKey();
    const statusEl = els.apiKeyStatus;
    const dot = els.statusDot;
    const text = els.statusText;

    if (storedKey) {
        QENTRA_API_KEY = storedKey;
        state.apiKey = storedKey;
        state.isApiKeyValid = true;
        
        if (statusEl) {
            statusEl.className = 'api-key-status active';
            statusEl.textContent = t('keyActive');
        }
        if (dot) { dot.className = 'status-dot'; }
        if (text) { text.textContent = t('keyActive'); }
        if (els.apiKeyInput) els.apiKeyInput.value = '••••••••••••••••';
    } else {
        QENTRA_API_KEY = '';
        state.apiKey = null;
        state.isApiKeyValid = false;
        
        if (statusEl) {
            statusEl.className = 'api-key-status inactive';
            statusEl.textContent = t('keyInactive');
        }
        if (dot) { dot.className = 'status-dot inactive'; }
        if (text) { text.textContent = t('keyInactive'); }
    }
}

// ===== ============================================================
// ===== تفعيل المفتاح - الحدث الرئيسي =====
// ===== ============================================================

async function handleActivateKey() {
    const input = els.apiKeyInput;
    if (!input) return;

    let apiKey = input.value.trim();
    if (!apiKey) {
        showNotification('warning', 'apiKeyRequired');
        return;
    }

    if (apiKey === '••••••••••••••••') {
        const activator = new ApiKeyActivator();
        const stored = activator.getStoredKey();
        if (stored) {
            showNotification('info', 'apiKeySaved');
            return;
        }
        showNotification('error', 'apiKeyInvalid');
        return;
    }

    // تعطيل الإدخال
    input.disabled = true;
    const activateBtn = document.getElementById('activateKeyBtn');
    if (activateBtn) {
        activateBtn.disabled = true;
        activateBtn.textContent = t('activating');
    }

    try {
        const activator = new ApiKeyActivator();
        const result = await activator.activateKey(apiKey);
        
        if (result.success) {
            state.isApiKeyValid = true;
            state.apiKey = apiKey;
            checkApiKeyStatus();
            if (input) {
                input.value = '••••••••••••••••';
            }
            showNotification('success', 'apiKeySaved');
            
            // إعادة تحميل التطبيق لتحديث كل شيء
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showNotification('error', 'apiKeyInvalid');
            if (input) {
                input.value = '';
                input.disabled = false;
            }
            if (activateBtn) {
                activateBtn.disabled = false;
                activateBtn.textContent = t('activateNow');
            }
        }
    } catch (error) {
        showNotification('error', 'apiKeyError');
        if (input) {
            input.disabled = false;
        }
        if (activateBtn) {
            activateBtn.disabled = false;
            activateBtn.textContent = t('activateNow');
        }
    }
}

// ===== ============================================================
// ===== Chat History =====
// ===== ============================================================

function loadChats() {
    const chats = getFromStorage('qentra_chats');
    if (chats) state.chats = chats;
    renderChatList();
}

function saveChats() {
    saveToStorage('qentra_chats', state.chats);
}

function renderChatList() {
    const list = els.chatList;
    if (!list) return;
    list.innerHTML = '';
    if (state.chats.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px;">' + t('noChats') + '</p>';
        return;
    }
    state.chats.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2"/></svg>
            <span class="chat-preview">${chat.preview || 'Chat'}</span>
        `;
        item.addEventListener('click', () => {
            const c = state.chats.find(x => x.id === chat.id);
            if (c && c.questions) {
                state.currentQuestions = c.questions;
                displayQuestions(c.questions);
                showView('home');
            }
        });
        list.appendChild(item);
    });
}

// ===== ============================================================
// ===== Views =====
// ===== ============================================================

function showView(view) {
    document.querySelectorAll('.view').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
    });
    const target = view === 'home' ? els.homeView :
                  view === 'settings' ? els.settingsView : null;
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }
    els.sidebar?.classList.remove('open');
}

// ===== ============================================================
// ===== Daily Usage =====
// ===== ============================================================

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
    if (els.chatMessagesCount) {
        els.chatMessagesCount.textContent = state.chatUsage.messagesUsed + '/10';
    }
}

// ===== ============================================================
// ===== File Upload =====
// ===== ============================================================

function handleFileSelect(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
        showNotification('error', 'invalidImage');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'imageTooLarge');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        state.currentImage = e.target.result;
        if (els.previewImg) els.previewImg.src = e.target.result;
        if (els.fileName) els.fileName.textContent = file.name;
        if (els.fileSize) els.fileSize.textContent = (file.size / 1024).toFixed(2) + ' KB';
        if (els.uploadArea) els.uploadArea.style.display = 'none';
        if (els.imagePreview) els.imagePreview.style.display = 'block';
        hideNotification();
    };
    reader.readAsDataURL(file);
}

function compressImage(dataUrl, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}

// ===== ============================================================
// ===== Generate Questions =====
// ===== ============================================================

async function generateQuestions() {
    if (state.isProcessing) return;

    if (!state.currentImage) {
        showNotification('warning', 'uploadFirst');
        return;
    }

    if (!state.isApiKeyValid || !QENTRA_API_KEY) {
        showNotification('error', 'apiKeyRequired');
        return;
    }

    const usage = checkDailyUsage();
    if (usage.attemptUsed) {
        showNotification('error', 'dailyLimitReached');
        return;
    }

    state.isProcessing = true;
    if (els.generateBtn) {
        els.generateBtn.disabled = true;
        els.generateBtn.textContent = t('generating');
    }

    if (els.loadingState) els.loadingState.style.display = 'block';
    if (els.loadingText) els.loadingText.textContent = t('analyzing');
    hideNotification();

    try {
        const compressed = await compressImage(state.currentImage, 800, 0.7);
        const imageSize = state.currentImage.length;
        const estimatedTime = timer.estimateTime(imageSize, 15);

        let questionsData = null;
        let apiCompleted = false;

        const apiPromise = callGeminiAPI(compressed, SYSTEM_PROMPT);
        const timerPromise = timer.wait(estimatedTime);

        const result = await Promise.race([
            apiPromise.then(data => {
                apiCompleted = true;
                return data;
            }),
            timerPromise.then(() => {
                if (!apiCompleted) {
                    return new Promise(resolve => {
                        const checkInterval = setInterval(() => {
                            if (apiCompleted) {
                                clearInterval(checkInterval);
                                resolve(null);
                            }
                        }, 100);
                    });
                }
                return null;
            })
        ]);

        if (result) {
            questionsData = result;
        } else {
            questionsData = await apiPromise;
        }

        timer.stop();
        if (els.loadingState) els.loadingState.style.display = 'none';

        let parsed;
        try {
            let cleanText = questionsData.replace(/```json/g, '').replace(/```/g, '').trim();
            const match = cleanText.match(/\{[\s\S]*\}/);
            if (match) cleanText = match[0];
            parsed = JSON.parse(cleanText);
        } catch (e) {
            parsed = { success: false, error: 'unclear' };
        }

        if (parsed.success && parsed.questions && parsed.questions.length === 15) {
            state.currentQuestions = parsed.questions;
            displayQuestions(parsed.questions);
            if (els.chatSection) els.chatSection.style.display = 'block';
            updateDailyUsage(true);

            const chat = {
                id: state.currentChatId,
                preview: parsed.questions[0].question.substring(0, 30) + '...',
                questions: parsed.questions,
                subject: parsed.subject || 'general'
            };
            state.chats.unshift(chat);
            if (state.chats.length > 20) state.chats.pop();
            saveChats();
            renderChatList();

            showNotification('success', 'questionsGenerated');
        } else {
            updateDailyUsage(false);
            const left = state.dailyUsage.chancesLeft;
            showNotification('error', 'imageUnclear', { count: left });
        }

    } catch (error) {
        console.error('Generate error:', error);
        timer.stop();
        if (els.loadingState) els.loadingState.style.display = 'none';
        showNotification('error', 'connectionError');
    } finally {
        state.isProcessing = false;
        if (els.generateBtn) {
            els.generateBtn.disabled = false;
            els.generateBtn.textContent = t('analyzing');
        }
    }
}

// ===== ============================================================
// ===== Display Questions =====
// ===== ============================================================

function displayQuestions(questions) {
    const list = els.questionsList;
    const answersList = els.answersList;
    if (!list) return;

    list.innerHTML = '';
    if (answersList) {
        answersList.innerHTML = '';
        answersList.style.display = 'none';
    }
    if (els.showAnswersBtn) els.showAnswersBtn.style.display = 'block';

    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <span class="question-number">س${String(q.number).padStart(2, '0')}</span>
                <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
                <span class="question-type">${q.type || ''}</span>
            </div>
            <p class="question-text">${q.question}</p>
        `;
        list.appendChild(card);
    });

    if (els.questionsSection) els.questionsSection.style.display = 'block';
    if (els.imagePreview) els.imagePreview.style.display = 'none';
    if (els.uploadArea) els.uploadArea.style.display = 'none';
}

function displayAnswers() {
    if (!state.currentQuestions) return;
    const list = els.answersList;
    if (!list) return;

    list.innerHTML = '';
    state.currentQuestions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'answer-card';
        card.innerHTML = `
            <div class="answer-header">
                <span class="answer-number">س${String(q.number).padStart(2, '0')}</span>
                <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
                <span class="question-type">${q.type || ''}</span>
            </div>
            <p class="answer-question">${q.question}</p>
            <p class="answer-text"><strong>الإجابة:</strong> ${q.answer}</p>
            <div class="answer-explanation">
                <strong>الشرح:</strong> ${q.explanation || 'لا يوجد شرح'}
            </div>
        `;
        list.appendChild(card);
    });

    list.style.display = 'block';
    if (els.showAnswersBtn) els.showAnswersBtn.style.display = 'none';
}

// ===== ============================================================
// ===== Chat =====
// ===== ============================================================

async function chatWithQentra(message) {
    if (!QENTRA_API_KEY) {
        throw new Error('API Key required');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${QENTRA_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `أنت QENTRA AI، مساعد تعليمي. تحدث بصيغة "أنا QENTRA" ولا تذكر أي شيء خارجي. أجب باللغة العربية. المستخدم يسأل: ${message}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024
            }
        }),
        signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();
    if (response.ok && data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
    }
    throw new Error(data.error?.message || 'Unknown error');
}

function addChatMessage(sender, text) {
    const container = els.chatMessages;
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + sender;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showTyping() {
    const indicator = els.typingIndicator;
    if (indicator) {
        indicator.style.display = 'flex';
        if (els.chatMessages) {
            els.chatMessages.appendChild(indicator);
            els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
        }
    }
}

function hideTyping() {
    if (els.typingIndicator) els.typingIndicator.style.display = 'none';
}

async function sendChatMessage() {
    const input = els.chatInput;
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    if (!state.isApiKeyValid || !QENTRA_API_KEY) {
        showNotification('error', 'apiKeyRequired');
        return;
    }

    if (!canSendMessage()) {
        showNotification('error', 'chatLimitReached');
        return;
    }

    addChatMessage('user', message);
    input.value = '';
    incrementMessage();
    showTyping();

    try {
        const response = await chatWithQentra(message);
        hideTyping();
        addChatMessage('ai', response);
    } catch (e) {
        hideTyping();
        addChatMessage('ai', t('connectionError'));
    }
}

// ===== ============================================================
// ===== إضافة زر التفعيل في واجهة الإعدادات =====
// ===== ============================================================

function addActivationUI() {
    const apiKeyGroup = document.querySelector('.api-key-input-group');
    if (!apiKeyGroup) return;

    if (document.getElementById('activateKeyBtn')) return;

    // زر التفعيل
    const activateBtn = document.createElement('button');
    activateBtn.id = 'activateKeyBtn';
    activateBtn.className = 'activate-key-btn';
    activateBtn.textContent = t('activateNow');
    activateBtn.addEventListener('click', handleActivateKey);

    // حاوية التحميل
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'activationLoading';
    loadingContainer.className = 'activation-container';
    loadingContainer.style.display = 'none';

    apiKeyGroup.appendChild(activateBtn);
    apiKeyGroup.appendChild(loadingContainer);
}

// ===== ============================================================
// ===== CSS للتفعيل =====
// ===== ============================================================

const activationStyles = `
/* ===== Activation Styles ===== */
.activate-key-btn {
    padding: 12px 24px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 8px;
}
.activate-key-btn:hover { background: #16a34a; }
.activate-key-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.activation-container {
    margin-top: 16px;
    padding: 20px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    text-align: center;
}

.activation-loading { padding: 20px; }
.activation-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-hover);
    border-top-color: #22c55e;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
}
.activation-loading p { color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; }

.activation-progress {
    width: 100%;
    height: 6px;
    background: var(--bg-hover);
    border-radius: 3px;
    overflow: hidden;
}
.activation-progress-bar {
    height: 100%;
    background: #22c55e;
    border-radius: 3px;
    transition: width 0.3s ease;
    width: 0%;
}

.activation-status {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 8px;
}

.activation-success,
.activation-error {
    padding: 20px;
}
.activation-icon { font-size: 32px; display: block; margin-bottom: 12px; }
.activation-success .activation-message { color: #16a34a; font-size: 16px; font-weight: 500; }
.activation-error .activation-message { color: #dc2626; font-size: 16px; font-weight: 500; }

.activation-btn {
    margin-top: 16px;
    padding: 10px 24px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
}
.activation-btn:hover { background: var(--accent-hover); }

@keyframes spin {
    to { transform: rotate(360deg); }
}
`;

// ============================================================
// ===== إضافة الـ CSS =====
// ============================================================

(function addStyles() {
    const style = document.createElement('style');
    style.textContent = activationStyles;
    document.head.appendChild(style);
})();

// ============================================================
// ===== Events =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Landing
    if (els.landingBtn) {
        els.landingBtn.addEventListener('click', () => {
            saveToStorage('qentra_seen_landing', true);
            if (els.landingOverlay) els.landingOverlay.style.display = 'none';
            if (els.appContainer) els.appContainer.style.display = 'flex';
        });
    }

    // Mobile Menu
    if (els.mobileMenuBtn) {
        els.mobileMenuBtn.addEventListener('click', () => {
            els.sidebar?.classList.toggle('open');
        });
    }

    // New Chat
    if (els.newChatBtn) {
        els.newChatBtn.addEventListener('click', () => {
            state.currentImage = null;
            state.currentQuestions = null;
            state.currentChatId = 'chat_' + generateId();
            if (els.questionsSection) els.questionsSection.style.display = 'none';
            if (els.chatSection) els.chatSection.style.display = 'none';
            if (els.uploadArea) els.uploadArea.style.display = 'block';
            if (els.imagePreview) els.imagePreview.style.display = 'none';
            if (els.questionsList) els.questionsList.innerHTML = '';
            if (els.answersList) {
                els.answersList.innerHTML = '';
                els.answersList.style.display = 'none';
            }
            if (els.chatMessages) els.chatMessages.innerHTML = '';
            if (els.showAnswersBtn) els.showAnswersBtn.style.display = 'block';
            hideNotification();
            showView('home');
        });
    }

    // Settings
    if (els.settingsBtn) {
        els.settingsBtn.addEventListener('click', () => {
            showView('settings');
            checkApiKeyStatus();
            setTimeout(addActivationUI, 100);
        });
    }

    if (els.backBtn) {
        els.backBtn.addEventListener('click', () => showView('home'));
    }

    // Upload
    if (els.browseBtn) {
        els.browseBtn.addEventListener('click', () => els.fileInput?.click());
    }

    if (els.uploadArea) {
        els.uploadArea.addEventListener('click', (e) => {
            if (e.target !== els.browseBtn) els.fileInput?.click();
        });
        els.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            els.uploadArea?.classList.add('dragover');
        });
        els.uploadArea.addEventListener('dragleave', () => {
            els.uploadArea?.classList.remove('dragover');
        });
        els.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            els.uploadArea?.classList.remove('dragover');
            const f = e.dataTransfer.files[0];
            if (f) handleFileSelect(f);
        });
    }

    if (els.fileInput) {
        els.fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleFileSelect(e.target.files[0]);
        });
    }

    if (els.removeBtn) {
        els.removeBtn.addEventListener('click', () => {
            state.currentImage = null;
            if (els.imagePreview) els.imagePreview.style.display = 'none';
            if (els.uploadArea) els.uploadArea.style.display = 'block';
            hideNotification();
        });
    }

    // Generate
    if (els.generateBtn) {
        els.generateBtn.addEventListener('click', generateQuestions);
    }

    // Show Answers
    if (els.showAnswersBtn) {
        els.showAnswersBtn.addEventListener('click', displayAnswers);
    }

    // New Questions
    if (els.newQuestionsBtn) {
        els.newQuestionsBtn.addEventListener('click', () => {
            if (els.questionsSection) els.questionsSection.style.display = 'none';
            if (els.chatSection) els.chatSection.style.display = 'none';
            if (els.uploadArea) els.uploadArea.style.display = 'block';
            if (els.questionsList) els.questionsList.innerHTML = '';
            if (els.answersList) {
                els.answersList.innerHTML = '';
                els.answersList.style.display = 'none';
            }
            state.currentQuestions = null;
            if (els.showAnswersBtn) els.showAnswersBtn.style.display = 'block';
        });
    }

    // Theme
    if (els.lightThemeBtn) {
        els.lightThemeBtn.addEventListener('click', () => {
            state.settings.theme = 'light';
            saveSettings();
            applySettings();
            showNotification('info', 'themeChanged');
        });
    }

    if (els.darkThemeBtn) {
        els.darkThemeBtn.addEventListener('click', () => {
            state.settings.theme = 'dark';
            saveSettings();
            applySettings();
            showNotification('info', 'themeChanged');
        });
    }

    // Language
    if (els.arLangBtn) {
        els.arLangBtn.addEventListener('click', () => {
            state.settings.language = 'ar';
            saveSettings();
            applySettings();
            showNotification('info', 'languageChanged');
            setTimeout(addActivationUI, 100);
        });
    }

    if (els.enLangBtn) {
        els.enLangBtn.addEventListener('click', () => {
            state.settings.language = 'en';
            saveSettings();
            applySettings();
            showNotification('info', 'languageChanged');
            setTimeout(addActivationUI, 100);
        });
    }

    // API Key - إظهار/إخفاء
    if (els.toggleApiKeyVisibility) {
        els.toggleApiKeyVisibility.addEventListener('click', () => {
            const input = els.apiKeyInput;
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
            }
        });
    }

    // Notification Close
    if (els.notificationClose) {
        els.notificationClose.addEventListener('click', hideNotification);
    }

    // Chat
    if (els.sendChatBtn) {
        els.sendChatBtn.addEventListener('click', sendChatMessage);
    }

    if (els.chatInput) {
        els.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    // ===== Init =====
    const hasSeenLanding = getFromStorage('qentra_seen_landing');
    if (!hasSeenLanding) {
        if (els.landingOverlay) els.landingOverlay.style.display = 'flex';
        if (els.appContainer) els.appContainer.style.display = 'none';
    } else {
        if (els.landingOverlay) els.landingOverlay.style.display = 'none';
        if (els.appContainer) els.appContainer.style.display = 'flex';
    }

    state.deviceId = getFromStorage('qentra_device_id');
    if (!state.deviceId) {
        state.deviceId = 'device_' + generateId();
        saveToStorage('qentra_device_id', state.deviceId);
    }
    state.currentChatId = 'chat_' + generateId();

    loadSettings();
    loadChats();
    checkDailyUsage();
    checkChatUsage();
    checkApiKeyStatus();

    // التحقق من وجود مفتاح مخزن وتفعيله تلقائياً
    const activator = new ApiKeyActivator();
    const storedKey = activator.getStoredKey();
    if (storedKey) {
        QENTRA_API_KEY = storedKey;
        state.apiKey = storedKey;
        state.isApiKeyValid = true;
        activator.updateGlobalKey(storedKey);
        checkApiKeyStatus();
    }

    const session = getFromStorage('qentra_current_session');
    if (session && session.questions) {
        state.currentQuestions = session.questions;
        displayQuestions(session.questions);
        if (els.chatSection) els.chatSection.style.display = 'block';
    }

    showView('home');
    console.log('QENTRA AI initialized with Gemini 3.6 Flash');
    console.log('API Key status:', state.isApiKeyValid ? 'Active' : 'Inactive');
});

// ===== ============================================================
// ===== Auto Save =====
// ===== ============================================================

window.addEventListener('beforeunload', () => {
    if (state.currentQuestions) {
        saveToStorage('qentra_current_session', {
            chatId: state.currentChatId,
            questions: state.currentQuestions,
            timestamp: Date.now()
        });
    }
});
