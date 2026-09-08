# Auto Subject & Section Assignment — Feature Plan

## What This Does
Automates subject loading and section assignment for regular students so the registrar only handles exceptions (irregular, transferee, full sections).

---

## Proposed Flow

```
Admin approves enrollment
        ↓
Backend: autoAssignSubjects(enrollmentId)
  - Regular → auto-insert curriculum subjects into enrollment_subjects
  - Irregular / Transferee → skip, student selects manually
        ↓
Backend: autoAssignSection(enrollmentId)
  - Find section matching: course + yearLevel + semester + has space
  - Assign student → status becomes "enrolled"
  - No match found → flag as "needs_manual_section", notify registrar
        ↓
Registrar only sees exceptions in Sections tab
```

---

## Backend Functions to Build

### 1. `autoAssignSubjects(enrollmentId)`
- Triggered when admin sets status to `approved`
- Query subjects where `programCode = enrollment.course` AND `yearLevel = enrollment.curriculumYear` AND `semester = enrollment.semester`
- Bulk insert into `enrollment_subjects`
- Skip if `studentStatus = 'irregular'` or `enrollmentType = 'transferee'`

### 2. `autoAssignSection(enrollmentId)`
- Triggered after subjects are confirmed (status = `subjects_enrolled`)
- For each subject in `enrollment_subjects`:
  - Find section: `course = enrollment.course` AND `yearLevel` matches AND `currentEnrollment < capacity` AND `isActive = 1`
  - Update `enrollment_subjects.sectionId`
  - Increment `sections.currentEnrollment`
- If ALL subjects assigned → set enrollment status to `enrolled`
- If ANY subject has no available section → set status to `needs_manual_section`

---

## Database Changes Needed
- Add `needs_manual_section` to enrollment status enum
- Add `autoAssigned` boolean column to `enrollment_subjects` (to distinguish auto vs manual)

---

## Registrar Sections Tab Changes
- Remove the plain read-only table
- Replace with two views:
  1. **Exceptions** — students with `needs_manual_section` status, registrar manually picks section
  2. **Sections Overview** — current capacity table (keep as reference)

---

## Files to Modify
- `backend/controllers/adminEnrollmentController.js` — call `autoAssignSubjects` inside `approveEnrollment`
- `backend/controllers/subjectSelectionController.js` — call `autoAssignSection` inside `enrollSubjects`
- `backend/controllers/registrarController.js` — add manual section assignment for exceptions
- `frontend/src/pages/RegistrarDashboard.jsx` — update Sections tab to show exceptions
- `backend/models/enrollmentRecordModel.js` — add `needs_manual_section` status

---

## Priority
- Medium — system works without it (manual assignment still possible)
- High value for real school deployment — reduces registrar workload significantly
