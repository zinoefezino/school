# School Management Dashboard

A Next.js school portal for administrators, staff, parents, and students. The app is built around real database-backed dashboards instead of demo fixtures, with MongoDB/Mongoose models for academics, users, announcements, attendance, results, assignments, timetable, fees, and payments history.

Payment gateway integration is intentionally left for the final phase.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- Hugeicons for dashboard icons
- ESLint / TypeScript validation

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/school
AUTH_SECRET=replace-with-a-long-random-secret
```

Create the first admin account:

```bash
npm run create-admin
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main roles

- Admin: manages students, staff, parents, classes, academics, announcements, fees, attendance overview, assignments, and timetable.
- Staff: views assigned classes, records attendance for classes they head, enters results, publishes assignments, and manages timetable entries for subjects they teach.
- Student: views profile, classes, attendance, results, assignments, timetable, announcements, messages placeholder, and payment history.
- Parent: views children, attendance, results, fees, and announcements.

## Academic model

The app separates class heads from subject teachers:

- `ClassSection.classTeacher` is the class head/form teacher.
- `TeachingAssignment` maps one class and subject to the teacher who teaches it.
- Staff can only create assignments, timetable entries, and results for class+subject combinations assigned to them.
- Attendance remains a class-head responsibility.

Admin can manage subject-teacher assignments from Dashboard → Admin → Academics.

## Implemented dashboard work

- Removed hardcoded parent, student, and staff dashboard fixture data.
- Wired announcements across admin, parent, student, and staff dashboards.
- Added admin-only announcement deletion so old notices can be removed.
- Fixed announcement/account form reset crashes caused by async `event.currentTarget.reset()`.
- Added centered spinning loading states across dashboard pages.
- Added student profile data wiring, including name, age/date of birth, gender, and professional male/female/default student icons.
- Added database-backed student assignments and timetable pages.
- Added staff assignment and timetable creation flows.
- Added admin academic setup pages for sessions, terms, subjects, subject teachers, assignments, and timetable.
- Added admin student pagination and database indexes for larger school sizes.
- Fixed admin student action dropdown clipping by rendering the menu above table overflow.

## Scale notes

The app is being prepared for schools with thousands of students:

- Admin students list uses pagination.
- Key models now include indexes for frequent dashboard queries.
- Attendance, assessments, enrollments, invoices, assignments, and timetable lookups are designed around class, term, student, subject, and teacher references.

For 5,000–10,000+ students, keep using paginated admin views and avoid loading full student collections into client pages.

## Useful scripts

```bash
npm run dev          # start local development
npm run build        # build production app
npm run start        # start production server
npm run lint         # run ESLint
npm run create-admin # create first admin user
```

## Current validation status

Recent focused checks passed for the new dashboard and subject-teacher work:

```bash
npx tsc --noEmit
npx eslint <focused files>
```

Note: a full TypeScript run later surfaced an unrelated syntax issue in `app/contact/page.tsx`; fix that page before relying on a full-project typecheck.

## Remaining major phase

Payments integration is the main planned final phase. Current payment-related pages show stored fee/payment data, but gateway collection and reconciliation should be added last.
