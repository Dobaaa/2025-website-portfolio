# Portfolio CMS (Laravel API + React dashboard)

This folder is independent from the current Next.js portfolio design.
The public site stays static until you later connect it to `GET /api/public/portfolio`.

## Local setup

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

SQLite (easiest locally):

```
DB_CONNECTION=sqlite
```

Create `backend/database/database.sqlite` if needed, then:

```bash
php artisan migrate --seed
php artisan serve
```

In another terminal:

```bash
cd dashboard
npm install
npm run dev
```

Open `http://localhost:5173`

Default login:

- Email: `elhwtdoba@gmail.com`
- Password: `Admin@12345`

Change the password from Settings after first login.

## Dashboard features

- Projects with popup details, extra images, live/GitHub links
- Confidential dashboards: no live link, custom privacy message, screenshots only / meeting
- Testimonials
- Work experience
- Social links
- Hero/footer/contact text
- CV upload
- Public API for later frontend connection: `GET /api/public/portfolio`

## Shared hosting (cPanel / Hostinger)

1. Create a MySQL database and user.
2. In `.env` set:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

3. Upload the `backend` folder.
4. Point the domain document root to `backend/public` if the host allows it.
   If it does not, keep the included `backend/.htaccess` so requests route into `public/`.
5. On the server:

```bash
php artisan migrate --seed --force
```

6. Build and deploy the dashboard:

```bash
cd dashboard
npm install
npm run build
```

This writes files into `backend/public/admin`.
Open `https://your-domain.com/admin`.

7. Make these folders writable: `backend/storage`, `backend/bootstrap/cache`, `backend/public/uploads`.

PHP 8.2+ is required. Shared hosting does not need a queue worker with the included `.env` settings.
