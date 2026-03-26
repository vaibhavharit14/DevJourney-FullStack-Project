# BuildDevLog — Developer Learning Journal & Project Tracker

BuildDevLog is a premium fullstack application designed for developers to document their learning journey, track side projects, and bookmark valuable resources. Built with a modern tech stack focusing on performance, aesthetics, and developer experience.

## 🚀 Teck Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Styling**: Framer Motion, Lucide Icons, Custom Design System
- **Database**: Prisma ORM with SQLite (Local)
- **State Management**: TanStack React Query (Server State)
- **Forms & Validation**: React Hook Form + Zod
- **Analytics**: Recharts
- **Theme**: Next-Themes (System-aware Dark Mode)

## ✨ Core Features

1. **Learning Log**: Chronological feed of daily learnings with markdown support and relational tagging.
2. **Project Tracker**: Visual grid of side projects with status badges and linked development logs.
3. **Resource Bookmarker**: Categorized external link management with read/unread toggles and favoriting.
4. **Dashboard**: Comprehensive analytics including 8-week activity charts, streaks, and top tag insights.
5. **Dark Mode**: Premium, system-aware dark theme persistence.

## 🛠 Setup & Installation

### Prerequisites
- Node.js 18+ (Recommended 20+)
- npm or yarn

### Steps

1. **Clone & Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run Migrations
   npx prisma migrate dev --name init
   
   # Seed Sample Data
   npx prisma db seed
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 🧠 AI Usage & Design Decisions

- **AI Tools**: Used for UI/UX inspiration, boilerplate generation, and debugging complex Prisma relations.
- **ORM Choice**: **Prisma** was chosen for its excellent TypeScript support and ease of use with SQLite. For production (Postgres), simply update the `provider` in `schema.prisma` and the `DATABASE_URL` environment variable.
- **State Management**: **React Query** handles all server-state, providing seamless caching and synchronization without the boilerplate of Redux/Zustand.
- **Design Philosophy**: Focused on "Premium Aesthetics" — using a custom HSL-based color palette, subtle glassmorphism effects, and micro-animations to create a high-end feel.

## 🧪 Production Ready
To swap to Postgres for production:
1. Update `schema.prisma`: `provider = "postgresql"`
2. Add `DATABASE_URL` to `.env`.
3. Run `npx prisma migrate deploy`.

---
Built as part of the Frontend Fullstack Intern Technical Assignment.
