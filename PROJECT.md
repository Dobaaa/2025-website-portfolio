# Ahmed Jamal Portfolio

المشروع ثلاثة أجزاء مستقلة. التصميم العام للموقع لا يتغير من الداشبورد؛ الداشبورد تغيّر المحتوى فقط، والموقع يقرأه من الـ API.

| الجزء | التقنية | المجلد | أين يتعمل |
| --- | --- | --- | --- |
| الموقع العام | Next.js 14 | جذر المشروع | استضافة تدعم Node، أو Vercel / Netlify |
| الـ API وقاعدة البيانات | Laravel 12 + PHP 8.2 + MySQL | `backend` | Shared Hosting |
| لوحة التحكم | React + Vite | `dashboard` | تُبنى محليًا وتُرفع ملفات جاهزة داخل Laravel |

الاستضافة المشتركة تشغّل PHP فقط، لذلك Laravel والداشبورد بعد البناء يعيشان عليها. موقع Next.js لا يشتغل كملفات PHP، فيحتاج استضافة Node منفصلة ويشير إلى رابط الـ API.

```text
الزائر
  -> موقع Next.js
      -> GET /api/public/portfolio
          -> Laravel على الاستضافة المشتركة
              -> MySQL

الأدمن
  -> https://api-domain.com/admin
      -> ملفات React الجاهزة في backend/public/admin
          -> /api/*  (Sanctum token)
              -> MySQL + backend/public/uploads
```

## هيكل المجلدات

```text
2025-website-portfolio/
├── app/                         صفحات Next.js
│   ├── page.tsx                 الصفحة الرئيسية
│   ├── layout.tsx
│   └── globals.css              خلفية الهيرو .doba-img
├── components/                  واجهة الموقع
│   ├── Hero.tsx                 العنوان، الوصف، تحميل الـ CV
│   ├── RecentProjects.tsx       كروت المشاريع
│   ├── ProjectModal.tsx         البوب أب عند الضغط على مشروع
│   ├── Clients.tsx              التقييمات
│   ├── Experience.tsx           الخبرات
│   ├── Footer.tsx               الفوتر وروابط التواصل
│   ├── Grid.tsx                 قسم About (ثابت في التصميم)
│   ├── Approach.tsx             قسم ثابت في التصميم
│   └── PortfolioProvider.tsx    يجيب بيانات الـ API مرة عند فتح الصفحة
├── data/index.ts                محتوى احتياطي لو الـ API مش متاح
├── lib/portfolio.ts             عنوان الـ API وتحويل روابط الصور
├── public/                      صور وأيقونات الموقع الثابتة
├── .env.local                   NEXT_PUBLIC_API_URL
│
├── backend/                     Laravel API
│   ├── app/Http/Controllers/Api
│   ├── app/Models
│   ├── database/migrations
│   ├── database/seeders
│   ├── routes/api.php
│   ├── routes/web.php           /admin
│   ├── public/                  هذا هو Document Root على الاستضافة
│   │   ├── index.php
│   │   ├── admin/               ناتج بناء الداشبورد
│   │   └── uploads/             الصور والـ CV المرفوعة
│   ├── storage/                 لازم يكون قابل للكتابة
│   ├── .env                     إعدادات السيرفر، لا يرفع على Git
│   └── .htaccess                يستخدم لو الاستضافة لا تسمح بتغيير Document Root
│
└── dashboard/                   سورس لوحة التحكم، لا يرفع نفسه للسيرفر
    ├── src/pages
    ├── src/api.ts
    └── vite.config.ts           البناء يخرج إلى backend/public/admin
```

## ماذا يتحكم فيه كل جزء

الموقع العام يعرض ما يرجع من `GET /api/public/portfolio`:

- الهيرو: العنوان الصغير، العنوان الرئيسي، الوصف، صورة الخلفية، ملف الـ CV
- المشاريع المنشورة فقط، مع صورة الغلاف وأيقونات التقنيات
- بوب أب المشروع: التفاصيل، صور إضافية، لينك حي أو GitHub
- مشروع `confidential`: لا يظهر لينك حي. تظهر رسالة أن النظام داشبورد خاصة وتُعرض الصور فقط أو شرح في ميتنج
- التقييمات، الخبرات، روابط السوشيال، نص الفوتر، إيميل التواصل، سطر الحقوق

قسم About (`Grid`) وقسم Approach ثابتان في الكود وليسا من الداشبورد.

الداشبورد (`dashboard/src/pages`) تدير:

| الصفحة | الوظيفة |
| --- | --- |
| `Login.tsx` | تسجيل الدخول |
| `Overview.tsx` | أعداد المشاريع والتقييمات والخبرات وحالة الـ CV |
| `Projects.tsx` / `ProjectForm.tsx` | إضافة وتعديل وحذف ومعاينة البوب أب |
| `Testimonials.tsx` | التقييمات |
| `Experiences.tsx` | الخبرات |
| `SocialLinks.tsx` | روابط التواصل |
| `Settings.tsx` | نصوص الموقع، صورة الهيرو، رفع CV، تغيير كلمة المرور |

## قاعدة البيانات

الجداول تنشأ من `backend/database/migrations`:

| الجدول | المحتوى |
| --- | --- |
| `users` | حساب الأدمن |
| `personal_access_tokens` | توكن Sanctum بعد تسجيل الدخول |
| `site_settings` | نصوص الهيرو والفوتر ومسار الـ CV ورسالة المشاريع الخاصة |
| `projects` | المشروع، اللينكات، النوع `public` أو `confidential`، الترتيب، النشر |
| `project_images` | صور البوب أب الإضافية |
| `testimonials` | التقييمات |
| `experiences` | الخبرات |
| `social_links` | روابط التواصل |

الصور والـ CV لا تُحفظ داخل الجدول كملفات. الجدول يحفظ المسار، والملف يكون في `backend/public/uploads`.

## الـ API

المسار العام، من غير تسجيل دخول:

```http
GET /api/public/portfolio
```

مسارات الداشبورد تبدأ بـ `/api` وتحتاج هيدر:

```http
Authorization: Bearer TOKEN
Accept: application/json
```

| الطريقة | المسار | الوظيفة |
| --- | --- | --- |
| POST | `/api/login` | تسجيل الدخول وإرجاع التوكن |
| POST | `/api/logout` | تسجيل الخروج |
| GET | `/api/me` | المستخدم الحالي |
| PUT | `/api/password` | تغيير كلمة المرور |
| GET | `/api/stats` | أرقام النظرة العامة |
| GET/POST | `/api/settings` | قراءة وحفظ الإعدادات والـ CV |
| GET/POST/DELETE | `/api/projects` | المشاريع |
| POST | `/api/projects/{id}` | تعديل مشروع مع صور، لأن المتصفح يرسل `FormData` |
| نفس النمط | `/api/testimonials` و `/api/experiences` و `/api/social-links` | باقي المحتوى |

تعديل المشاريع والتقييمات والخبرات يتم بـ `POST` وليس `PUT` عند وجود ملفات.

## التشغيل المحلي

ثلاثة أوامر في ثلاثة تيرمنالات.

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

```bash
cd dashboard
npm install
npm run dev
```

```bash
npm install
npm run dev
```

الروابط:

- الموقع: `http://localhost:3000`
- الداشبورد أثناء التطوير: `http://localhost:5173`
- الـ API: `http://127.0.0.1:8000`
- الداشبورد بعد البناء: `http://127.0.0.1:8000/admin`

ملف الموقع `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

دخول أول مرة بعد الـ seed:

- البريد: `elhwtdoba@gmail.com`
- كلمة المرور: `Admin@12345`

غيّر كلمة المرور من صفحة الإعدادات قبل النشر.

قاعدة البيانات المحلية الحالية MySQL باسم `jamal`. ملف `.env.example` يوضح SQLite للتجربة السريعة وMySQL للاستضافة.

## الديبلوي على Shared Hosting

### 1. بناء الداشبورد قبل الرفع

الداشبورد لا تُشغَّل بـ Node على الاستضافة. تُبنى على جهازك وتُرفع ناتجها فقط:

```bash
cd dashboard
npm install
npm run build
```

الأمر يفرّغ ثم يكتب الملفات في:

```text
backend/public/admin
```

أي تعديل لاحق على سورس `dashboard` يحتاج نفس الأمر ثم إعادة رفع مجلد `admin`.

### 2. تجهيز MySQL من cPanel

من MySQL Databases:

1. أنشئ قاعدة بيانات.
2. أنشئ مستخدمًا وكلمة مرور.
3. اربط المستخدم بقاعدة البيانات مع كل الصلاحيات.
4. الاسم غالبًا يكون مسبوقًا باسم حساب الاستضافة، مثل `account_jamal`.

### 3. إعداد `backend/.env` على السيرفر

```env
APP_NAME="Portfolio CMS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.your-domain.com
APP_KEY=base64:...
FRONTEND_URL=https://your-portfolio-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=account_jamal
DB_USERNAME=account_user
DB_PASSWORD=the-password

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

`APP_URL` هو دومين Laravel. `FRONTEND_URL` هو دومين موقع Next.js، ويستخدمه CORS حتى يقبل المتصفح طلبات الموقع.

أنشئ `APP_KEY` محليًا وانسخه، أو نفّذ على السيرفر:

```bash
php artisan key:generate
```

لا ترفع ملف `.env` إلى Git.

### 4. رفع Laravel

ارفع محتويات مجلد `backend` وليس مجلد `dashboard`.

المطلوب على السيرفر:

- `app` `bootstrap` `config` `database` `public` `routes` `storage` `vendor`
- `artisan` `composer.json` `composer.lock` `.env` `.htaccess`

لو SSH متاح:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --seed --force
php artisan config:cache
php artisan route:cache
```

`--seed` ينشئ حساب الأدمن والمحتوى الأولي. لا تعِد تشغيله بعد إضافة محتوى حقيقي إلا لو كنت تريد إعادة البيانات الأولية، والـ seeder لا يعيد إنشاء المشاريع إذا كانت موجودة.

لو الاستضافة لا تحتوي Composer، نفّذ `composer install --no-dev` على جهازك ثم ارفع مجلد `vendor` مع المشروع.

اجعل هذه المجلدات قابلة للكتابة (`755` أو `775` حسب الاستضافة):

- `storage`
- `bootstrap/cache`
- `public/uploads`

### 5. Document Root

الأفضل أن يشير الدومين إلى:

```text
backend/public
```

بعدها:

- `https://api.your-domain.com/api/public/portfolio` يرجع JSON
- `https://api.your-domain.com/admin` يفتح الداشبورد

لو لوحة الاستضافة لا تسمح بتغيير المجلد، اترك الملفات كما هي. ملف `backend/.htaccess` يحوّل الطلبات إلى `public/`.

### 6. نشر موقع Next.js

ابنِ الموقع بعد ضبط عنوان الـ API الحقيقي. المتغير يُقرأ وقت البناء:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

```bash
npm install
npm run build
```

ارفع ناتج Next.js إلى استضافة Node أو Vercel / Netlify. لا ترفع مجلد Next.js داخل `public_html` كأنه موقع PHP.

في `backend/.env` تأكد أن `FRONTEND_URL` يساوي دومين الموقع تمامًا، بما فيه `https` ومن غير شرطة أخيرة. لو الدومين مختلف، المتصفح يمنع الطلب ويظهر الموقع فارغًا أو بالمحتوى الاحتياطي.

أضف نفس الدومين في `backend/config/cors.php` إذا لم يكن قادمًا من `FRONTEND_URL`، ثم نفّذ:

```bash
php artisan config:cache
```

### 7. التحقق بعد الرفع

1. افتح `https://api.your-domain.com/api/public/portfolio` وشاهد JSON.
2. افتح `https://api.your-domain.com/admin` وسجّل الدخول.
3. غيّر كلمة المرور.
4. أضف مشروعًا بصورة وتأكد أن الملف ظهر في `public/uploads`.
5. حدّث موقع Next.js وتأكد أن المشروع والبوب أب ظهرا.

الصور المرفوعة من الداشبورد تُعرض من دومين Laravel عبر مسار يبدأ بـ `/uploads`. صور المشاريع القديمة مثل `/p1.png` تبقى داخل `public` الخاص بموقع Next.js.

## ماذا يُرفع وما لا يُرفع

| يُرفع | لا يُرفع |
| --- | --- |
| `backend` بعد ضبط `.env` وبناء `public/admin` | مجلد `dashboard` نفسه، ولا `dashboard/node_modules` |
| `backend/vendor` إذا لم يتوفر Composer على السيرفر | `backend/.env` إلى Git |
| مجلد `public` الخاص بصور Next.js مع بناء الموقع | `backend/public/uploads` الفارغ فقط؛ الصور الحقيقية تبقى على السيرفر بعد الرفع |
| | `.next` و `node_modules` الخاصة بالموقع |

عند تحديث الداشبورد لاحقًا: عدّل `dashboard`، شغّل `npm run build`، ارفع `backend/public/admin` فقط. لا تستبدل مجلد `public/uploads` حتى لا تُمسح الصور والـ CV.
