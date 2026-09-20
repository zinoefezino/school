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
SESSION_MAX_AGE_SECONDS=28800
```

`SESSION_MAX_AGE_SECONDS` controls how long a login remains valid. The default is `28800` seconds, which is 8 hours. After this time, the signed session expires and protected dashboard pages redirect back to login.

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

- Admin: manages students, staff, parents, academics, operations, finance, communications, and settings.
- Staff: views assigned classes, records attendance for classes they head, enters results, publishes assignments, and manages timetable entries for subjects they teach.
- Student: views profile, classes, attendance, results, assignments, timetable, announcements, messages placeholder, and payment history.
- Parent: views children, attendance, results, fees, and announcements.

Students, parents, staff, and admins can change their own passwords from their dashboard settings/password page.

## Authentication and security

The app uses signed HTTP only cookies for login sessions. Session tokens include:

- user id
- email
- role
- expiry time

On successful login, the user record stores `lastLoginAt`. Desktop dashboard topbars display this subtly in italic text, while mobile users can see the same account and last-login information from Settings.

The cookie is:

- `httpOnly`, so browser JavaScript cannot read it
- `sameSite: lax`, which helps reduce cross site request risk
- `secure` in production
- limited by `SESSION_MAX_AGE_SECONDS`

Protected dashboard routes are guarded by `proxy.ts`:

- `/dashboard/admin` requires an admin session
- `/dashboard/staff` requires a staff session
- `/dashboard/parent` requires a parent session
- `/dashboard/student` requires a student session
- expired or missing sessions redirect to `/portal/login`
- users who try to open another role's dashboard are redirected back to their own dashboard

API routes also check the signed session and enforce role specific access on the server. Admin APIs require admin sessions, staff APIs require staff sessions, student APIs require student sessions, and parent APIs only return records linked to the logged in parent account.

Parent access is resolved from the signed session cookie and `Guardian.user`. The app does not trust client supplied guardian or student ids for ownership. Parent child, attendance, fees, and result APIs verify that requested students belong to the logged in parent.

The admin topbar includes a protected global search. It calls:

```txt
/api/admin/search?q=...
```

The route requires an admin session and returns a small capped result set across students, staff, parents/guardians, classes, invoices, announcements, and news posts. The topbar opens a dropdown after at least two characters, and selecting a result navigates to the relevant admin page.

Security notes before production:

- use a long random `AUTH_SECRET`
- use HTTPS so secure cookies are enforced
- keep MongoDB credentials private
- add rate limiting for login, forgot password, and reset password endpoints
- add email delivery for password resets instead of showing reset links directly in development workflows
- review audit logging for admin actions such as account creation, deactivation, announcement deletion, and payment updates

## Academic model

The app separates class heads from subject teachers:

- `ClassSection.classTeacher` is the class head/form teacher.
- `TeachingAssignment` maps one class and subject to the teacher who teaches it.
- Staff can only create assignments, timetable entries, and results for class+subject combinations assigned to them.
- Attendance remains a class-head responsibility.

Admin can manage subject-teacher assignments from Dashboard → Admin → Academics.

## How the school flow works

### 1. Users and profiles

Authentication is handled through the `User` model. Each user has a role:

- `ADMIN`
- `STAFF`
- `STUDENT`
- `PARENT`

Role-specific profile models then connect the login account to school data:

- `Staff.user` points to the staff member's `User`.
- `Student.user` points to the student's `User`.
- `Guardian.user` points to the parent's `User`.

This keeps login credentials separate from school records.

### 2. Parents assigned to students

A student can have an assigned parent/guardian:

```txt
Student.guardian → Guardian
Guardian.user → User
```

When a parent logs in, the parent dashboard only loads students where:

```txt
Student.guardian = logged-in Guardian._id
```

The student profile also shows the assigned parent if one exists.

### 3. Classes and class levels

Classes are split into two concepts:

- `ClassLevel`: the academic level, such as JSS 1, JSS 2, SS 1.
- `ClassSection`: the actual class arm/section, such as JSS 1 Gold or SS 2 A.

`ClassSection` points to `ClassLevel`:

```txt
ClassSection.classLevel → ClassLevel
```

This makes it possible to have many arms under the same level.

### 4. How students are assigned to classes

Students are assigned to classes through the `Enrollment` model.

The student record does not directly store the current class. Instead:

```txt
Student → Enrollment → ClassSection
```

An enrollment connects:

- `student`
- `classSection`
- `term`
- `status`

The active class for a student is the active enrollment:

```txt
Enrollment.status = ACTIVE
```

This is important because a student can move from one class/term/session to another over time without losing history.

### 5. How class teachers are assigned

A class teacher is the head/form teacher of a class.

That relationship is stored directly on the class section:

```txt
ClassSection.classTeacher → Staff
```

The class teacher is responsible for class-level duties such as attendance. This is separate from subject teaching.

Admin assigns or changes a class teacher from:

```txt
Dashboard → Admin → Academics → Classes → Edit
```

The edit screen uses a staff dropdown, not a raw staff id. Choosing `Unassigned` clears the class teacher.

Classes can be deleted from the class list or from the edit screen, but deletion is blocked when the class has active students. This protects enrollment, attendance, invoice, and result history. The app does not use a "disable class" action because classes do not have login access. If a school later needs to retire old classes while keeping history, the recommended feature is archive/close class rather than disable class.

### 6. How subject teachers are assigned

Subject teachers are assigned separately through `TeachingAssignment`.

```txt
TeachingAssignment.classSection → ClassSection
TeachingAssignment.subject → Subject
TeachingAssignment.teacher → Staff
```

This means one class can have different teachers for different subjects.

Example:

```txt
JSS 1 Gold + Mathematics → Mr. A
JSS 1 Gold + English → Mrs. B
JSS 1 Gold + Basic Science → Mr. C
```

The class teacher could still be someone else entirely.

Admin manages this from:

```txt
Dashboard → Admin → Academics → Subject teachers
```

### 7. Staff dashboard rules

The staff dashboard uses the class and subject relationships to decide what a staff member can do.

A staff member sees:

- classes where they are the class head
- classes/subjects where they are the assigned subject teacher

Permissions are separated like this:

- Attendance: class teacher/class head only.
- Results: assigned subject teacher only.
- Assignments: assigned subject teacher only.
- Timetable entries: assigned subject teacher only.

This prevents a teacher from entering results or publishing assignments for a class/subject they do not teach.

### 8. Results flow

Results are stored as assessment records:

```txt
Assessment.student → Student
Assessment.subject → Subject
Assessment.term → Term
```

Staff enter scores for students in the class/subject assigned to them. Results can then be submitted for admin review using `ResultSubmission`.

Students only see results for terms where:

```txt
Term.resultsPublished = true
```

When results are available, the student sidebar shows a badge count. Opening the results page marks those published result periods as read in browser storage.

Students can download published results as:

- PDF
- DOCX

Student and parent dashboards also surface academic status from enrollment history:

- active enrollment only: currently enrolled
- active enrollment plus completed enrollment history: promoted from the previous class
- completed enrollment with no active enrollment: completed or graduated
- no enrollment yet: awaiting class assignment

### 9. Attendance flow

Attendance records are stored per student and date:

```txt
Attendance.student → Student
Attendance.term → Term
Attendance.date
Attendance.status
```

The class teacher/class head records attendance for students in their class.

Students and parents see attendance summaries based on those records.

### 10. Assignments flow

Assignments are database-backed and connected to class, subject, term, and teacher:

```txt
Assignment.classSection → ClassSection
Assignment.subject → Subject
Assignment.term → Term
Assignment.teacher → Staff
```

Assigned subject teachers can publish assignments for their own class/subject combinations. Students see assignments for their active class.

### 11. Timetable flow

Timetable entries are also database-backed:

```txt
TimetableEntry.classSection → ClassSection
TimetableEntry.subject → Subject
TimetableEntry.teacher → Staff
TimetableEntry.term → Term, optional
```

Students see timetable entries for their active class. Staff can create timetable entries only for class/subject combinations assigned to them.

### 12. Announcements flow

Announcements are published by admins and targeted to one or more audiences:

- students
- parents
- staff

The same announcement system feeds:

- admin announcements
- student announcements
- parent announcements
- staff announcements
- dashboard overview announcement cards

Admins can delete announcements so old notices do not pile up.

For students, parents, and staff, new announcements show a badge count in the sidebar until the user opens the announcements page.

Announcement read state is database backed per user through `AnnouncementRead`, so reading announcements on one device clears the count on other devices for the same login account. Admin deletion also removes the related read receipts.

Announcement pages use server side pagination instead of loading every notice at once. Dashboards fetch a small page of announcements at a time, show a total count for the current audience/filter, and fall back to the visible page count if an older response does not include a total. This keeps the UI usable even when the school has many archived notices.

### 13. Public news flow

News is separate from announcements.

```txt
Announcement = private dashboard notice
NewsPost = public homepage/news content
```

Admins publish public news from:

```txt
Dashboard → Admin → Communications → News
```

A news post includes:

- title
- slug
- excerpt
- full story body
- optional category
- cover photo URL
- draft or published status
- publish date

Published news appears in:

- homepage Latest News section
- `/news`
- `/news/[slug]`

The first version stores `coverImageUrl` as a URL so admins can paste a photo link.

Before production, add proper image upload storage for news photos. Recommended options include Cloudinary, S3/R2, Vercel Blob, Firebase Storage, or another managed object storage provider. Do not rely on pasted external image URLs for the production news workflow.

### 14. Public academics and admissions pages

The homepage keeps short preview sections for Academics and Admissions, while full public pages provide more detail:

```txt
/academics
/admissions
```

`/academics` explains the school stages, teaching model, assessment approach, subjects, and the difference between class teachers and subject teachers.

`/admissions` explains the enquiry-to-enrollment flow, required documents, class placement, parent/student linking, and what happens after admission.

These pages currently use static website copy and existing images from the `public` folder. They do not need admin management yet unless the school wants non-technical admins to edit website copy from the dashboard later.

### 15. Finance, fees, invoices, and payment records

Finance starts with an admin fee schedule. Admin defines fees by:

- academic session
- term
- class
- amount
- due date
- whether installments are allowed
- minimum installment amount, if installments are allowed

The academic session is selected through the term:

```txt
Term.session → AcademicSession
ClassFee.term → Term
ClassFee.classSection → ClassSection
```

Admin manages this from:

```txt
Dashboard → Admin → Finance → Fee structure
```

Finance uses one main admin sidebar entry so the admin sidebar does not become overcrowded. Inside the Finance page, the internal finance navigation is:

- Overview
- Fee structure
- Student invoices
- Transactions
- Outstanding payments
- Financial reports

The same module-navigation pattern is used elsewhere in admin:

- Academics: setup, classes, assignments, timetable, and subject teachers
- Operations: attendance and promotions
- Communications: announcements, new announcement, and public news

The main admin sidebar stays focused on major areas:

- Overview
- Students
- Staff
- Parents
- Academics
- Operations
- Finance
- Communication
- Settings

Finance pages are built to avoid long uncontrolled scrolling:

- Fee structure has class search, a limited class dropdown, searchable fee schedules, status/term filters, and pagination.
- Student invoices use server side pagination, student/class search, and status filters.
- Transactions, outstanding payments, and reports are kept inside the finance module so the admin sidebar remains focused.

Saving a fee schedule keeps it as a draft/setup record. Publishing a fee schedule generates invoices for active students in that class and term:

```txt
Enrollment.classSection = selected class
Enrollment.term = selected term
Enrollment.status = ACTIVE
```

For each matching student, the backend creates or updates an invoice:

```txt
Invoice.student → Student
Invoice.term → Term
Invoice.classSection → ClassSection
Invoice.amount
Invoice.dueDate
Invoice.allowInstallments
Invoice.minimumInstallmentAmount
Invoice.status
```

Invoices are unique per student and term, so the same child should not receive duplicate invoices for the same term. If a fee schedule is published again, unpaid invoices can be updated with the new amount, due date, and installment settings. Paid invoices are left alone for accounting safety.

Payments are stored against invoices:

```txt
Payment.invoice → Invoice
Payment.amount
Payment.paystackReference
Payment.paidAt
Payment.channel
Payment.paymentMethod
Payment.depositorName
Payment.notes
Payment.verificationStatus
```

Student, parent, and admin dashboards calculate outstanding balances from:

```txt
invoice amount - recorded payments
```

If no invoice exists yet, the UI shows that no bill has been assigned. It should not show "Paid in full" unless an actual invoice exists and its balance is zero.

Admin finance overview shows:

- total collected from actual payment records
- outstanding balances
- overdue balances
- invoice records with student, class, term, amount, paid amount, balance, due date, and status
- session by session totals for billed fees, collected fees, outstanding balances, overdue balances, invoices, and collection rate
- illustrative dashboard figures for quick visual comparison across sessions

Parents can:

- select a linked child
- view that child's invoices
- see total, paid amount, balance, due date, and term/session
- choose full payment
- choose installment payment only when the invoice allows installments
- view payment history
- download PDF receipts for recorded payments

Manual payments are supported for Nigerian school operations where parents may pay by bank transfer, cash at the bursary, POS, cheque, or another offline method. Admin or bursary staff can record a verified manual payment from Finance → Student invoices by entering:

- payment method
- payment reference, teller number, or transaction reference
- depositor name
- amount
- notes

Admin-recorded manual payments are marked as verified immediately, so they reduce the invoice balance and count as collected fees as soon as they are saved.

Gateway payment collection is intentionally left for the final payment integration phase. The parent payment endpoint currently validates invoice ownership, balance, full payment, and installment rules, then returns a clear "payment gateway not configured" response. The final integration should connect that validated request to Paystack, Flutterwave, Stripe, or the chosen provider, then create `Payment` records after successful verification/webhook confirmation.

Later, when file storage is configured, parent-submitted manual payment proof can be added. That flow should let parents submit bank transfer details and upload proof, then let admin/bursary verify or reject it. Use managed storage such as Cloudinary, S3/R2, Vercel Blob, Firebase Storage, or another object storage provider before enabling proof uploads in production.

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
- Added search and pagination for scalable admin lists including classes, fee schedules, invoices, news, assignments, and timetable entries.
- Added protected admin global search in the topbar for students, staff, parents/guardians, classes, invoices, announcements, and news.
- Fixed admin student action dropdown clipping by rendering the menu above table overflow.
- Refactored admin navigation into major sidebar modules with internal tab/grid navigation to reduce sidebar crowding.

## Scale notes

The app is being prepared for schools with thousands of students:

- Admin students list uses pagination.
- Admin staff list uses pagination.
- Admin classes list uses search, level filtering, and pagination.
- Admin announcements use server side pagination.
- Admin news uses server side search, status filtering, and pagination.
- Admin fee schedules use search, filters, and pagination.
- Admin invoices use server side pagination, student/class search, and status filtering.
- Admin assignments and timetable pages use search and pagination, with limited class dropdowns to avoid huge select menus.
- The admin topbar global search returns a capped result set instead of loading every matching record.
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

## Remaining major phase

Payments integration is the main planned final phase. Current payment-related pages show stored fee/payment data, but gateway collection and reconciliation should be added last.
