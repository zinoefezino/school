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

- Admin: manages students, staff, parents, classes, academics, announcements, public news, fees, attendance overview, assignments, and timetable.
- Staff: views assigned classes, records attendance for classes they head, enters results, publishes assignments, and manages timetable entries for subjects they teach.
- Student: views profile, classes, attendance, results, assignments, timetable, announcements, messages placeholder, and payment history.
- Parent: views children, attendance, results, fees, and announcements.

Students, parents, staff, and admins can change their own passwords from their dashboard settings/password page.

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

For students, new announcements show a badge count in the sidebar until the student opens the announcements page.

### 13. Public news flow

News is separate from announcements.

```txt
Announcement = private dashboard notice
NewsPost = public homepage/news content
```

Admins publish public news from:

```txt
Dashboard → Admin → News
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

### 15. Fees and payment records

Invoices are stored per student:

```txt
Invoice.student → Student
Invoice.term → Term
Invoice.amount
Invoice.status
```

Payments are stored against invoices:

```txt
Payment.invoice → Invoice
Payment.amount
Payment.paystackReference
Payment.paidAt
```

Student and parent dashboards calculate outstanding balances from:

```txt
invoice amount - recorded payments
```

If no invoice exists yet, the UI shows that no bill has been assigned. It should not show "Paid in full" unless an actual invoice exists and its balance is zero.

Gateway payment collection is intentionally left for the final payment integration phase.

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
