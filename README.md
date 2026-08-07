# TaskMaster Pro — Enterprise Task Management System

![TaskMaster Pro](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11.0-red?style=for-the-badge&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-5.22-blue?style=for-the-badge&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Cloud-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

A production-grade, full-stack Task Management System featuring a pixel-perfect Figma implementation, JWT Authentication, 1-Click Guest Login, Google Login UI, dynamic Theme Customization (Light/Dark mode + Accent Colors), real-time Task CRUD, Search, Multi-criteria Filtering, Sorting, Offset/Limit Pagination, and interactive Kanban/Grid/Table views.

---

## 🌟 Key Features

- ⚡ **1-Click Guest Demo Login**: Instantly test preloaded tasks without creating an account.
- 🎨 **Glassmorphism Figma UI**: Modern dark/light theme switcher with custom accent colors (Indigo, Emerald, Violet, Amber, Cyan).
- 📊 **Productivity Dashboard**: Live stat metrics (Total, Completed, In Progress, Overdue), target completion velocity bar, and priority matrix.
- 📝 **Full Task CRUD**:
  - Search by title or description (fuzzy search)
  - Filter by Status (`TODO`, `IN_PROGRESS`, `COMPLETED`), Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and Category (`Work`, `Design`, `Development`, `DevOps`, `Personal`)
  - Sort by Due Date, Priority, Title, or Date Created
  - Pagination (Offset/Limit)
  - 3 Layout Views: **Grid Cards**, **Structured Table**, and **Kanban Columns**
- 🛡️ **Clean Architecture & Validation**:
  - NestJS modular architecture (`AuthModule`, `UsersModule`, `TasksModule`, `PrismaModule`)
  - Global `ValidationPipe` with DTO class-validators
  - React Hook Form + Zod schema validation
- 💾 **MongoDB Atlas Database Integration**: Connected to live cloud MongoDB cluster.

---

## 📁 Repository Structure

```
.
├── backend/                  # NestJS REST API Server
│   ├── prisma/
│   │   └── schema.prisma     # Prisma Schema (MongoDB / SQLite)
│   ├── src/
│   │   ├── auth/             # Auth Module (JWT, Passport, Hashing, Guest Login)
│   │   ├── users/            # Users Profile & Settings Module
│   │   ├── tasks/            # Tasks Module (CRUD, Stats, Pagination, Filter)
│   │   └── main.ts           # NestJS Server Entry & CORS Configuration
│   └── package.json
│
├── frontend/                 # Next.js 14 (App Router) Client App
│   ├── src/
│   │   ├── app/              # App Router Pages (/login, /dashboard, /tasks, /profile, /settings)
│   │   ├── components/       # Reusable UI (Sidebar, Navbar, TaskCard, TaskTable, TaskModal, Skeletons)
│   │   ├── context/          # AuthContext & ThemeContext
│   │   ├── lib/              # Axios API Client
│   │   └── types/            # TypeScript Definitions
│   └── package.json
│
└── docs/                     # Documentation & AbleSpace Walkthrough Report
    └── AbleSpace_Caseload_TakeData_Walkthrough.md
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables Setup

#### Backend (`./backend/.env`):
```env
DATABASE_URL="mongodb+srv://dnsptl2004:MyStrong%40123@cluster0.bdfkbv9.mongodb.net/mydb"
JWT_SECRET="super-secret-jwt-key-task-management-2026"
JWT_EXPIRES_IN="7d"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (`./frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

### 3. Run Database Push & Start Servers

```bash
# Push Prisma Schema to MongoDB Atlas
cd backend
npx prisma db push

# Start Backend Dev Server (Port 5000)
npm run start:dev

# Open a new terminal and start Frontend Dev Server (Port 3000)
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser. Click **"Instant 1-Click Guest Demo Login"** to explore immediately!

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel

1. Push your project to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com) → **Add New Project**.
3. Select the repository and set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://taskmaster-backend-19k7.onrender.com`
5. Click **Deploy**.

### Deploying Backend to Render

1. Go to [Render Dashboard](https://render.com) → **New Web Service**.
2. Connect your repository and select **Root Directory** as `backend`.
3. Build Command: `npm install && npx prisma db push && npm run build`
4. Start Command: `npm run start:prod`
5. Add Environment Variables:
   - `DATABASE_URL`: `mongodb+srv://dnsptl2004:MyStrong%40123@cluster0.bdfkbv9.mongodb.net/mydb`
   - `JWT_SECRET`: `<your-production-secret>`
   - `PORT`: `5000`
6. Click **Deploy Web Service**.

---

## 📖 Walkthrough Document

A complete UX/UI evaluation report for **AbleSpace Caseload → Take Data** is available under:
- [`docs/AbleSpace_Caseload_TakeData_Walkthrough.md`](file:///c:/Users/dnspt/OneDrive/Desktop/Task/docs/AbleSpace_Caseload_TakeData_Walkthrough.md)

---

## 📄 License

MIT © 2026 TaskMaster Team. Production Ready.
