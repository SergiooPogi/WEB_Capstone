# 📊 EMC CAPSTONE SYSTEM - WORKFLOW DIAGRAMS

---

## 1️⃣ OVERALL SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMC CAPSTONE SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  ADMISSION       │  │  ENROLLMENT      │  │  SMART       │ │
│  │  MODULE          │  │  MODULE          │  │  FEATURES    │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ • Document       │  │ • JHS            │  │ • RAG        │ │
│  │   Upload         │  │ • SHS            │  │   Chatbot    │ │
│  │ • Verification   │  │ • College        │  │ • Virtual    │ │
│  │ • Approval       │  │ • Subject        │  │   Tour       │ │
│  │ • SSC Screening  │  │   Selection      │  │              │ │
│  │                  │  │ • Sectioning     │  │              │ │
│  │                  │  │ • Payment Track  │  │              │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ USER ROLES & PERMISSIONS

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER ROLES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STUDENT/APPLICANT              REGISTRAR/STAFF                │
│  ├─ Register                     ├─ Verify Documents           │
│  ├─ Login                        ├─ Approve Admission          │
│  ├─ Apply                        ├─ Manage Subjects            │
│  ├─ Upload Documents             ├─ Manage Sections            │
│  ├─ Enroll                       ├─ View All Enrollments       │
│  ├─ View Own Enrollment          ├─ Generate Reports           │
│  ├─ Select Subjects              └─ Assign Schedules           │
│  ├─ Access Chatbot                                             │
│  ├─ Virtual Tour                  ADMIN                        │
│  └─ View Dashboard               ├─ Manage Programs            │
│                                  ├─ Configure Rules            │
│                                  ├─ Approve Enrollments        │
│                                  ├─ View Analytics             │
│                                  ├─ Manage Users               │
│                                  └─ System Configuration       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ JUNIOR HIGH SCHOOL (JHS) WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              JHS ENROLLMENT WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START                                                          │
│    │                                                            │
│    ├─→ Fill JHS Application Form                              │
│    │   ├─ Grade Level (7-12)                                  │
│    │   ├─ Strand (STEM, ABM, HUMSS)                           │
│    │   └─ Upload Grade 6 Report                               │
│    │                                                            │
│    ├─→ SSC Screening (if Grade 7 + SSC Applied)              │
│    │   │                                                       │
│    │   ├─→ Check Grade 6 Average                              │
│    │   │   │                                                   │
│    │   │   ├─ Average >= 85? ✅ YES                           │
│    │   │   │  └─→ QUALIFIED                                   │
│    │   │   │      ├─ Status: pending_exam                     │
│    │   │   │      ├─ Schedule Entrance Exam                   │
│    │   │   │      └─ Record Exam Result                       │
│    │   │   │         ├─ Score >= 75? ✅ YES                   │
│    │   │   │         │  └─→ SSC Class Assignment              │
│    │   │   │         └─ Score < 75? ❌ NO                     │
│    │   │   │            └─→ Regular Class Assignment           │
│    │   │   │                                                   │
│    │   │   └─ Average < 85? ❌ NO                             │
│    │   │      └─→ NOT QUALIFIED                               │
│    │   │         └─ Regular Class Assignment                   │
│    │   │                                                       │
│    │   └─→ Status: submitted                                   │
│    │                                                            │
│    ├─→ Registrar Verification                                 │
│    │   └─ Approve/Reject                                      │
│    │                                                            │
│    ├─→ Admin Approval                                         │
│    │   └─ Status: approved                                    │
│    │                                                            │
│    ├─→ Enrollment Proper                                      │
│    │   ├─ Select Section (SSC or Regular)                     │
│    │   └─ Status: enrolled                                    │
│    │                                                            │
│    └─→ END (Ready for Classes)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ SENIOR HIGH SCHOOL (SHS) WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              SHS ENROLLMENT WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START                                                          │
│    │                                                            │
│    ├─→ Fill SHS Application Form                              │
│    │   ├─ Grade Level (11-12)                                 │
│    │   ├─ Strand Selection (STEM, ABM, HUMSS)                 │
│    │   ├─ Semester (1st, 2nd, Summer)                         │
│    │   └─ Upload Previous Records                             │
│    │                                                            │
│    ├─→ Subject Auto-Load                                      │
│    │   └─ System loads subjects based on strand               │
│    │                                                            │
│    ├─→ Registrar Verification                                 │
│    │   └─ Approve/Reject                                      │
│    │                                                            │
│    ├─→ Admin Approval                                         │
│    │   └─ Status: approved                                    │
│    │                                                            │
│    ├─→ Subject Selection                                      │
│    │   ├─ View available subjects                             │
│    │   ├─ Select subjects                                     │
│    │   └─ Validate prerequisites                              │
│    │                                                            │
│    ├─→ Section Assignment                                     │
│    │   ├─ System assigns sections                             │
│    │   └─ View schedule                                       │
│    │                                                            │
│    ├─→ Enrollment Confirmation                                │
│    │   └─ Status: enrolled                                    │
│    │                                                            │
│    └─→ END (Ready for Classes)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ COLLEGE ENROLLMENT WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│            COLLEGE ENROLLMENT WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START                                                          │
│    │                                                            │
│    ├─→ Select Enrollment Type                                 │
│    │   │                                                       │
│    │   ├─ FIRST-TIME                                          │
│    │   │  ├─ Submit Credentials                               │
│    │   │  ├─ Await Approval                                   │
│    │   │  └─ Status: submitted                                │
│    │   │                                                       │
│    │   ├─ CONTINUING                                          │
│    │   │  ├─ Auto-eligible                                    │
│    │   │  └─ Status: approved                                 │
│    │   │                                                       │
│    │   ├─ RETURNEE                                            │
│    │   │  ├─ Check Previous Records                           │
│    │   │  ├─ Reactivate Account                               │
│    │   │  └─ Status: approved                                 │
│    │   │                                                       │
│    │   └─ TRANSFEREE                                          │
│    │      ├─ Upload TOR                                       │
│    │      ├─ Subject Evaluation (Manual/Admin)                │
│    │      └─ Status: submitted                                │
│    │                                                            │
│    ├─→ Registrar Verification                                 │
│    │   └─ Approve/Reject                                      │
│    │                                                            │
│    ├─→ Admin Approval                                         │
│    │   └─ Status: approved                                    │
│    │                                                            │
│    ├─→ Determine Student Status                               │
│    │   │                                                       │
│    │   ├─ REGULAR                                             │
│    │   │  └─ Follows curriculum exactly                       │
│    │   │                                                       │
│    │   └─ IRREGULAR                                           │
│    │      └─ Manual subject selection                         │
│    │                                                            │
│    ├─→ Subject Selection                                      │
│    │   ├─ View available subjects                             │
│    │   ├─ Select subjects (if irregular)                      │
│    │   ├─ Check prerequisites                                 │
│    │   └─ Compute total units                                 │
│    │                                                            │
│    ├─→ Schedule Assignment                                    │
│    │   ├─ System assigns schedule                             │
│    │   ├─ Check for conflicts                                 │
│    │   └─ View final schedule                                 │
│    │                                                            │
│    ├─→ Enrollment Confirmation                                │
│    │   └─ Status: enrolled                                    │
│    │                                                            │
│    └─→ END (Ready for Classes)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6️⃣ COMPLETE END-TO-END SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│           COMPLETE SYSTEM FLOW (END-TO-END)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [USER]                                                         │
│    │                                                            │
│    ├─→ AUTHENTICATION                                          │
│    │   ├─ Register (New User)                                 │
│    │   └─ Login (Existing User)                               │
│    │                                                            │
│    ├─→ SELECT LEVEL                                           │
│    │   ├─ JHS (Grade 7-10)                                    │
│    │   ├─ SHS (Grade 11-12)                                   │
│    │   └─ College (Year 1-4)                                  │
│    │                                                            │
│    ├─→ ADMISSION                                              │
│    │   ├─ Fill Application Form                               │
│    │   ├─ Upload Documents                                    │
│    │   ├─ SSC Screening (if applicable)                       │
│    │   └─ Status: submitted                                   │
│    │                                                            │
│    ├─→ VALIDATION                                             │
│    │   ├─ Registrar Verification                              │
│    │   ├─ Document Review                                     │
│    │   └─ Status: verified                                    │
│    │                                                            │
│    ├─→ APPROVAL                                               │
│    │   ├─ Admin Review                                        │
│    │   ├─ Final Approval                                      │
│    │   └─ Status: approved                                    │
│    │                                                            │
│    ├─→ ENROLLMENT                                             │
│    │   ├─ Select Subjects                                     │
│    │   ├─ Validate Prerequisites                              │
│    │   └─ Status: subjects_enrolled                           │
│    │                                                            │
│    ├─→ SCHEDULING                                             │
│    │   ├─ Assign Sections                                     │
│    │   ├─ Check Conflicts                                     │
│    │   └─ Status: enrolled                                    │
│    │                                                            │
│    ├─→ CONFIRMATION                                           │
│    │   ├─ Review Schedule                                     │
│    │   ├─ Confirm Enrollment                                  │
│    │   └─ Status: active                                      │
│    │                                                            │
│    ├─→ STUDENT DASHBOARD                                      │
│    │   ├─ View Enrollment Status                              │
│    │   ├─ View Schedule                                       │
│    │   ├─ View Subjects                                       │
│    │   ├─ Access Chatbot                                      │
│    │   └─ Virtual Tour                                        │
│    │                                                            │
│    └─→ END                                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7️⃣ DATABASE RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE SCHEMA RELATIONSHIPS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  users (1) ──────────────┐                                     │
│    │                     │                                     │
│    ├─ (1:N) enrollment_records                                │
│    │         │                                                 │
│    │         ├─ (1:N) enrollment_subjects                     │
│    │         │         │                                       │
│    │         │         ├─ (N:1) subjects                      │
│    │         │         │         │                             │
│    │         │         │         └─ (N:1) programs            │
│    │         │         │                                       │
│    │         │         └─ (N:1) sections                      │
│    │         │                 │                               │
│    │         │                 └─ (N:1) school_years          │
│    │         │                                                 │
│    │         └─ (N:1) admissions                              │
│    │                                                            │
│    └─ (1:N) chat_logs                                         │
│                                                                 │
│  programs (1) ──────────────┐                                 │
│    │                        │                                 │
│    └─ (1:N) subjects        │                                 │
│                             │                                 │
│  school_years (1) ──────────┤                                 │
│    │                        │                                 │
│    └─ (1:N) sections        │                                 │
│                             │                                 │
│  buildings (1) ─────────────┤                                 │
│    │                        │                                 │
│    └─ (1:N) 360° photos     │                                 │
│                             │                                 │
│  faqs (1) ──────────────────┘                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8️⃣ ENROLLMENT STATUS FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│            ENROLLMENT STATUS PROGRESSION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  draft                                                          │
│    │ (Student submits)                                         │
│    ↓                                                            │
│  submitted                                                      │
│    │ (Registrar verifies)                                      │
│    ├─→ pending_exam (JHS Grade 7 SSC only)                    │
│    │   │ (Admin records exam result)                           │
│    │   ↓                                                        │
│    │ submitted (if failed SSC)                                 │
│    │   │                                                       │
│    │   ↓                                                       │
│    ├─→ approved (Admin approves)                              │
│    │   │                                                       │
│    │   ↓                                                       │
│    ├─→ subjects_enrolled (Student selects subjects)           │
│    │   │                                                       │
│    │   ↓                                                       │
│    ├─→ enrolled (Sections assigned)                           │
│    │   │                                                       │
│    │   ↓                                                       │
│    ├─→ active (Classes started)                               │
│    │   │                                                       │
│    │   ↓                                                       │
│    └─→ completed (Semester/Year finished)                     │
│                                                                 │
│  rejected (Admin rejects)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9️⃣ SSC LOGIC FLOWCHART

```
┌─────────────────────────────────────────────────────────────────┐
│         SPECIAL SCIENCE CLASS (SSC) LOGIC                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START                                                          │
│    │                                                            │
│    ├─→ Is JHS Grade 7? ──────────────────────────────────────┐ │
│    │   │                                                    │ │
│    │   ├─ YES                                              │ │
│    │   │  │                                                │ │
│    │   │  ├─→ SSC Applied? ────────────────────────────┐  │ │
│    │   │  │   │                                        │  │ │
│    │   │  │   ├─ YES                                   │  │ │
│    │   │  │   │  │                                     │  │ │
│    │   │  │   │  ├─→ Grade 6 Average >= 85? ────────┐ │  │ │
│    │   │  │   │  │   │                              │ │  │ │
│    │   │  │   │  │   ├─ YES                         │ │  │ │
│    │   │  │   │  │   │  │                           │ │  │ │
│    │   │  │   │  │   │  ├─→ sscQualified = true    │ │  │ │
│    │   │  │   │  │   │  ├─→ Status = pending_exam  │ │  │ │
│    │   │  │   │  │   │  ├─→ Schedule Exam          │ │  │ │
│    │   │  │   │  │   │  └─→ Wait for Result        │ │  │ │
│    │   │  │   │  │   │                              │ │  │ │
│    │   │  │   │  │   └─ NO                          │ │  │ │
│    │   │  │   │  │      │                           │ │  │ │
│    │   │  │   │  │      ├─→ sscQualified = false   │ │  │ │
│    │   │  │   │  │      ├─→ sscClass = Regular     │ │  │ │
│    │   │  │   │  │      └─→ Status = submitted     │ │  │ │
│    │   │  │   │  │                                  │ │  │ │
│    │   │  │   │  └──────────────────────────────────┘ │  │ │
│    │   │  │   │                                        │  │ │
│    │   │  │   └─ NO                                    │  │ │
│    │   │  │      │                                     │  │ │
│    │   │  │      └─→ Status = submitted               │  │ │
│    │   │  │                                            │  │ │
│    │   │  └─→ Exam Result Recording                   │  │ │
│    │   │      │                                        │  │ │
│    │   │      ├─→ Score >= 75? ──────────────────┐   │  │ │
│    │   │      │   │                              │   │  │ │
│    │   │      │   ├─ YES                         │   │  │ │
│    │   │      │   │  ├─→ sscResult = passed     │   │  │ │
│    │   │      │   │  ├─→ sscClass = SSC         │   │  │ │
│    │   │      │   │  └─→ Status = submitted     │   │  │ │
│    │   │      │   │                              │   │  │ │
│    │   │      │   └─ NO                          │   │  │ │
│    │   │      │      ├─→ sscResult = failed      │   │  │ │
│    │   │      │      ├─→ sscClass = Regular      │   │  │ │
│    │   │      │      └─→ Status = submitted      │   │  │ │
│    │   │      │                                  │   │  │ │
│    │   │      └──────────────────────────────────┘   │  │ │
│    │   │                                              │  │ │
│    │   └─ NO                                          │  │ │
│    │      └─→ Normal enrollment flow                 │  │ │
│    │                                                  │  │ │
│    └──────────────────────────────────────────────────┘  │ │
│                                                           │ │
│  END                                                      │ │
│                                                           │ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔟 ADMIN APPROVAL WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│            ADMIN APPROVAL WORKFLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Enrollment Submitted                                           │
│    │                                                            │
│    ├─→ Admin Views Enrollment                                  │
│    │   ├─ Student Details                                      │
│    │   ├─ Documents                                            │
│    │   ├─ Enrollment Info                                      │
│    │   └─ SSC Status (if applicable)                           │
│    │                                                            │
│    ├─→ Admin Decision                                          │
│    │   │                                                       │
│    │   ├─ APPROVE                                              │
│    │   │  ├─ Add Comments (optional)                           │
│    │   │  ├─ Status → approved                                 │
│    │   │  ├─ approved_by = admin_id                            │
│    │   │  ├─ approved_at = timestamp                           │
│    │   │  └─ Send Notification to Student                      │
│    │   │                                                       │
│    │   └─ REJECT                                               │
│    │      ├─ Add Comments (required)                           │
│    │      ├─ Status → rejected                                 │
│    │      ├─ approved_by = admin_id                            │
│    │      ├─ approved_at = timestamp                           │
│    │      └─ Send Notification to Student                      │
│    │                                                            │
│    └─→ Enrollment Updated                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 SYSTEM STATISTICS DASHBOARD

```
┌─────────────────────────────────────────────────────────────────┐
│         ADMIN STATISTICS DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Total Enrollments: 150                                         │
│  ├─ Draft: 5                                                   │
│  ├─ Submitted: 25                                              │
│  ├─ Pending Exam: 10 (SSC)                                     │
│  ├─ Approved: 80                                               │
│  ├─ Enrolled: 25                                               │
│  ├─ Active: 5                                                  │
│  └─ Rejected: 0                                                │
│                                                                 │
│  By Course:                                                    │
│  ├─ BSIS: 45                                                   │
│  ├─ BSBA: 35                                                   │
│  ├─ BSED: 40                                                   │
│  ├─ BEED: 20                                                   │
│  └─ BSCrim: 10                                                 │
│                                                                 │
│  By Level:                                                     │
│  ├─ JHS: 50                                                    │
│  ├─ SHS: 40                                                    │
│  └─ College: 60                                                │
│                                                                 │
│  SSC Statistics:                                               │
│  ├─ Applied: 15                                                │
│  ├─ Qualified: 12                                              │
│  ├─ Passed Exam: 10                                            │
│  └─ Failed Exam: 2                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY WORKFLOW POINTS

### ✅ Implemented & Working
1. ✅ Multi-level enrollment (JHS, SHS, College)
2. ✅ SSC qualification and exam logic
3. ✅ Role-based access control
4. ✅ Admin approval workflow
5. ✅ Status progression
6. ✅ Document upload capability
7. ✅ Subject selection
8. ✅ Section assignment

### 🔧 Ready for Enhancement
1. 🔧 Student dashboard
2. 🔧 RAG chatbot
3. 🔧 Virtual tour UI
4. 🔧 Analytics dashboard
5. 🔧 Prerequisite validation
6. 🔧 Payment tracking
7. 🔧 Email notifications
8. 🔧 Schedule conflict detection

---

**Status**: ✅ WORKFLOW DIAGRAMS COMPLETE  
**Ready for**: Defense Presentation & Frontend Testing
