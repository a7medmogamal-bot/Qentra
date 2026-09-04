/* ============================================================
   QENTRA AI - SCRIPT.JS (النسخة الكاملة)
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
        testingKey: 'جاري اختبار المفتاح...',
        keyTestSuccess: 'المفتاح صالح ويعمل',
        keyTestFailed: 'المفتاح غير صالح',
        formatCheck: 'فحص الصيغة',
        connectivityCheck: 'فحص الاتصال',
        modelCheck: 'الوصول للنموذج',
        generationCheck: 'اختبار التوليد',
        passed: 'ناجح',
        failed: 'فاشل',
        close: 'إغلاق'
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
        testingKey: 'Testing API Key...',
        keyTestSuccess: 'API Key is valid and working',
        keyTestFailed: 'API Key is invalid',
        formatCheck: 'Format Check',
        connectivityCheck: 'Connectivity Check',
        modelCheck: 'Model Access',
        generationCheck: 'Generation Test',
        passed: 'Passed',
        failed: 'Failed',
        close: 'Close'
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
    isApiKeyValid: false
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
    headerStatus: $('headerStatus'),
    statusDot: $('statusDot'),
    statusText: $('statusText'),
    testApiKeyBtn: null,
    apiTestResults: null
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

// ===== API Key Management =====
class ApiKeyManager {
    constructor() {
        this.storageKey = 'qentra_gemini_key';
        this.encryptionKey = 'qentra_secret_2024';
    }

    encrypt(apiKey) {
        try {
            let result = '';
            for (let i = 0; i < apiKey.length; i++) {
                const code = apiKey.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(code);
            }
            return btoa(result);
        } catch { return null; }
    }

    decrypt(encrypted) {
        try {
            const decoded = atob(encrypted);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                const code = decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                result += String.fromCharCode(code);
            }
            return result;
        } catch { return null; }
    }

    save(apiKey) {
        const encrypted = this.encrypt(apiKey);
        if (encrypted) {
            localStorage.setItem(this.storageKey, encrypted);
            localStorage.setItem(this.storageKey + '_date', new Date().toISOString());
            return true;
        }
        return false;
    }

    get() {
        const encrypted = localStorage.getItem(this.storageKey);
        if (encrypted) {
            const decrypted = this.decrypt(encrypted);
            if (decrypted && decrypted.length > 0) {
                return decrypted;
            }
        }
        return null;
    }

    delete() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey + '_date');
    }

    has() { return !!this.get(); }
}

const apiKeyManager = new ApiKeyManager();

// ============================================================
// API KEY TESTER - نظام فحص واختبار مفاتيح API
// ============================================================

class ApiKeyTester {
    constructor() {
        this.testResults = {
            format: true,
            connectivity: false,
            modelAccess: false,
            generation: false,
            overall: false
        };
        this.testLogs = [];
        this.isTesting = false;
    }

    testFormat(apiKey) {
        const result = {
            test: 'format',
            passed: true,
            message: t('formatCheck'),
            details: 'تم تخطي فحص الصيغة'
        };
        this.testLogs.push(result);
        this.testResults.format = true;
        return result;
    }

    async testConnectivity(apiKey) {
        const result = {
            test: 'connectivity',
            passed: false,
            message: '',
            details: '',
            latency: 0
        };

        try {
            const startTime = Date.now();
            const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(10000)
            });

            const latency = Date.now() - startTime;
            result.latency = latency;

            if (response.ok) {
                result.passed = true;
                result.message = t('connectivityCheck') + ' - ' + t('passed');
                result.details = `وقت الاستجابة: ${latency}ms`;
            } else {
                const data = await response.json();
                result.message = t('connectivityCheck') + ' - ' + t('failed');
                result.details = data.error?.message || `خطأ ${response.status}`;
            }
        } catch (error) {
            result.message = t('connectivityCheck') + ' - ' + t('failed');
            result.details = error.message || 'انتهت مهلة الاتصال';
        }

        this.testLogs.push(result);
        this.testResults.connectivity = result.passed;
        return result;
    }

    async testModelAccess(apiKey) {
        const result = {
            test: 'model_access',
            passed: false,
            message: '',
            details: '',
            availableModels: []
        };

        try {
            const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(10000)
            });

            if (response.ok) {
                const data = await response.json();
                const models = data.models || [];
                result.availableModels = models.map(m => m.name);

                const hasModel = models.some(m => 
                    m.name.includes('gemini') || 
                    m.name.includes('Gemini')
                );

                if (hasModel) {
                    result.passed = true;
                    result.message = t('modelCheck') + ' - ' + t('passed');
                    result.details = `تم العثور على ${models.length} نموذج`;
                } else {
                    result.message = t('modelCheck') + ' - ' + t('failed');
                    result.details = 'لا توجد نماذج Gemini متاحة';
                }
            } else {
                const data = await response.json();
                result.message = t('modelCheck') + ' - ' + t('failed');
                result.details = data.error?.message || `خطأ ${response.status}`;
            }
        } catch (error) {
            result.message = t('modelCheck') + ' - ' + t('failed');
            result.details = error.message || 'انتهت مهلة الاتصال';
        }

        this.testLogs.push(result);
        this.testResults.modelAccess = result.passed;
        return result;
    }

    async testGeneration(apiKey) {
        const result = {
            test: 'generation',
            passed: false,
            message: '',
            details: '',
            response: ''
        };

        try {
            const testPrompt = 'مرحباً، أجب بكلمة واحدة فقط: "مرحباً"';
            
            let modelToUse = GEMINI_CONFIG.model;
            let url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models/${modelToUse}:generateContent?key=${apiKey}`;

            let response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: testPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 10
                    }
                }),
                signal: AbortSignal.timeout(15000)
            });

            if (!response.ok) {
                const fallbackModels = [
                    'gemini-1.5-flash',
                    'gemini-1.5-pro',
                    'gemini-1.0-pro'
                ];

                for (const model of fallbackModels) {
                    const fallbackUrl = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models/${model}:generateContent?key=${apiKey}`;
                    const fallbackResponse = await fetch(fallbackUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: testPrompt }]
                            }],
                            generationConfig: {
                                temperature: 0.1,
                                maxOutputTokens: 10
                            }
                        }),
                        signal: AbortSignal.timeout(15000)
                    });

                    if (fallbackResponse.ok) {
                        response = fallbackResponse;
                        modelToUse = model;
                        break;
                    }
                }
            }

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                result.response = text;
                
                if (text && text.length > 0) {
                    result.passed = true;
                    result.message = t('generationCheck') + ' - ' + t('passed');
                    result.details = `النموذج ${modelToUse} يستجيب بشكل صحيح`;
                } else {
                    result.message = t('generationCheck') + ' - ' + t('failed');
                    result.details = 'تم استلام استجابة فارغة';
                }
            } else {
                const data = await response.json();
                result.message = t('generationCheck') + ' - ' + t('failed');
                result.details = data.error?.message || `خطأ ${response.status}`;
            }
        } catch (error) {
            result.message = t('generationCheck') + ' - ' + t('failed');
            result.details = error.message || 'انتهت مهلة الاتصال';
        }

        this.testLogs.push(result);
        this.testResults.generation = result.passed;
        return result;
    }

    async runFullTest(apiKey) {
        this.testResults = {
            format: true,
            connectivity: false,
            modelAccess: false,
            generation: false,
            overall: false
        };
        this.testLogs = [];
        this.isTesting = true;

        const results = {
            success: false,
            progress: 0,
            tests: [],
            summary: {
                passed: 0,
                failed: 0,
                total: 4,
                percentage: 0
            },
            error: null,
            message: ''
        };

        try {
            results.progress = 10;
            const formatResult = this.testFormat(apiKey);
            results.tests.push(formatResult);
            results.summary.passed += 1;

            results.progress = 30;
            const connectivityResult = await this.testConnectivity(apiKey);
            results.tests.push(connectivityResult);
            results.summary.passed += connectivityResult.passed ? 1 : 0;
            results.summary.failed += connectivityResult.passed ? 0 : 1;

            if (!connectivityResult.passed) {
                results.error = 'فشل الاتصال بالخادم';
                results.message = 'لا يمكن الاتصال بخوادم Google';
                results.summary.percentage = 50;
                this.isTesting = false;
                return results;
            }

            results.progress = 60;
            const modelResult = await this.testModelAccess(apiKey);
            results.tests.push(modelResult);
            results.summary.passed += modelResult.passed ? 1 : 0;
            results.summary.failed += modelResult.passed ? 0 : 1;

            if (!modelResult.passed) {
                results.error = 'النموذج غير متاح';
                results.message = 'لم يتم العثور على نماذج Gemini متاحة';
                results.summary.percentage = 75;
                this.isTesting = false;
                return results;
            }

            results.progress = 85;
            const generationResult = await this.testGeneration(apiKey);
            results.tests.push(generationResult);
            results.summary.passed += generationResult.passed ? 1 : 0;
            results.summary.failed += generationResult.passed ? 0 : 1;

            results.success = generationResult.passed;
            results.summary.percentage = (results.summary.passed / results.summary.total) * 100;

            this.testResults.overall = results.success;
            results.progress = 100;

            if (results.success) {
                results.message = t('keyTestSuccess');
            } else {
                results.message = t('keyTestFailed');
                if (!generationResult.passed) {
                    results.error = generationResult.details || 'فشل اختبار التوليد';
                }
            }

        } catch (error) {
            results.error = error.message || 'حدث خطأ غير متوقع';
            results.success = false;
            results.message = t('keyTestFailed');
        }

        this.isTesting = false;
        return results;
    }

    renderResults(results) {
        if (!results) return null;

        const container = document.createElement('div');
        container.className = 'api-test-results';

        const statusDiv = document.createElement('div');
        statusDiv.className = `test-status ${results.success ? 'success' : 'failed'}`;
        statusDiv.innerHTML = `
            <span class="status-icon">${results.success ? '✓' : '✕'}</span>
            <span class="status-text">${results.message || (results.success ? t('keyTestSuccess') : t('keyTestFailed'))}</span>
            <span class="status-percentage">${Math.round(results.summary.percentage)}%</span>
        `;
        container.appendChild(statusDiv);

        const progressDiv = document.createElement('div');
        progressDiv.className = 'test-progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'test-progress-fill';
        progressFill.style.width = Math.min(results.summary.percentage, 100) + '%';
        progressDiv.appendChild(progressFill);
        container.appendChild(progressDiv);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'test-details';

        const labels = {
            format: t('formatCheck'),
            connectivity: t('connectivityCheck'),
            model_access: t('modelCheck'),
            generation: t('generationCheck')
        };

        results.tests.forEach(test => {
            const item = document.createElement('div');
            item.className = `test-item ${test.passed ? 'passed' : 'failed'}`;
            
            item.innerHTML = `
                <span class="test-icon">${test.passed ? '✓' : '✕'}</span>
                <span class="test-name">${labels[test.test] || test.test}</span>
                <span class="test-status-text">${test.passed ? t('passed') : t('failed')}</span>
                ${test.latency ? `<span class="test-latency">${test.latency}ms</span>` : ''}
                ${test.details ? `<span class="test-detail">${test.details}</span>` : ''}
            `;
            detailsDiv.appendChild(item);
        });

        container.appendChild(detailsDiv);

        if (results.error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'test-error';
            errorDiv.textContent = `خطأ: ${results.error}`;
            container.appendChild(errorDiv);
        }

        const closeBtn = document.createElement('button');
        closeBtn.className = 'test-close-btn';
        closeBtn.textContent = t('close');
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
        container.appendChild(closeBtn);

        return container;
    }
}

// ===== Gemini API Call =====
async function callGeminiAPI(imageBase64, prompt, apiKey) {
    let imageData = imageBase64;
    if (imageBase64.includes(',')) {
        imageData = imageBase64.split(',')[1];
    }

    const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models/${GEMINI_CONFIG.model}:generateContent?key=${apiKey}`;

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

// ===== System Prompt =====
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

// ===== Timer System =====
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

// ===== Notification System =====
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

// ===== Settings =====
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

// ===== API Key UI =====
function checkApiKeyStatus() {
    const key = apiKeyManager.get();
    const statusEl = els.apiKeyStatus;
    const dot = els.statusDot;
    const text = els.statusText;

    if (key) {
        state.apiKey = key;
        state.isApiKeyValid = true;
        if (statusEl) {
            statusEl.className = 'api-key-status active';
            statusEl.textContent = 'المفتاح مفعل ويعمل';
        }
        if (dot) { dot.className = 'status-dot'; }
        if (text) { text.textContent = 'مفعل'; }
        if (els.apiKeyInput) els.apiKeyInput.value = '••••••••••••••••';
    } else {
        state.apiKey = null;
        state.isApiKeyValid = false;
        if (statusEl) {
            statusEl.className = 'api-key-status inactive';
            statusEl.textContent = 'لم يتم تفعيل مفتاح API';
        }
        if (dot) { dot.className = 'status-dot inactive'; }
        if (text) { text.textContent = 'غير مفعل'; }
    }
}

async function handleSaveApiKey() {
    const input = els.apiKeyInput;
    if (!input) return;

    let apiKey = input.value.trim();
    if (!apiKey) {
        showNotification('warning', 'apiKeyRequired');
        return;
    }

    if (apiKey === '••••••••••••••••') {
        const stored = apiKeyManager.get();
        if (stored) {
            showNotification('info', 'apiKeySaved');
            return;
        }
        showNotification('error', 'apiKeyInvalid');
        return;
    }

    const statusEl = els.apiKeyStatus;
    if (statusEl) {
        statusEl.className = 'api-key-status validating';
        statusEl.textContent = 'جاري التحقق من المفتاح...';
    }

    try {
        const tester = new ApiKeyTester();
        const result = await tester.runFullTest(apiKey);
        
        if (result.success) {
            apiKeyManager.save(apiKey);
            state.apiKey = apiKey;
            state.isApiKeyValid = true;
            showNotification('success', 'apiKeySaved');
            checkApiKeyStatus();
            if (input) input.value = '••••••••••••••••';
        } else {
            showNotification('error', 'apiKeyInvalid');
            if (statusEl) {
                statusEl.className = 'api-key-status inactive';
                statusEl.textContent = result.error || 'المفتاح غير صالح';
            }
        }
    } catch (error) {
        showNotification('error', 'connectionError');
        if (statusEl) {
            statusEl.className = 'api-key-status inactive';
            statusEl.textContent = 'خطأ في الاتصال';
        }
    }
}

// ===== Chat History =====
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

// ===== Views =====
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

// ===== Daily Usage =====
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

// ===== File Upload =====
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

// ===== Generate Questions =====
async function generateQuestions() {
    if (state.isProcessing) return;

    if (!state.currentImage) {
        showNotification('warning', 'uploadFirst');
        return;
    }

    if (!state.isApiKeyValid || !state.apiKey) {
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

        const apiPromise = callGeminiAPI(compressed, SYSTEM_PROMPT, state.apiKey);
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

// ===== Display Questions =====
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

// ===== Chat =====
async function chatWithQentra(message) {
    if (!state.apiKey) {
        throw new Error('API Key required');
    }

    const url = `${GEMINI_CONFIG.baseUrl}/${GEMINI_CONFIG.apiVersion}/models/${GEMINI_CONFIG.model}:generateContent?key=${state.apiKey}`;

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

    if (!state.isApiKeyValid || !state.apiKey) {
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

// ===== API Tester UI =====
function addApiTesterUI() {
    const apiKeyGroup = document.querySelector('.api-key-input-group');
    if (!apiKeyGroup) return;

    if (els.testApiKeyBtn) return;

    const testerBtn = document.createElement('button');
    testerBtn.id = 'testApiKeyBtn';
    testerBtn.className = 'test-api-key-btn';
    testerBtn.textContent = t('testingKey');
    testerBtn.setAttribute('data-ar', 'اختبار المفتاح');
    testerBtn.setAttribute('data-en', 'Test Key');
    testerBtn.textContent = state.settings.language === 'ar' ? 'اختبار المفتاح' : 'Test Key';
    
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'apiTestResults';
    resultsContainer.className = 'api-test-results-container';
    resultsContainer.style.display = 'none';

    apiKeyGroup.appendChild(testerBtn);
    apiKeyGroup.appendChild(resultsContainer);

    els.testApiKeyBtn = testerBtn;
    els.apiTestResults = resultsContainer;

    testerBtn.addEventListener('click', async () => {
        const input = els.apiKeyInput;
        if (!input) return;

        let apiKey = input.value.trim();
        if (!apiKey) {
            showNotification('warning', 'apiKeyRequired');
            return;
        }

        if (apiKey === '••••••••••••••••') {
            const stored = apiKeyManager.get();
            if (stored) {
                apiKey = stored;
            } else {
                showNotification('error', 'apiKeyInvalid');
                return;
            }
        }

        testerBtn.disabled = true;
        testerBtn.textContent = t('testingKey');
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <div class="test-loading">
                <div class="test-spinner"></div>
                <p>${t('testingKey')}</p>
            </div>
        `;

        try {
            const tester = new ApiKeyTester();
            const results = await tester.runFullTest(apiKey);
            
            const rendered = tester.renderResults(results);
            resultsContainer.innerHTML = '';
            resultsContainer.appendChild(rendered);
            resultsContainer.style.display = 'block';

            if (results.success) {
                apiKeyManager.save(apiKey);
                state.apiKey = apiKey;
                state.isApiKeyValid = true;
                checkApiKeyStatus();
                if (input) input.value = '••••••••••••••••';
                showNotification('success', 'apiKeySaved');
            }

        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="test-error">
                    <span>✕</span>
                    <p>حدث خطأ أثناء الاختبار: ${error.message}</p>
                </div>
            `;
            resultsContainer.style.display = 'block';
        } finally {
            testerBtn.disabled = false;
            testerBtn.textContent = state.settings.language === 'ar' ? 'اختبار المفتاح' : 'Test Key';
        }
    });
}

// ============================================================
// CSS API Tester Styles
// ============================================================

const apiTesterStyles = `
.test-api-key-btn {
    padding: 10px 20px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 8px;
}
.test-api-key-btn:hover { background: #1d4ed8; }
.test-api-key-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.api-test-results-container {
    margin-top: 16px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
}
.api-test-results { display: flex; flex-direction: column; gap: 12px; }

.test-status {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 8px; font-weight: 500;
}
.test-status.success { background: #dcfce7; color: #16a34a; border: 1px solid #86efac; }
.test-status.failed { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
[data-theme="dark"] .test-status.success { background: #052e16; color: #4ade80; border-color: #166534; }
[data-theme="dark"] .test-status.failed { background: #450a0a; color: #f87171; border-color: #7f1d1d; }

.status-icon { font-size: 20px; font-weight: bold; }
.status-text { flex: 1; font-size: 14px; }
.status-percentage { font-size: 16px; font-weight: bold; padding: 2px 10px; background: rgba(0,0,0,0.1); border-radius: 12px; }

.test-progress-bar { width: 100%; height: 6px; background: var(--bg-hover); border-radius: 3px; overflow: hidden; }
.test-progress-fill { height: 100%; background: #2563eb; border-radius: 3px; transition: width 0.5s ease; }

.test-details { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.test-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 8px; font-size: 13px; flex-wrap: wrap;
}
.test-item.passed { background: #dcfce7; color: #16a34a; }
.test-item.failed { background: #fef2f2; color: #dc2626; }
[data-theme="dark"] .test-item.passed { background: #052e16; color: #4ade80; }
[data-theme="dark"] .test-item.failed { background: #450a0a; color: #f87171; }

.test-icon { font-weight: bold; font-size: 14px; }
.test-name { font-weight: 500; min-width: 100px; }
.test-status-text { flex: 1; }
.test-latency { font-size: 12px; color: var(--text-muted); background: var(--bg-hover); padding: 2px 8px; border-radius: 10px; }
.test-detail { width: 100%; font-size: 12px; color: var(--text-muted); padding: 4px 8px; background: var(--bg-primary); border-radius: 8px; margin-top: 4px; }

.test-error {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; background: #fef2f2; color: #dc2626;
    border-radius: 8px; border: 1px solid #fecaca; font-size: 14px;
}
[data-theme="dark"] .test-error { background: #450a0a; color: #f87171; border-color: #7f1d1d; }

.test-close-btn {
    align-self: flex-end; padding: 6px 16px;
    background: var(--bg-hover); color: var(--text-secondary);
    border: none; border-radius: 8px; cursor: pointer; font-size: 13px;
    transition: background 0.3s;
}
.test-close-btn:hover { background: var(--border-color); }

.test-loading { text-align: center; padding: 20px; }
.test-spinner {
    width: 40px; height: 40px;
    border: 4px solid var(--bg-hover);
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.test-loading p { color: var(--text-secondary); font-size: 14px; }
`;

// إضافة الـ CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = apiTesterStyles;
document.head.appendChild(styleSheet);

// ============================================================
// Events
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
            setTimeout(addApiTesterUI, 100);
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
            setTimeout(addApiTesterUI, 100);
        });
    }

    if (els.enLangBtn) {
        els.enLangBtn.addEventListener('click', () => {
            state.settings.language = 'en';
            saveSettings();
            applySettings();
            showNotification('info', 'languageChanged');
            setTimeout(addApiTesterUI, 100);
        });
    }

    // API Key
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

    if (els.saveApiKeyBtn) {
        els.saveApiKeyBtn.addEventListener('click', handleSaveApiKey);
    }

    if (els.apiKeyInput) {
        els.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSaveApiKey();
        });
        const stored = apiKeyManager.get();
        if (stored) {
            els.apiKeyInput.value = '••••••••••••••••';
        }
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

    const session = getFromStorage('qentra_current_session');
    if (session && session.questions) {
        state.currentQuestions = session.questions;
        displayQuestions(session.questions);
        if (els.chatSection) els.chatSection.style.display = 'block';
    }

    showView('home');
    console.log('QENTRA AI initialized with Gemini 3.6 Flash');
});

// ===== Auto Save =====
window.addEventListener('beforeunload', () => {
    if (state.currentQuestions) {
        saveToStorage('qentra_current_session', {
            chatId: state.currentChatId,
            questions: state.currentQuestions,
            timestamp: Date.now()
        });
    }
});
