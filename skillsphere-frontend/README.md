# SkillSphere

SkillSphere is a web platform built for students at Ghana Communication Technology University (GCTU) to move from theory to practical skills — combining a structured learning management system, a portfolio builder with lecturer-verified badges, and a student freelance marketplace, all in one place.

Built as part of an MPhil thesis project at GCTU.

## Features

- **Authentication** — email/password signup and login restricted to `@live.gctu.edu.gh` addresses, with three roles: Student, Lecturer, and Admin. Lecturer accounts require admin approval before they can log in.
- **Skill tracks & lessons** — browse skills by category and difficulty, enroll, work through modules and lessons, and track completion progress.
- **Assignments** — students submit practical work per module; lecturers grade or request resubmission.
- **Portfolio builder** — students showcase completed projects, with the option to submit any project for lecturer verification and earn a badge.
- **Freelance marketplace** — students offer services or bid on client-posted jobs, then manage the resulting work through a shared project workspace with milestones and messaging.
- **Reviews & ratings** — clients and freelancers rate each other after a completed marketplace project.
- **Notifications** — an in-app bell and full notifications page for badge awards, grading, marketplace activity, and account status changes.
- **Admin dashboard** — approve or reject lecturer signups, manage user roles and account status, and moderate portfolio items, service listings, and job posts.

## Tech Stack

- **Framework:** Next.js (App Router, Turbopack), React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL, hosted on [Neon](https://neon.tech)
- **ORM:** Prisma 7 (with the `@prisma/adapter-pg` driver adapter)
- **Auth:** Custom — bcrypt password hashing, JWT session cookies via `jose`
- **Icons:** Lucide

## Getting Started

### Prerequisites

- Node.js
- A free [Neon](https://neon.tech) Postgres database

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```
DATABASE_URL="your-neon-connection-string"
JWT_SECRET="a-long-random-string"
```

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### 5. Create the first admin account

There is no public admin signup path. To create the first administrator:

1. Sign up normally as a **Student** through the app.
2. In the Neon SQL Editor, run:
   ```sql
   UPDATE users SET role = 'ADMIN', status = 'ACTIVE' WHERE email = 'your-email@live.gctu.edu.gh';
   ```
3. Log in at `/admin/login` with that account.

## Project Structure

```
app/                   Next.js App Router pages and API routes
  api/                 Backend API routes (auth, marketplace, admin, etc.)
  admin/               Admin dashboard and admin-only login
  lecturer/            Lecturer dashboard
  marketplace/         Marketplace pages (listings, jobs, projects)
  skills/              Skill browsing, lesson viewer, assignments
components/            Shared UI components
context/               AuthContext (client-side auth state)
lib/                   Client-side data-fetching helpers and API-side utilities
prisma/                Database schema and migrations
```

## Known Limitations

This is an academic prototype. The following are intentionally out of scope for now:

- No real payment processing — the marketplace tracks agreed prices and milestones, but payment is arranged directly between client and freelancer.
- No file uploads — portfolio and marketplace evidence use external links (e.g. Google Drive, GitHub) rather than direct file hosting.
- No password reset flow.
- No email verification on signup.
- Notifications use polling (checked every 15 seconds) rather than real-time push.

## License

Academic project — not licensed for external distribution.
