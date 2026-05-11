# Needly — College Item Exchange Platform

Needly is a premium, secure, and performant marketplace designed specifically for college students to buy and sell items within their campus ecosystem.

## 🚀 Project Overview

The platform bridges the gap between students looking for affordable campus essentials and those wanting to declutter. It features a robust role-based architecture, secure authentication, and a modern, fluid user interface.

---

## 🛠 Tech Stack

### Frontend (`/needle-frontend`)
- **Core**: React 18 + Vite
- **Routing**: TanStack Router (Type-safe, file-based routing)
- **State Management**: Zustand (Auth & UI state)
- **Data Fetching**: TanStack Query (Caching, invalidation, and sync)
- **Styling**: Tailwind CSS + Shadcn UI (Stone palette design system)
- **Animations**: Custom CSS Keyframes (Fluid page transitions)
- **Icons**: Lucide React

### Backend (`/backend`)
- **Runtime**: Node.js (Express.js)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Security**: JWT (Access + Refresh token rotation), HttpOnly Cookies
- **Validation**: Zod (Schema-based validation)
- **Storage**: Cloudinary (Image management)
- **Infrastructure**: Redis (Upstash) for Rate Limiting
- **Documentation**: Swagger UI

---

## ✨ Key Features

### 🛒 Marketplace
- **Grid Layout**: Responsive item grid with infinite scrolling.
- **Search & Filter**: Category-based filtering and real-time search.
- **Item Management**: Post new items, edit existing listings, and mark as sold.
- **My Listings**: A dedicated dashboard for managing your personal inventory.

### 🛡 Admin Dashboard
- **Platform Stats**: Real-time overview of users, listings, and reports with skeleton loading states.
- **User Management**: Ability to view all users and handle account statuses (Ban/Unban).
- **Reporting System**: Integrated system to track and resolve reports on policy-violating items.

### 🔐 Security & Auth
- **Campus-Only Access**: Email-based verification.
- **Session Persistence**: Secure cookie-based auth that persists across refreshes.
- **Protected Routes**: Role-aware routing (User vs Admin) using layout guards.

### 💬 Chat System (Architecture Ready)
- **Database Model**: Pre-built `Interaction` and `Message` models in Prisma.
- **Real-time**: WebSocket integration ready (Socket.io).

---

## 📂 Project Structure

```text
college-item-exchange-anti/
├── backend/                # Express API
│   ├── prisma/             # DB Schema & Migrations
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── routes/         # API Endpoints
│       ├── services/       # Business logic (Prisma queries)
│       └── server.js       # Entry point
└── needle-frontend/        # React Application
    └── src/
        ├── components/     # UI Library (Atomic design)
        ├── hooks/          # Data fetching & logic hooks
        ├── routes/         # File-based pages
        └── store/          # Zustand state (Auth/UI)
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` (Database URL, JWT Secret, Cloudinary keys)
4. `npx prisma generate`
5. `npm run dev`

### 2. Frontend Setup
1. `cd needle-frontend`
2. `npm install`
3. Configure `.env` (Backend URL)
4. `npm run dev`

---

## 📄 API Documentation
Once the backend is running, visit `/api-docs` to view the full Swagger documentation for all endpoints.

## 🎨 Design Guidelines
Needly uses a strict **Stone** color palette (`stone-50` to `stone-900`) with high-quality micro-animations. All new components should adhere to the atomic `PageShell` and `PageLoader` standards for consistency.
