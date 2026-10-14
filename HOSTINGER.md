# رفع المشروع على Hostinger Shared Hosting

الداشبورد هي اللي بتتحكم في محتوى الموقع: المشاريع، التقييمات، الخبرات، روابط التواصل، نصوص الهيرو والفوتر، والـ CV. الموقع العام يقرأ البيانات من Laravel، ومش من ملفات ثابتة.

## الأجزاء الثلاثة

| الجزء | المجلد | التقنية | أين يشتغل على هوستنجر |
| --- | --- | --- | --- |
| الموقع الذي يراه الزائر | جذر المشروع | Next.js | يحتاج Node. الاستضافة المشتركة PHP لا تشغّله |
| الـ API وقاعدة البيانات | `backend` | Laravel + MySQL | Shared Hosting |
| الداشبورد | `dashboard` | React | لا تُرفع كسورس. تُبنى ثم تُرفع داخل `backend/public/admin` |

الدومين العام للموقع هو `https://ahmedjamall.com`. هذا الدومين ليس دومين الـ API. Laravel والداشبورد يشتغلان على سب دومين منفصل، مثل `https://api.ahmedjamall.com`.

```text
الزائر يفتح https://ahmedjamall.com
        |
        |  GET https://api.ahmedjamall.com/api/public/portfolio
        v
Laravel على هوستنجر  --->  MySQL
        ^
        |  تعديل المحتوى
الأدمن يفتح https://api.ahmedjamall.com/admin
```

## هيكل مهم قبل الرفع

```text
backend/
├── app/                  منطق الـ API
├── database/migrations   الجداول
├── public/               هذا المجلد هو جذر الموقع على هوستنجر
│   ├── index.php
│   ├── admin/            الداشبورد بعد npm run build
│   └── uploads/          الصور والـ CV
├── storage/              لازم يكون قابل للكتابة
├── vendor/               مكتبات PHP
├── .env                  إعدادات السيرفر، لا يرفع على Git
└── .htaccess             يستخدم لو لم تقدر تغيّر Document Root

dashboard/                سورس الداشبورد فقط، لا يرفع على السيرفر
```

الداشبورد أثناء التطوير تفتح على `http://localhost:5173`. بعد البناء تفتح من دومين Laravel على `/admin`.

## قبل ما ترفع

من جهازك، داخل مجلد `dashboard`:

```bash
cd dashboard
npm install
npm run build
```

الناتج يتحط تلقائيًا في `backend/public/admin`. لو عدّلت الداشبورد لاحقًا، كرر الأمر وارفع مجلد `admin` فقط.

PHP المطلوب على هوستنجر: **8.2 أو أحدث**. من hPanel: Advanced ثم PHP Configuration، واختر 8.2.

## 1. قاعدة البيانات

من hPanel ثم Databases ثم MySQL Databases:

1. أنشئ قاعدة بيانات.
2. أنشئ مستخدمًا وكلمة مرور.
3. اربط المستخدم بقاعدة البيانات مع كل الصلاحيات.

هوستنجر يضيف بادئة لاسم الحساب، مثل `u123456789_jamal`. انسخ الأسماء كما تظهر في اللوحة.

## 2. ملف `backend/.env`

الملف الجاهز على جهازك هو `backend/.env.hostinger`. انسخه على السيرفر باسم `.env`، ثم اكتب اسم قاعدة هوستنجر والمستخدم وكلمة المرور في `DB_DATABASE` و`DB_USERNAME` و`DB_PASSWORD`.

على السيرفر، ليس على Git:

```env
APP_NAME="Portfolio CMS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.ahmedjamall.com
APP_KEY=base64:انسخه-من-الجهاز-أو-ولده-على-السيرفر
FRONTEND_URL=https://ahmedjamall.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u123456789_jamal
DB_USERNAME=u123456789_user
DB_PASSWORD=كلمة-المرور

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

`APP_URL` هو سب دومين الـ API: `https://api.ahmedjamall.com`. `FRONTEND_URL` هو دومين الموقع فقط: `https://ahmedjamall.com`، من غير `/` في الآخر. لا تضع `ahmedjamall.com` في `APP_URL`. لو `FRONTEND_URL` غلط، المتصفح يمنع الموقع من قراءة الـ API.

لتوليد المفتاح محليًا:

```bash
cd backend
php artisan key:generate --show
```

انسخ الناتج إلى `APP_KEY`.

## 3. ماذا ترفع

ارفع محتويات `backend` إلى مجلد الدومين أو السب دومين، وليس مجلد `dashboard`.

ارفع:

- `app` `bootstrap` `config` `database` `public` `routes` `storage` `vendor`
- `artisan` `composer.json` `composer.lock` `.env` `.htaccess`

لا ترفع:

- `dashboard/`
- `dashboard/node_modules`
- `backend/node_modules`
- ملف `.env` إلى GitHub

لو الخطة فيها SSH:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --seed --force
php artisan config:cache
php artisan route:cache
```

`--seed` ينشئ الأدمن والمحتوى الأول. لا تعِد تشغيله بعد ما تضيف مشاريع حقيقية.

لو مفيش SSH، نفّذ `composer install --no-dev` على جهازك وارفع مجلد `vendor` مع الملفات. بعدها استورد الجداول من phpMyAdmin، أو شغّل migrate من Terminal في hPanel إن كان ظاهرًا.

اجعل هذه المجلدات قابلة للكتابة:

- `storage`
- `bootstrap/cache`
- `public/uploads`

من File Manager: Permissions ثم `775`.

## 4. Document Root

الأفضل من hPanel ثم Domains ثم اختيار الدومين، ثم توجيه الجذر إلى:

```text
public_html/public
```

أو مسار مجلد `backend/public` حسب مكان الرفع.

بعدها:

- `https://api.ahmedjamall.com/admin` الداشبورد
- `https://api.ahmedjamall.com/api/public/portfolio` بيانات الموقع
- `https://ahmedjamall.com` موقع الزائر، وليس مكان رفع Laravel

لو لم تستطع تغيير الجذر، اترك ملف `backend/.htaccess` في نفس مكان الملفات. هو يحوّل الطلبات إلى مجلد `public`.

## 5. موقع Next.js

الاستضافة المشتركة لا تشغّل `npm run start`. موقع الزائر له خياران:

1. خطة هوستنجر التي فيها Node.js Web App.
2. Vercel أو Netlify، والـ API يفضل على هوستنجر.

قبل بناء الموقع غيّر `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.ahmedjamall.com
```

ثم:

```bash
npm install
npm run build
```

هذا المتغير يُثبَّت وقت البناء. لو بنيت الموقع وهو لسه `http://127.0.0.1:8000`، الموقع المنشور هيفضل يطلب جهازك.

في `backend/.env` لازم `FRONTEND_URL` يبقى `https://ahmedjamall.com`. بعد تعديله:

```bash
php artisan config:cache
```

## 6. الدخول لأول مرة

- البريد: `elhwtdoba@gmail.com`
- كلمة المرور: `Admin@12345`

غيّر كلمة المرور من الإعدادات فور الدخول. من الداشبورد تقدر تعدّل:

- المشاريع وصورها ولينك الموقع أو GitHub
- المشاريع الخاصة: من غير لينك حي، مع رسالة وصور فقط
- التقييمات والخبرات وروابط التواصل
- نص الهيرو والفوتر وصورة الهيرو وملف الـ CV

أي تعديل يظهر في الموقع بعد تحديث صفحة الزائر، طالما Laravel شغال والدومين في `NEXT_PUBLIC_API_URL` صحيح.

## 7. تحقق بعد الرفع

1. افتح `/api/public/portfolio` وشاهد JSON وليس صفحة خطأ.
2. افتح `/admin` وسجّل الدخول.
3. ارفع صورة مشروع وتأكد أنها ظهرت في `public/uploads`.
4. افتح الموقع العام وتأكد أن المشروع والبوب أب ظاهرين.
5. جرّب "Check Live Site" لمشروع علني.

## تحديث لاحق

| عدّلت | ارفع |
| --- | --- |
| شكل الداشبورد أو صفحاتها | `npm run build` ثم مجلد `backend/public/admin` فقط |
| كود Laravel | الملفات المعدّلة داخل `backend` ثم `php artisan config:cache` |
| محتوى الموقع | لا شيء. الحفظ من الداشبورد يكفي |
| صور أو CV | لا تستبدل مجلد `public/uploads` عند الرفع، حتى لا تُمسح الملفات الحالية |
