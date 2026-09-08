# GabAI — Post-Defense Improvement Plan
**Eastern Mindoro College Enrollment System**
*Based on panelist feedback + additional recommendations for real-school deployment*

---

## PANELIST SUGGESTIONS (Priority Items)

---

### 1. Remove College — Focus on JHS and SHS Only

**What needs to change:**
- Remove the `College` option from the Level Selection page
- Remove the entire College enrollment form (`EnrollmentForm.jsx` — 7-step form)
- Remove college routes: `/enrollment-form`, `/enrollment-form/:id`
- Remove college-related sections from Section Management (BSIS, BSBA, BEED, BSED, BSCrim)
- Remove college courses from all dropdowns and filters in Admin and Registrar dashboards
- Remove the Subject Selection page (`/subject-selection/:id`) — this is college-only logic
- Clean up the database model: remove `course`, `major`, `curriculumYear`, `semester` fields from enrollment (or just stop exposing them in forms)
- Update the enrollment status workflow to remove `subjects_enrolled` (college-only step)
- Keep: `HSEnrollmentForm.jsx` (handles both JHS and SHS) — this is the one to improve

**Files to touch:**
- `frontend/src/pages/LevelSelection.jsx` — remove College card
- `frontend/src/App.jsx` — remove college routes
- `frontend/src/pages/AdminDashboard.jsx` — remove college filters
- `frontend/src/pages/SectionManagement.jsx` — remove college courses
- `backend/controllers/enrollmentController.js` — remove college validations
- `backend/models/enrollmentRecordModel.js` — mark college fields as unused

---

### 2. SSC Filtration Improvement

**Current state:** SSC is triggered when a student selects JHS → Grade 7 and uploads their Grade 6 Report Card. If `grade6Average >= 85`, status becomes `pending_exam`. Registrar then schedules the exam manually.

**What the panelists want:** Better filtering and management of SSC applicants.

**Proposed improvements:**
- Add a dedicated **SSC Applicants tab** in the Registrar Dashboard — separate from regular enrollments
- Show SSC applicant list with: student name, grade6Average, upload status, exam date, exam score, result
- Allow registrar to set exam date, input exam score, and mark result (passed/failed) — all in one view
- Add a **pass/fail threshold** that admin can configure (currently hardcoded at 75)
- After result is set, automatically route the student:
  - **Passed** → assigned to SSC section
  - **Failed** → moved to regular JHS section
- Show SSC badge clearly on enrolled student records
- Add SSC filter in admin enrollment list (currently it shows a badge but no dedicated filter)
- **Bulk SSC scheduling** (see item 4 below)

---

### 3. UI Improvement

**General issues to fix:**
- The current UI is functional but dense — needs breathing room especially on mobile
- Admin and Registrar dashboards need clearer visual hierarchy

**Specific improvements:**

**Enrollment Form (HSEnrollmentForm.jsx):**
- Add a cleaner progress indicator with step names visible on mobile (currently hidden on small screens)
- Improve the document upload section — show file name, size, and a preview thumbnail for images
- Add better error states — highlight which step has errors from the progress bar itself

**Admin Dashboard:**
- Add a summary stats bar at the top: Total Enrolled / Pending / SSC Applicants / Returned
- Improve the enrollment table — add color-coded status badges that are easier to read
- Add a "Quick Actions" column per row (Approve, Return, Reject buttons visible without opening a modal)

**Registrar Dashboard:**
- Separate the view into tabs: Pending Review / SSC Applicants / Returned / Verified
- Show a notification badge on tabs with pending count

**Student Dashboard / My Enrollments:**
- Show a clear enrollment timeline (Submitted → Verified → Approved → Enrolled)
- Show the current status with an explanation of what it means and what to do next
- Add a notification if documents were returned with remarks

**Level Selection Page:**
- After removing College, make the JHS and SHS cards larger and more prominent
- Add visual distinction between JHS (Grade 7-10) and SHS (Grade 11-12 with strand badges)

---

### 4. Bulk SSC Scheduling

**Current state:** The registrar sets exam date one student at a time.

**What to add:**
- A "Schedule SSC Exam" bulk action in the Registrar SSC tab
- Registrar selects multiple SSC applicants (checkboxes) and sets one exam date for all of them
- System sends notification/email to all selected students with the exam schedule
- After the exam, registrar can bulk-enter scores (table view with input fields per student)
- One-click "Finalize Results" — system automatically assigns SSC or Regular class based on passing score

**Backend needed:**
- `PUT /api/enrollments/ssc/bulk-schedule` — set exam date for multiple IDs
- `PUT /api/enrollments/ssc/bulk-results` — submit scores for multiple IDs at once

---

### 5. Teacher Role — List of Students Per Section

**Current state:** No teacher role exists. Only student, registrar, and admin.

**What to add:**
- Add `teacher` to the user role ENUM in `userModel.js`
- Teacher login shows a simple **Teacher Dashboard** with:
  - List of sections assigned to them
  - Click a section → see the student list for that section
  - Each student row shows: name, LRN, student number, enrollment status
  - Option to export the class list as PDF or CSV
- Admin can assign a teacher to a section (already has `instructor` field in section — just needs to be linked to a user account)
- Teacher cannot approve/reject enrollments — read-only access to their own sections only

**Files to create/modify:**
- `backend/models/userModel.js` — add `teacher` to role ENUM
- `frontend/src/pages/TeacherDashboard.jsx` — new page
- `frontend/src/App.jsx` — add `/teacher` route
- `backend/controllers/sectionController.js` — add `getTeacherSections` endpoint

---

### 6. Student ID Number Field

**Current state:** The HS enrollment form has a `studentNumber` field (6 individual digit boxes joined into a string). It is optional and not validated for format.

**What to add:**
- Make student ID/number a **required field** for returning/old students (studentType = 'Old')
- Add clear format validation — define the school's ID format (e.g., `YYYY-NNNNN` like `2025-00123`) and enforce it
- Show the required format as a placeholder and hint text
- For new students, mark it as "To be assigned" and auto-fill after admin assigns one
- In the admin view, allow admin to assign/edit a student's ID number

---

### 7. Document Submission — Bagsak/Not Bagsak + Format Restriction

**"Bagsak or not bagsak" — Failed vs Passed status on document submission:**

This means the registrar should be able to mark individual submitted documents as:
- ✅ **Accepted** — document is valid and complete
- ❌ **Rejected / Incomplete** — document is missing, unclear, or wrong format

**What to add:**
- In the Registrar review screen, show each uploaded document with an Accept/Reject toggle per document
- If any document is rejected, the registrar can add a note explaining why
- The overall enrollment is returned to the student only if at least one document is rejected
- Student sees which specific documents failed and why, then re-uploads only those

**Format/file restriction improvements (panelist specifically mentioned this):**

Currently files accept PDF, JPG, JPEG, PNG with a 3MB limit. The panelists want stricter control:
- **Per-document format rules** — for example:
  - F-138, F-137-A → PDF only
  - Birth Certificate → PDF or JPG/PNG (scanned)
  - Profile photo (if added) → JPG/PNG only
- Add **client-side enforcement**: if a student tries to upload a PNG to a PDF-only field, show an error immediately
- Add **backend enforcement**: validate MIME type on upload, not just extension
- Show the accepted format clearly beside each upload field (e.g., "PDF only · Max 5MB")
- Consider increasing the 3MB limit for Birth Certificates and TOR to 5MB since those are often higher quality scans

**Backend changes:**
- Update `multer` configuration to validate MIME types per field name
- Add per-document acceptance status to the enrollment record

---

## ADDITIONAL RECOMMENDATIONS (for real-school deployment)

These are beyond the panelist suggestions but important for the system to work in an actual school.

---

### A. School Year / Enrollment Period Control

- Add an **Enrollment Open/Closed toggle** in Admin settings
- When closed, students cannot submit new enrollment forms — they see a message with the next enrollment period dates
- Admin sets the active school year and semester from settings (currently hardcoded in some places as "2025-2026")

---

### B. LRN Validation Against DepEd Format

- LRN must be exactly 12 digits — currently validated only for length
- Add format check: LRN cannot start with 0 (DepEd standard)
- Add a "Verify LRN" feature that flags if the same LRN is used in multiple enrollments across school years

---

### C. Email Notifications That Actually Work

- The email service exists but requires a Gmail app password
- For deployment, switch to a proper transactional email service (Resend, Mailgun, or SendGrid — all have free tiers)
- Make sure these emails are sent:
  - Enrollment submitted confirmation (currently implemented)
  - Document returned — with specific remarks
  - SSC exam schedule notification
  - Final enrollment approval with section assignment
  - Email verification on signup (currently implemented)

---

### D. Proper Environment Configuration for Deployment

- Move all hardcoded `http://localhost:3000` API calls in the frontend to a `VITE_API_URL` environment variable
- Create `frontend/.env` and `frontend/.env.production` files
- Use `import.meta.env.VITE_API_URL` instead of hardcoded localhost URLs
- There are currently **20+ files** with `http://localhost:3000` hardcoded — this must be fixed before deployment

---

### E. Audit Log

- Add a simple log table that records who did what and when:
  - `[Admin] Approved enrollment #45 — Juan Dela Cruz`
  - `[Registrar] Returned enrollment #32 — missing F-138`
  - `[Registrar] Scheduled SSC exam for 5 students — July 20, 2025`
- This is important for accountability in a real school setting
- Show the log in Admin dashboard under a new "Activity" tab

---

### F. Print / PDF Export

- Student should be able to download/print their **Enrollment Form** as a PDF after approval
- Admin should be able to print a **Class List per Section** (PDF format)
- Registrar should be able to print an **SSC Applicant List** with exam scores
- `pdfkit` is already installed in the backend — just needs to be used for these exports

---

### G. Search and Filtering Improvements

- Admin enrollment list currently has basic filters — add:
  - Search by LRN
  - Search by student ID number
  - Filter by grade level (Grade 7, 8, 9, 10, 11, 12)
  - Filter by strand (STEM, ABM, HUMSS, etc.)
  - Filter by school year
- These are essential for a real registrar who handles hundreds of applications

---

## IMPLEMENTATION ORDER (Suggested)

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| 1 | Remove College | Medium | High — scopes the project correctly |
| 2 | Document format restriction | Low | High — panelist-specific request |
| 3 | Student ID field validation | Low | Medium |
| 4 | SSC filtration + dedicated tab | Medium | High |
| 5 | UI improvements | Medium | High — impression on defense |
| 6 | Bulk SSC scheduling | Medium | Medium |
| 7 | Teacher role | High | Medium |
| 8 | Document bagsak/not bagsak | Medium | High |
| 9 | Hardcoded localhost fix | Low | Critical for deployment |
| 10 | Enrollment period control | Low | High for deployment |
| 11 | Email notifications | Low | Medium |
| 12 | Audit log | Medium | Low for defense, high for deployment |
| 13 | PDF export | Medium | Medium |

---

## FILES THAT WILL BE AFFECTED MOST

| File | Changes Needed |
|------|---------------|
| `frontend/src/pages/LevelSelection.jsx` | Remove College card |
| `frontend/src/pages/HSEnrollmentForm.jsx` | UI improvements, document format rules, ID validation |
| `frontend/src/pages/SectionManagement.jsx` | Remove college courses, add teacher assignment |
| `frontend/src/pages/AdminDashboard.jsx` | Remove college filters, add summary stats, audit log |
| `frontend/src/pages/RegistrarDashboard.jsx` | Add SSC tab, document accept/reject per document |
| `frontend/src/App.jsx` | Remove college routes, add teacher route |
| `backend/models/userModel.js` | Add teacher role |
| `backend/models/enrollmentRecordModel.js` | Add document status fields |
| `backend/controllers/enrollmentController.js` | Remove college logic, add bulk SSC endpoints |
| `backend/controllers/sectionController.js` | Add teacher-specific endpoints |
| `frontend/src/**` (20+ files) | Replace hardcoded `localhost:3000` with env variable |

---

*Last updated: July 2026*
*Prepared for: Final Oral Defense — Eastern Mindoro College Capstone*
