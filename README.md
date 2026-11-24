# د MSA Developer Portfolio — Full-Stack پروژه

دا پروژه ستا اصلي React Portfolio ساتي او ورسره Express Backend، MongoDB Atlas، د پیغامونو فورم او Admin Dashboard نښلوي.

## د پروژې جوړښت

- `src/` — د React وېب‌سایټ او Admin Dashboard
- `src/services/api.js` — له Backend سره د Frontend اتصال
- `src/pages/Admin.jsx` — د Admin Login او Dashboard
- `public/files/` — ستا د CV PDF فایل
- `backend/src/config/` — د MongoDB اتصال
- `backend/src/models/` — د Admin، Project او Contact Database Models
- `backend/src/controllers/` — د API منطق
- `backend/src/routes/` — د API لارې
- `backend/src/middleware/` — JWT امنیت او د Error مدیریت

## ۱. اړتیاوې

- Node.js LTS او npm نصب کړه.
- MongoDB Atlas Cluster ولره.

## ۲. د MongoDB او Backend تنظیم

۱. MongoDB Atlas کې Database User جوړ کړه.
۲. د Network Access برخه کې خپل اوسنی IP اجازه ورکړه.
۳. `backend/.env.example` کاپي کړه او نوی فایل د `backend/.env` په نوم جوړ کړه.
۴. د `MONGODB_URI` ارزښت کې خپل Atlas Connection String ولیکه.
۵. `JWT_SECRET` ته لږ تر لږه ۳۲ توري لرونکی تصادفي Secret ورکړه.
۶. `ADMIN_EMAIL` او `ADMIN_PASSWORD` ته د خپل Admin معلومات ولیکه. Password باید لږ تر لږه ۱۲ توري ولري.

**مهم:** د `.env` فایل، Database Password او JWT Secret له چا سره مه شریکوه او GitHub ته یې مه پورته کوه.

په VS Code کې Terminal خلاص کړه او دا کمانډونه اجرا کړه:

```bash
cd backend
npm install
npm run seed:admin
npm run dev
```

که اتصال سم وي، دا پته خلاصه کړه:

`http://localhost:5000/api/health`

باید د API د روغتیا پیغام ښکاره شي.

## ۳. د Frontend چلول

یو بل Terminal خلاص کړه، د پروژې اصلي فولډر ته لاړ شه او دا کمانډونه اجرا کړه:

```bash
npm install
npm run dev
```

Vite به یوه Local پته درکړي، عموماً:

`http://localhost:5173`

Frontend د Root `.env` فایل کې `VITE_API_URL` کاروي. که `.env` نه وي، په اتومات ډول `http://localhost:5000/api` کاروي.

## ۴. Admin Dashboard

دا پته خلاصه کړه:

`http://localhost:5173/admin`

د Login لپاره هغه `ADMIN_EMAIL` او `ADMIN_PASSWORD` وکاروه چې په `backend/.env` کې دې لیکلي دي.

Admin Dashboard دا کارونه کوي:

- نوې Project اضافه کول
- Project بدلول او حذف کول
- د Contact پیغامونه لوستل
- پیغامونه د لوستل شوو په توګه نښه کول
- پیغامونه حذف کول

د عام Portfolio د Projects برخه معلومات له MongoDB اخلي. که Backend بند وي، د پروژې Local نمونه ښيي.

## ۵. د API لارې

| Method | API Route | لاسرسی | کار |
|---|---|---|---|
| GET | `/api/health` | عام | د API ازموینه |
| POST | `/api/auth/login` | عام | د Admin Login او JWT |
| GET | `/api/projects` | عام | د پروژو لېست |
| GET | `/api/projects/:id` | عام | یوه پروژه |
| POST | `/api/projects` | Admin | پروژه اضافه کول |
| PUT | `/api/projects/:id` | Admin | پروژه بدلول |
| DELETE | `/api/projects/:id` | Admin | پروژه حذف کول |
| POST | `/api/contacts` | عام | د Contact پیغام لېږل |
| GET | `/api/contacts` | Admin | ټول پیغامونه |
| PATCH | `/api/contacts/:id/read` | Admin | پیغام لوستل شوی نښه کول |
| DELETE | `/api/contacts/:id` | Admin | پیغام حذف کول |

د Admin خوندي API لپاره دا Header استول کېږي:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## ۶. د آنلاین کولو لنډ معلومات

- Frontend په Vercel کې Deploy کړه او `VITE_API_URL` د خپل آنلاین Backend URL ته تنظیم کړه چې په `/api` ختم شي.
- Backend په Node.js Hosting کې Deploy کړه او ټول Backend Environment Variables هلته ثبت کړه.
- `CLIENT_URL` د خپل آنلاین Frontend اصلي Domain ته برابر کړه.
- د `.env` فایلونه هېڅکله GitHub ته مه پورته کوه.

دا پروژه د Local Development لپاره چمتو شوې ده. د Production Deploy لپاره باید حقیقي Environment Variables تنظیم او دواړه Services جلا ازمویل شي.
