/*
  seed-faqs-hs.js
  Seeds JHS and SHS specific FAQs into the database.
  Uses findOrCreate so it is safe to run multiple times — no duplicates.
  Run with: node seed-faqs-hs.js
*/

import { FAQ } from "./models/faqModel.js";
import { sequelize } from "./models/db.js";

await sequelize.sync();

console.log("🌱 Seeding JHS / SHS FAQs...");

const hsFaqs = [

  // ─── GENERAL HIGH SCHOOL ───────────────────────────────────────────────────
  {
    question: "Does EMC offer Junior High School?",
    answer: "Yes! Eastern Mindoro College offers Junior High School (JHS) from Grade 7 to Grade 10. We also have a Special Science Class (SSC) track for qualified Grade 7 students.",
    category: "JHS",
    keywords: JSON.stringify(["jhs", "junior high school", "grade 7", "grade 8", "grade 9", "grade 10", "does emc offer", "available"])
  },
  {
    question: "Does EMC offer Senior High School?",
    answer: "Yes! EMC offers Senior High School (SHS) for Grades 11 and 12 with multiple strands:\n• STEM – Science, Technology, Engineering and Mathematics\n• ABM – Accountancy, Business and Management\n• HUMSS – Humanities and Social Sciences\n• TVL – Technical-Vocational-Livelihood\n• Sports Track\n• Arts and Design Track",
    category: "SHS",
    keywords: JSON.stringify(["shs", "senior high school", "grade 11", "grade 12", "strand", "stem", "abm", "humss", "tvl", "available", "does emc offer"])
  },
  {
    question: "What is the difference between JHS and SHS?",
    answer: "Junior High School (JHS) covers Grades 7–10 (ages ~12–16). It follows the K–12 Basic Education curriculum.\n\nSenior High School (SHS) covers Grades 11–12 (ages ~17–18). Students choose a strand (STEM, ABM, HUMSS, TVL, etc.) that aligns with their college course or career path.",
    category: "General",
    keywords: JSON.stringify(["difference", "jhs", "shs", "junior high", "senior high", "grade 7", "grade 11", "k12", "k-12"])
  },
  {
    question: "What are the school hours at EMC?",
    answer: "Regular school hours are:\n• Morning classes: 7:30 AM – 12:00 PM\n• Afternoon classes: 1:00 PM – 5:00 PM\n\nSome sections may have different schedules depending on class load. Schedules are confirmed during enrollment.",
    category: "General",
    keywords: JSON.stringify(["school hours", "class time", "schedule", "what time", "morning", "afternoon", "anong oras"])
  },
  {
    question: "When does the school year start?",
    answer: "The school year typically starts in June. For AY 2025–2026:\n• Enrollment period: May–June 2025\n• Classes begin: June/July 2025\n\nExact dates are announced by the school and posted on the GabAI portal. Check the Registrar's Office for the official school calendar.",
    category: "General",
    keywords: JSON.stringify(["school year", "start", "when", "june", "class start", "pasukan", "simula", "opening"])
  },
  {
    question: "Is there a school uniform?",
    answer: "Yes, EMC has an official school uniform. Details are provided upon enrollment and are available at the Guidance Office. Parents and students are informed during orientation about proper attire, P.E. uniforms, and guidelines.",
    category: "General",
    keywords: JSON.stringify(["uniform", "school uniform", "dress code", "clothes", "damit", "PE uniform"])
  },

  // ─── JHS ADMISSION ─────────────────────────────────────────────────────────
  {
    question: "What are the admission requirements for Grade 7?",
    answer: "Requirements for incoming Grade 7 students:\n• Form 138 / SF9 (Grade 6 Report Card) with school dry seal — original\n• Form 137-E or Permanent Record from Elementary school\n• Certificate of Good Moral Character (CGMC)\n• PSA Birth Certificate (original + photocopy)\n• 2x2 ID Photos (4 pieces)\n• Accomplished enrollment form\n\nFor SSC applicants: Grade 6 General Average must be 85 or higher.",
    category: "JHS",
    keywords: JSON.stringify(["grade 7", "admission", "requirements", "form 138", "sf9", "birth certificate", "good moral", "elementary", "grade 6", "incoming"])
  },
  {
    question: "What are the admission requirements for Grade 8, 9, or 10?",
    answer: "For transferees or continuing students enrolling in Grades 8–10:\n• Form 138 / SF9 from previous school\n• Form 137-A (JHS Permanent Record)\n• Certificate of Good Moral Character\n• PSA Birth Certificate\n• Honorable Dismissal / Transfer Credential (for transferees)\n• 2x2 ID Photos (4 pieces)",
    category: "JHS",
    keywords: JSON.stringify(["grade 8", "grade 9", "grade 10", "transferee", "requirements", "admission", "documents", "transfer"])
  },
  {
    question: "Can I enroll in Grade 7 even if I am from a public school?",
    answer: "Yes! Students from public or private elementary schools are welcome to enroll in Grade 7 at EMC. Just bring your Form 138/SF9 with the school dry seal, Birth Certificate, Good Moral Certificate, and other required documents.",
    category: "JHS",
    keywords: JSON.stringify(["public school", "private school", "grade 7", "elementary", "can i enroll", "pwede ba", "transfer"])
  },

  // ─── SPECIAL SCIENCE CLASS (SSC) ───────────────────────────────────────────
  {
    question: "What is the Special Science Class (SSC)?",
    answer: "The Special Science Class (SSC) is an advanced academic track offered to Grade 7 students at EMC. It features an enriched science and mathematics curriculum.\n\nTo qualify:\n• Your Grade 6 General Average must be 85 or higher\n• You must pass the SSC Entrance Exam scheduled by the Registrar\n\nSSC students are placed in separate sections with a specialized curriculum.",
    category: "SSC",
    keywords: JSON.stringify(["ssc", "special science class", "science class", "what is ssc", "advanced", "grade 7", "qualified"])
  },
  {
    question: "How do I apply for the Special Science Class?",
    answer: "To apply for SSC:\n1. Create or log in to your GabAI account\n2. During enrollment, select Junior High School\n3. Upload your Grade 6 Report Card when prompted\n4. The Registrar will verify your average (must be 85+)\n5. If qualified, the Registrar will schedule your SSC Entrance Exam\n6. Take the exam on the assigned date\n7. If you pass — you are enrolled in SSC; if not — you are enrolled in the Regular class\n\nYou can still complete your enrollment form while waiting for exam results.",
    category: "SSC",
    keywords: JSON.stringify(["apply ssc", "how to apply", "ssc application", "special science", "how", "process", "steps"])
  },
  {
    question: "What is the passing grade for the SSC entrance exam?",
    answer: "The passing score for the SSC entrance exam is set by the Registrar and announced on your scheduled exam date. Typically it follows a standard cut-off score. If you do not pass, you will be automatically enrolled in the Regular JHS class — no need to re-apply.",
    category: "SSC",
    keywords: JSON.stringify(["passing score", "ssc exam", "cut off", "passing grade", "pasa", "bagsak", "score"])
  },
  {
    question: "What if I don't pass the SSC entrance exam?",
    answer: "No worries! If you do not pass the SSC entrance exam, you will simply be enrolled in the Regular Junior High School class. Your enrollment application remains valid and you do not need to reapply. You will follow the standard JHS curriculum.",
    category: "SSC",
    keywords: JSON.stringify(["fail ssc", "hindi pumasa", "bagsak ssc", "not pass", "regular class", "what happens", "don't pass"])
  },
  {
    question: "What is the SSC curriculum like?",
    answer: "The SSC curriculum is an enriched version of the standard JHS curriculum with:\n• Additional hours for Science and Mathematics\n• Research and laboratory work\n• Science-focused electives\n• Preparation for science competitions and fairs\n\nSSC students follow the K–12 core subjects plus specialized Science tracks.",
    category: "SSC",
    keywords: JSON.stringify(["ssc curriculum", "subjects ssc", "science curriculum", "what subjects", "ssc classes"])
  },

  // ─── SHS STRANDS ───────────────────────────────────────────────────────────
  {
    question: "What SHS strands are available at EMC?",
    answer: "EMC offers the following Senior High School strands:\n\n• STEM – Science, Technology, Engineering and Mathematics\n• ABM – Accountancy, Business and Management\n• HUMSS – Humanities and Social Sciences\n• TVL – Technical-Vocational-Livelihood\n• Sports Track\n• Arts and Design Track\n\nEach strand prepares you for specific college courses or career paths.",
    category: "SHS",
    keywords: JSON.stringify(["shs strands", "strands available", "stem", "abm", "humss", "tvl", "sports", "arts", "what strand", "which strand"])
  },
  {
    question: "What is the STEM strand?",
    answer: "STEM (Science, Technology, Engineering and Mathematics) is ideal for students who want to pursue college courses like Engineering, Medicine, Architecture, Computer Science, or pure Sciences.\n\nCore subjects include:\n• Pre-Calculus and Basic Calculus\n• General Biology 1 & 2\n• General Chemistry 1 & 2\n• General Physics 1 & 2\n• Research/Capstone project",
    category: "SHS",
    keywords: JSON.stringify(["stem", "science technology engineering math", "stem strand", "engineering", "medicine", "calculus", "biology", "chemistry", "physics"])
  },
  {
    question: "What is the ABM strand?",
    answer: "ABM (Accountancy, Business and Management) is designed for students aiming for college courses like Accountancy, Business Administration, Marketing, Entrepreneurship, or Economics.\n\nCore subjects include:\n• Business Mathematics\n• Fundamentals of Accountancy, Business and Management 1 & 2\n• Organization and Management\n• Business Finance\n• Applied Economics",
    category: "SHS",
    keywords: JSON.stringify(["abm", "accountancy business management", "abm strand", "business", "accounting", "marketing", "entrepreneur", "economics"])
  },
  {
    question: "What is the HUMSS strand?",
    answer: "HUMSS (Humanities and Social Sciences) is for students interested in college courses like Education, Political Science, Psychology, Journalism, Communication Arts, or Law.\n\nCore subjects include:\n• Creative Nonfiction\n• Philippine Politics and Governance\n• Introduction to World Religions and Belief Systems\n• Community Engagement, Solidarity, and Citizenship\n• Trends, Networks, and Critical Thinking",
    category: "SHS",
    keywords: JSON.stringify(["humss", "humanities social sciences", "humss strand", "education", "political science", "psychology", "journalism", "law", "communication"])
  },
  {
    question: "What is the TVL strand?",
    answer: "TVL (Technical-Vocational-Livelihood) prepares students for skilled work and TESDA certification. It's great for students who want to enter the workforce directly after SHS or take technical/vocational college courses.\n\nSpecializations at EMC may include:\n• Home Economics\n• Industrial Arts\n• Information and Communications Technology (ICT)\n• Agri-Fishery Arts\n\nContact the Registrar to confirm currently available TVL specializations.",
    category: "SHS",
    keywords: JSON.stringify(["tvl", "technical vocational", "tvl strand", "tesda", "ict", "home economics", "industrial arts", "livelihood", "trabaho"])
  },
  {
    question: "Which SHS strand should I take?",
    answer: "The right strand depends on your college and career goals:\n\n• Want to be a doctor, engineer, or scientist? → STEM\n• Want to be in business, accounting, or management? → ABM\n• Want to be a teacher, lawyer, journalist, or in social work? → HUMSS\n• Want to learn a technical skill or go into the workforce? → TVL\n• Passionate about athletics? → Sports Track\n• Into performing or visual arts? → Arts and Design Track\n\nWe recommend speaking with our Guidance Counselor if you are unsure. Their office is on the 2nd Floor of the Admin Building.",
    category: "SHS",
    keywords: JSON.stringify(["which strand", "what strand should i take", "strand choice", "choosing strand", "best strand", "alin strand", "career"])
  },
  {
    question: "What are the SHS admission requirements?",
    answer: "Requirements for incoming Grade 11 (SHS) students:\n• Form 138 / SF9 (Grade 10 Report Card) — original with dry seal\n• Form 137-A (JHS Permanent Record)\n• Certificate of Good Moral Character (CGMC)\n• PSA Birth Certificate (original + photocopy)\n• 2x2 ID Photos (4 pieces)\n• Accomplished enrollment form\n\nFor transferees from another SHS: also submit Honorable Dismissal and Transcript of Records.",
    category: "SHS",
    keywords: JSON.stringify(["shs requirements", "grade 11 requirements", "senior high admission", "documents shs", "form 138 shs", "incoming grade 11"])
  },
  {
    question: "Can a Grade 10 completer from any school enroll in SHS at EMC?",
    answer: "Yes! Any Grade 10 completer from a public or private JHS — including students from EMC itself — may apply for SHS at EMC. Just bring your Grade 10 Form 138, Good Moral Certificate, Birth Certificate, and other required documents.",
    category: "SHS",
    keywords: JSON.stringify(["grade 10 completer", "any school", "public school", "shs admission", "grade 10", "pwede ba", "can i enroll shs"])
  },
  {
    question: "Can I change my SHS strand after enrolling?",
    answer: "Strand changes are possible but must be done early — ideally before or at the start of the school year. To request a strand change:\n1. Visit the Registrar's Office\n2. Submit a formal request (letter or form)\n3. Wait for approval based on slot availability\n\nNote: Changing strands mid-semester is generally not allowed as subjects differ significantly.",
    category: "SHS",
    keywords: JSON.stringify(["change strand", "strand change", "switch strand", "palit strand", "can i change", "transfer strand"])
  },
  {
    question: "What subjects do SHS students take?",
    answer: "All SHS students take Core Subjects (regardless of strand) plus Applied and Specialized subjects depending on their strand.\n\nCore subjects include:\n• Oral Communication & Reading and Writing\n• 21st Century Literature\n• General Mathematics & Statistics and Probability\n• Earth and Life Science\n• Personal Development\n• Understanding Culture, Society and Politics\n• Philippine History\n• Introduction to Philosophy\n• Physical Education and Health\n\nStrand-specific subjects are added on top of these.",
    category: "SHS",
    keywords: JSON.stringify(["shs subjects", "senior high subjects", "core subjects", "what subjects", "curriculum shs", "grade 11 subjects", "grade 12 subjects"])
  },

  // ─── ENROLLMENT PROCESS ────────────────────────────────────────────────────
  {
    question: "How do I enroll online at EMC?",
    answer: "Online enrollment steps:\n1. Go to the GabAI portal (this website)\n2. Click 'Register' and create your account\n3. Verify your email using the OTP sent to you\n4. Log in and click 'Enroll Now'\n5. Select your level: JHS or SHS\n6. Fill in the enrollment form (personal info, family, education background)\n7. Upload your documents (Form 138, Birth Certificate, etc.)\n8. Submit — the Registrar will review your application\n9. You will receive email updates on your application status",
    category: "Enrollment",
    keywords: JSON.stringify(["how to enroll", "online enrollment", "steps", "process", "paano mag-enroll", "enrollment procedure", "guide", "portal"])
  },
  {
    question: "Can I enroll in person?",
    answer: "Yes, you can also enroll in person at the Registrar's Office (Ground Floor, Administration Building). Office hours are Monday–Friday, 8:00 AM – 5:00 PM. Bring all original documents and photocopies.",
    category: "Enrollment",
    keywords: JSON.stringify(["enroll in person", "walk in", "personally", "office", "bring documents", "personal enrollment"])
  },
  {
    question: "What is a New student vs. Old student?",
    answer: "• New student: Someone enrolling at EMC for the first time at this level (e.g., incoming Grade 7 or Grade 11).\n• Old / Continuing student: A student who was already enrolled at EMC and is moving to the next grade level within the same school.\n• Transferee: A student coming from a different school.",
    category: "Enrollment",
    keywords: JSON.stringify(["new student", "old student", "continuing", "returning", "transferee", "difference", "type", "enrollment type"])
  },
  {
    question: "How long does enrollment take?",
    answer: "Online enrollment is fast:\n• Filling out the form: 15–30 minutes\n• Document review by Registrar: 1–3 working days\n• Admin approval: 1–2 working days\n• Section and subject assignment: automatic after approval\n\nTotal: usually 3–5 working days from submission to full enrollment.",
    category: "Enrollment",
    keywords: JSON.stringify(["how long", "duration", "gaano katagal", "processing time", "enrollment time", "how many days"])
  },
  {
    question: "What does my enrollment status mean?",
    answer: "Here are the enrollment status meanings:\n• Submitted – Your form was sent; waiting for Registrar review\n• Pending Exam – You applied for SSC; exam is being scheduled\n• Verified – Registrar checked documents; waiting for Admin approval\n• Returned – Something needs correction; log in and fix it\n• Approved – Admin approved; section being assigned\n• Enrolled – Fully enrolled; section and subjects are loaded\n• Rejected – Application was not approved; a reason will be given\n• Completed – School year finished",
    category: "Enrollment",
    keywords: JSON.stringify(["enrollment status", "status meaning", "submitted", "pending", "approved", "enrolled", "verified", "returned", "rejected", "ano ibig sabihin"])
  },
  {
    question: "I received 'Returned' status — what do I do?",
    answer: "A 'Returned' status means the Registrar found an issue with your documents or form. Here's what to do:\n1. Log in to your GabAI account\n2. Go to 'My Enrollments'\n3. Click 'Fix and Resubmit'\n4. Read the reason for return\n5. Correct the issue (update info or re-upload documents)\n6. Resubmit\n\nThe Registrar will review again after you resubmit.",
    category: "Enrollment",
    keywords: JSON.stringify(["returned", "return status", "what to do", "fix", "resubmit", "bakit returned", "correction"])
  },

  // ─── FEES & PAYMENT ────────────────────────────────────────────────────────
  {
    question: "How much is tuition for JHS at EMC?",
    answer: "JHS tuition fees are paid per grading period (4 grading periods per school year). Exact amounts vary per grade level. For the current fee schedule, please contact the Finance/Cashier's Office directly.\n\nContact: (043) 123-4567 | emc_1945@yahoo.com\nOffice: Ground Floor, Administration Building",
    category: "Fees",
    keywords: JSON.stringify(["jhs tuition", "junior high tuition", "grade 7 fee", "grade 8 fee", "how much jhs", "magkano jhs", "bayad jhs"])
  },
  {
    question: "How much is tuition for SHS at EMC?",
    answer: "SHS tuition is charged per semester (2 semesters per school year). Fees differ by strand. For the latest fee schedule, contact the Finance/Cashier's Office.\n\nContact: (043) 123-4567 | emc_1945@yahoo.com\nOffice: Ground Floor, Administration Building",
    category: "Fees",
    keywords: JSON.stringify(["shs tuition", "senior high tuition", "grade 11 fee", "grade 12 fee", "how much shs", "magkano shs", "strand fee"])
  },
  {
    question: "Are there free tuition programs for SHS?",
    answer: "Yes! Under RA 10931 (Universal Access to Quality Tertiary Education Act) and related programs, SHS students may qualify for free tuition through the UNIFAST / CHED Free SHS voucher program.\n\nEMC participates in the SHS Voucher Program. Qualifying students receive a voucher that covers tuition. To apply:\n1. Enroll at EMC\n2. Register for the SHS Voucher at your Registrar's Office\n3. CHED/DepEd will process the voucher",
    category: "Fees",
    keywords: JSON.stringify(["free tuition", "shs voucher", "unifast", "ched", "deped voucher", "tulong", "scholarship", "libre", "shs free"])
  },
  {
    question: "What payment methods are accepted for tuition?",
    answer: "EMC accepts the following payment methods:\n• Cash – at the Cashier's Office\n• GCash – via QR or account number\n• Maya (PayMaya)\n• Bank Transfer – BDO, BPI, Landbank\n• Credit / Debit Card\n\nAlways get an Official Receipt after paying. Present this to the Registrar when needed.",
    category: "Fees",
    keywords: JSON.stringify(["payment", "gcash", "maya", "bank", "how to pay", "cash", "payment method", "paano magbayad"])
  },

  // ─── SCHOLARSHIPS ──────────────────────────────────────────────────────────
  {
    question: "Are there scholarships for JHS students?",
    answer: "EMC offers academic scholarships for JHS students with outstanding grades:\n• 100% tuition discount — Grade average of 95% or higher\n• 50% tuition discount — Grade average of 90–94%\n• 25% tuition discount — Grade average of 85–89%\n\nScholarships are renewed every school year based on performance. Visit the Scholarship Office (Admin Building, 2nd Floor) to apply.",
    category: "Financial Aid",
    keywords: JSON.stringify(["scholarship jhs", "junior high scholarship", "academic scholarship", "tuition discount", "honor", "grade scholarship"])
  },
  {
    question: "Are there scholarships for SHS students?",
    answer: "Yes! SHS students may avail of:\n• SHS Voucher Program (government) — covers tuition for qualifying students\n• EMC Academic Scholarship — for students with 90%+ general average\n• Local Government Unit (LGU) Scholarships — check with your barangay/municipality\n• Private donor scholarships — announced during enrollment period\n\nVisit the Scholarship / Guidance Office for more details.",
    category: "Financial Aid",
    keywords: JSON.stringify(["shs scholarship", "senior high scholarship", "voucher", "lgu scholarship", "financial aid", "scholarship grade 11"])
  },

  // ─── SUBJECTS & CURRICULUM ─────────────────────────────────────────────────
  {
    question: "What subjects are taken in Junior High School?",
    answer: "JHS students (Grades 7–10) follow the K–12 core curriculum:\n• Filipino\n• English\n• Mathematics\n• Science\n• Araling Panlipunan (AP)\n• Edukasyon sa Pagpapakatao (EsP)\n• Technology and Livelihood Education (TLE)\n• MAPEH (Music, Arts, P.E., Health)\n• Computer / ICT (selected grade levels)\n\nSSC students have additional specialized science and math subjects.",
    category: "JHS",
    keywords: JSON.stringify(["jhs subjects", "junior high subjects", "grade 7 subjects", "curriculum jhs", "what subjects jhs", "Filipino", "math", "science"])
  },
  {
    question: "Are Grade 11 and Grade 12 subjects different?",
    answer: "Yes. Both Grade 11 and Grade 12 take the same core subjects (like Oral Communication, General Math, Personal Development) but the specialized track/strand subjects progress from Grade 11 to Grade 12. Grade 12 also includes a Capstone Project or Work Immersion (internship-type subject) depending on the strand.",
    category: "SHS",
    keywords: JSON.stringify(["grade 11 vs grade 12", "difference grade 11 grade 12", "subjects grade 12", "capstone", "work immersion", "shs grade levels"])
  },
  {
    question: "What is Work Immersion in SHS?",
    answer: "Work Immersion is a required SHS subject where Grade 12 students spend 80–320 hours in an actual workplace or community setting related to their strand. It gives students real-world experience before college or employment.\n\nEMC coordinates with partner companies, LGUs, and offices to provide immersion placements for students.",
    category: "SHS",
    keywords: JSON.stringify(["work immersion", "ojt", "internship", "immersion shs", "grade 12 immersion", "practicum", "on the job"])
  },

  // ─── CAMPUS & FACILITIES ───────────────────────────────────────────────────
  {
    question: "Where are JHS and SHS classes held?",
    answer: "JHS and SHS classes are held in the designated classroom buildings on the EMC campus. Specific room assignments are given after enrollment. You can view the campus layout using the Campus Map feature on this portal.",
    category: "Location",
    keywords: JSON.stringify(["where jhs class", "where shs class", "classroom", "building jhs", "building shs", "room", "where"])
  },
  {
    question: "Is there a guidance counselor for high school students?",
    answer: "Yes! EMC has a dedicated Guidance and Counseling Office located on the 2nd Floor of the Administration Building. Counselors are available to help with:\n• Academic concerns\n• Career and strand guidance\n• Personal and emotional support\n• Scholarship assistance\n\nOffice Hours: Monday–Friday, 8:00 AM – 5:00 PM",
    category: "Location",
    keywords: JSON.stringify(["guidance counselor", "counseling", "guidance office", "career advice", "guidance", "problems", "where guidance"])
  },

  // ─── CONTACT ───────────────────────────────────────────────────────────────
  {
    question: "Who do I contact for high school enrollment questions?",
    answer: "For JHS and SHS enrollment concerns, contact the Registrar's Office:\n• Phone: (043) 123-4567\n• Email: emc_1945@yahoo.com\n• Location: Ground Floor, Administration Building\n• Hours: Monday–Friday, 8:00 AM – 5:00 PM\n\nYou can also use this GabAI chat for instant answers!",
    category: "Contact",
    keywords: JSON.stringify(["contact", "who to contact", "high school enrollment", "jhs concern", "shs concern", "registrar", "call", "email"])
  },
  {
    question: "How do I reach the EMC Registrar?",
    answer: "The Registrar's Office can be reached through:\n• Phone: (043) 123-4567\n• Email: emc_1945@yahoo.com\n• In person: Ground Floor, Administration Building, Vicente Ylagan St., Bongabong, Oriental Mindoro\n• Hours: Monday–Friday, 8:00 AM – 5:00 PM",
    category: "Contact",
    keywords: JSON.stringify(["registrar", "contact registrar", "phone number", "email registrar", "how to reach", "makipag-ugnayan"])
  }

];

let created = 0;
let skipped = 0;

for (const faq of hsFaqs) {
  const [, wasCreated] = await FAQ.findOrCreate({
    where: { question: faq.question },
    defaults: faq,
  });
  if (wasCreated) created++;
  else skipped++;
}

console.log(`✅ JHS/SHS FAQs seeded: ${created} created, ${skipped} already existed.`);
await sequelize.close();
