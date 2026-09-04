<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QENTRA AI - مولد الأسئلة التعليمي</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>

    <!-- ===== شاشة الترحيب ===== -->
    <div class="landing-overlay" id="landingOverlay">
        <div class="landing-container">
            <div class="landing-logo">
                <img src="https://i.ibb.co/VYvYcKGj/file-00000000dac881f48b765e030a2b4313.png" alt="QENTRA AI" />
            </div>
            <h1 class="landing-title">QENTRA AI</h1>
            <p class="landing-subtitle" data-ar="حول مادتك إلى 15 سؤالاً ذكياً" data-en="Turn your material into 15 smart questions">حول مادتك إلى 15 سؤالاً ذكياً</p>
            <p class="landing-description" data-ar="ارفع صورة من درسك أو مادتك الدراسية. سيولد QENTRA AI 15 سؤالاً مرتبة من السهل إلى الصعب مع إجابات وشروح مفصلة." data-en="Upload an image of your lesson. QENTRA AI will generate 15 questions with answers and detailed explanations.">ارفع صورة من درسك أو مادتك الدراسية. سيولد QENTRA AI 15 سؤالاً مرتبة من السهل إلى الصعب مع إجابات وشروح مفصلة.</p>
            <div class="landing-features">
                <div class="landing-feature">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>
                    <span data-ar="ارفع مادتك" data-en="Upload your material">ارفع مادتك</span>
                </div>
                <div class="landing-feature">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/></svg>
                    <span data-ar="15 سؤالاً ذكياً" data-en="15 smart questions">15 سؤالاً ذكياً</span>
                </div>
                <div class="landing-feature">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/></svg>
                    <span data-ar="ذاكر بذكاء" data-en="Study smarter">ذاكر بذكاء</span>
                </div>
            </div>
            <button class="landing-btn" id="landingBtn" data-ar="ابدأ الآن" data-en="Get Started">ابدأ الآن</button>
        </div>
    </div>

    <!-- ===== التطبيق ===== -->
    <div class="app-container" id="appContainer" style="display:none;">

        <!-- ===== الشريط الجانبي ===== -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <img src="https://i.ibb.co/VYvYcKGj/file-00000000dac881f48b765e030a2b4313.png" alt="QENTRA AI" class="logo-icon" />
                    <span class="logo-text">QENTRA AI</span>
                </div>
            </div>

            <button class="new-chat-btn" id="newChatBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/></svg>
                <span data-ar="محادثة جديدة" data-en="New Chat">محادثة جديدة</span>
            </button>

            <div class="sidebar-section">
                <h3 class="sidebar-title" data-ar="السجل" data-en="History">السجل</h3>
                <div class="chat-list" id="chatList"></div>
            </div>

            <div class="sidebar-footer">
                <button class="settings-btn" id="settingsBtn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/></svg>
                    <span data-ar="الإعدادات" data-en="Settings">الإعدادات</span>
                </button>
            </div>
        </aside>

        <!-- ===== المحتوى الرئيسي ===== -->
        <main class="main-content">
            <header class="top-header">
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <h1 class="page-title" data-ar="مولد الأسئلة" data-en="Questions Generator">مولد الأسئلة</h1>
                <div class="header-status" id="headerStatus">
                    <span class="status-dot" id="statusDot"></span>
                    <span class="status-text" id="statusText">جاهز</span>
                </div>
            </header>

            <!-- ===== الصفحة الرئيسية ===== -->
            <div class="view" id="homeView">
                <div class="hero-section">
                    <h2 class="hero-title" data-ar="حول مادتك إلى 15 سؤالاً ذكياً" data-en="Turn your material into 15 smart questions">حول مادتك إلى 15 سؤالاً ذكياً</h2>
                    <p class="hero-subtitle" data-ar="ارفع صورة من درسك أو مقالك أو مادة دراستك." data-en="Upload an image of your lesson or study material.">ارفع صورة من درسك أو مقالك أو مادة دراستك.</p>
                </div>

                <!-- ===== رفع الصورة ===== -->
                <div class="upload-area" id="uploadArea">
                    <div class="upload-content">
                        <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>
                        <p class="upload-text" data-ar="اسحب وأفلت صورتك هنا" data-en="Drag and drop your image here">اسحب وأفلت صورتك هنا</p>
                        <p class="upload-or" data-ar="أو" data-en="or">أو</p>
                        <button class="browse-btn" id="browseBtn" data-ar="تصفح الملفات" data-en="Browse Files">تصفح الملفات</button>
                        <p class="upload-hint" data-ar="يدعم: JPG، PNG، WEBP (بحد أقصى 5 ميجابايت)" data-en="Supports: JPG, PNG, WEBP (Max 5MB)">يدعم: JPG، PNG، WEBP (بحد أقصى 5 ميجابايت)</p>
                        <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" hidden />
                    </div>
                </div>

                <!-- ===== معاينة الصورة ===== -->
                <div class="image-preview" id="imagePreview" style="display:none;">
                    <img id="previewImg" src="" alt="Uploaded material" />
                    <div class="preview-info">
                        <span id="fileName"></span>
                        <span id="fileSize"></span>
                    </div>
                    <div class="preview-actions">
                        <button class="remove-btn" id="removeBtn" data-ar="إزالة" data-en="Remove">إزالة</button>
                        <button class="generate-btn" id="generateBtn" data-ar="توليد الأسئلة" data-en="Generate Questions">توليد الأسئلة</button>
                    </div>
                </div>

                <!-- ===== شاشة التحميل ===== -->
                <div class="loading-state" id="loadingState" style="display:none;">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="loadingText">جاري تحليل المادة مع QENTRA...</p>
                        <div class="timer-display" id="timerDisplay">--</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="progressBar" style="width:0%;"></div>
                        </div>
                        <p class="loading-hint" data-ar="الوقت المتوقع يعتمد على حجم المادة" data-en="Expected time depends on material size">الوقت المتوقع يعتمد على حجم المادة</p>
                    </div>
                </div>

                <!-- ===== رسائل الخطأ ===== -->
                <div class="notification-container" id="notificationContainer" style="display:none;">
                    <div class="notification-content">
                        <span class="notification-icon" id="notificationIcon"></span>
                        <p class="notification-message" id="notificationMessage"></p>
                        <button class="notification-close" id="notificationClose">&times;</button>
                    </div>
                </div>

                <!-- ===== عرض الأسئلة ===== -->
                <div class="questions-section" id="questionsSection" style="display:none;">
                    <div class="questions-header">
                        <h3 data-ar="أسئلتك" data-en="Your Questions">أسئلتك</h3>
                        <span class="questions-count">15</span>
                        <span class="difficulty-order" data-ar="من السهل إلى الصعب" data-en="Easy to Hard">من السهل إلى الصعب</span>
                    </div>
                    <div class="questions-list" id="questionsList"></div>
                    <div class="answers-section">
                        <button class="show-answers-btn" id="showAnswersBtn" data-ar="عرض الإجابات والشروح" data-en="Show Answers & Explanations">عرض الإجابات والشروح</button>
                        <div class="answers-list" id="answersList" style="display:none;"></div>
                    </div>
                    <button class="new-questions-btn" id="newQuestionsBtn" data-ar="أسئلة جديدة" data-en="New Questions">أسئلة جديدة</button>
                </div>

                <!-- ===== شات QENTRA ===== -->
                <div class="chat-section" id="chatSection" style="display:none;">
                    <div class="chat-header">
                        <h3 data-ar="تحدث مع QENTRA" data-en="Chat with QENTRA">تحدث مع QENTRA</h3>
                        <span class="chat-messages-count" id="chatMessagesCount">0/10</span>
                    </div>
                    <div class="chat-messages" id="chatMessages"></div>
                    <div class="typing-indicator" id="typingIndicator" style="display:none;"><span></span><span></span><span></span></div>
                    <div class="chat-input-area">
                        <input type="text" id="chatInput" placeholder="اسأل عن الأسئلة..." />
                        <button class="send-btn" id="sendChatBtn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ===== صفحة الإعدادات ===== -->
            <div class="view" id="settingsView" style="display:none;">
                <div class="settings-container">
                    <h2 class="settings-title" data-ar="الإعدادات" data-en="Settings">الإعدادات</h2>

                    <!-- ===== مفتاح API ===== -->
                    <div class="setting-group">
                        <label class="setting-label" data-ar="مفتاح Gemini API" data-en="Gemini API Key">مفتاح Gemini API</label>
                        <div class="api-key-input-group">
                            <div class="api-key-input-wrapper">
                                <input type="password" id="apiKeyInput" class="api-key-input" placeholder="أدخل مفتاح API الخاص بك" autocomplete="off" />
                                <button id="toggleApiKeyVisibility" class="toggle-visibility" type="button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                                </button>
                            </div>
                            <button id="saveApiKeyBtn" class="save-api-key-btn" data-ar="تفعيل المفتاح" data-en="Activate Key">تفعيل المفتاح</button>
                        </div>
                        <div id="apiKeyStatus" class="api-key-status"></div>
                        <div class="api-key-help">
                            <p data-ar="كيف تحصل على مفتاح API؟" data-en="How to get an API Key?">كيف تحصل على مفتاح API؟</p>
                            <ol>
                                <li data-ar="اذهب إلى Google AI Studio" data-en="Go to Google AI Studio">اذهب إلى Google AI Studio</li>
                                <li data-ar="سجل الدخول بحساب Google الخاص بك" data-en="Sign in with your Google account">سجل الدخول بحساب Google الخاص بك</li>
                                <li data-ar="اضغط على Get API Key" data-en="Click Get API Key">اضغط على Get API Key</li>
                                <li data-ar="انسخ المفتاح والصقه هنا" data-en="Copy the key and paste it here">انسخ المفتاح والصقه هنا</li>
                            </ol>
                            <p class="note" data-ar="المفتاح مشفر ومخزن محلياً. لن يتم مشاركته مع أي جهة خارجية." data-en="The key is encrypted and stored locally. It will not be shared with anyone.">المفتاح مشفر ومخزن محلياً. لن يتم مشاركته مع أي جهة خارجية.</p>
                        </div>
                    </div>

                    <!-- ===== المظهر ===== -->
                    <div class="setting-group">
                        <label class="setting-label" data-ar="المظهر" data-en="Theme">المظهر</label>
                        <div class="theme-options">
                            <button class="theme-btn active" data-theme="light" id="lightThemeBtn" data-ar="فاتح" data-en="Light">فاتح</button>
                            <button class="theme-btn" data-theme="dark" id="darkThemeBtn" data-ar="داكن" data-en="Dark">داكن</button>
                        </div>
                    </div>

                    <!-- ===== اللغة ===== -->
                    <div class="setting-group">
                        <label class="setting-label" data-ar="اللغة" data-en="Language">اللغة</label>
                        <div class="language-options">
                            <button class="lang-btn active" data-lang="ar" id="arLangBtn">العربية</button>
                            <button class="lang-btn" data-lang="en" id="enLangBtn">English</button>
                        </div>
                    </div>

                    <button class="back-btn" id="backBtn" data-ar="العودة للرئيسية" data-en="Back to Home">العودة للرئيسية</button>
                </div>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>
