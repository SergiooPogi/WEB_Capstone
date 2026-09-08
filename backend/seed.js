/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User } from "./models/userModel.js";
import { FAQ } from "./models/faqModel.js";
import { Building } from "./models/buildingModel.js";
import { sequelize } from "./models/db.js";

await sequelize.sync({ force: true });

console.log("🌱 Seeding database...");

// Create admin user
const adminPassword = await bcrypt.hash("admin123", 10);
await User.create({
  name: "Admin User",
  email: "admin@emc.edu.ph",
  password: adminPassword,
  role: "admin"
});

// Create sample regular user
const userPassword = await bcrypt.hash("user123", 10);
await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: userPassword,
  role: "user"
});

console.log("✅ Users created");

// Seed FAQs
const faqs = [
  // ADMISSION & REQUIREMENTS
  {
    question: "What are the admission requirements?",
    answer: "For admission to Eastern Mindoro College, you'll need: (1) Original Form 138/SF9 with school seal, (2) Certificate of Good Moral Character, (3) PSA Birth Certificate (original + photocopy), (4) 2x2 ID photos (4 pieces), (5) Medical Certificate from licensed physician, and (6) Accomplished admission form. For transferees, additionally provide a Transfer Credential/Honorable Dismissal.",
    category: "Requirements",
    keywords: JSON.stringify(["admission", "requirements", "documents", "form 138", "birth certificate", "good moral", "medical certificate", "transferee"])
  },
  {
    question: "How to get a student ID?",
    answer: "To get your Student ID:\n1. Complete enrollment and pay the ID fee at the Cashier\n2. Bring your official receipt to the Guidance Office (2nd Floor, Admin Building)\n3. Have your photo taken on-site\n4. ID release is within 5–7 working days\n\nBring your Enrollment Assessment Form as proof of enrollment.",
    category: "Requirements",
    keywords: JSON.stringify(["student id", "id card", "how to get", "guidance office", "photo", "cashier"])
  },
  {
    question: "What documents do transferees need?",
    answer: "Transferees need all regular admission requirements PLUS:\n• Transfer Credential / Honorable Dismissal from previous school\n• Transcript of Records (TOR) with official seal\n• Certificate of Units Earned\n• Course Syllabus/Curriculum (for credit evaluation)\n\nSubmit to the Registrar's Office for evaluation. Processing takes 3-5 working days.",
    category: "Requirements",
    keywords: JSON.stringify(["transferee", "transfer", "documents", "tor", "transcript", "honorable dismissal", "credit evaluation"])
  },
  {
    question: "Do I need a medical certificate?",
    answer: "Yes, a Medical Certificate is required for all new students. It must be:\n• Issued by a licensed physician\n• Not older than 3 months\n• Include complete physical examination results\n• State that you are fit to attend school\n\nYou can get this from any licensed doctor or the EMC Health Services clinic.",
    category: "Requirements",
    keywords: JSON.stringify(["medical certificate", "health", "physical exam", "doctor", "clinic", "medical"])
  },
  
  // ENROLLMENT & DEADLINES
  {
    question: "When is the enrollment deadline?",
    answer: "The enrollment period for Academic Year 2025–2026 is as follows:\n• New Students: June 2 – June 20, 2025\n• Returning Students: May 26 – June 13, 2025\n• Transferees: June 2 – June 20, 2025\n\nLate enrollment may be subject to additional fees. Please visit the Registrar's Office for extensions.",
    category: "Deadlines",
    keywords: JSON.stringify(["enrollment", "deadline", "when", "date", "schedule", "period", "late enrollment"])
  },
  {
    question: "How do I submit documents?",
    answer: "You may submit documents in two ways:\n\n1. In-Person: Bring original documents and photocopies to the Registrar's Office (Admin Building, Ground Floor) during office hours (Mon–Fri, 8AM–5PM).\n\n2. Online Pre-submission: Upload scanned copies via the EMC Student Portal at portal.emc.edu.ph. Physical originals must still be presented during actual enrollment.",
    category: "Enrollment",
    keywords: JSON.stringify(["submit", "documents", "how", "upload", "registrar", "online", "portal", "in-person"])
  },
  {
    question: "What is the enrollment process?",
    answer: "The enrollment process has 6 steps:\n1. Gather required documents\n2. Fill out admission form\n3. Submit documents & undergo interview\n4. Take entrance examination\n5. Pay enrollment fees\n6. Get your student ID\n\nUse our Enrollment Guide page for detailed step-by-step instructions!",
    category: "Enrollment",
    keywords: JSON.stringify(["enrollment process", "steps", "how to enroll", "procedure", "guide"])
  },
  {
    question: "Can I enroll late?",
    answer: "Late enrollment is allowed but subject to:\n• Additional late enrollment fee of ₱500\n• Availability of slots in your chosen program\n• Approval from the Dean's Office\n• Maximum of 2 weeks after regular enrollment period\n\nContact the Registrar's Office immediately if you need late enrollment.",
    category: "Enrollment",
    keywords: JSON.stringify(["late enrollment", "late", "deadline passed", "enroll late", "after deadline"])
  },
  {
    question: "How long does enrollment take?",
    answer: "The complete enrollment process typically takes:\n• Document submission & interview: 1-2 hours\n• Entrance exam: 2-3 hours\n• Payment processing: 30 minutes - 1 hour\n• ID processing: 5-7 working days\n\nTotal time from start to finish: approximately 1-2 weeks. Start early to avoid rush!",
    category: "Enrollment",
    keywords: JSON.stringify(["how long", "duration", "time", "enrollment time", "processing time"])
  },
  
  // PROGRAMS & COURSES
  {
    question: "What courses are available?",
    answer: "Eastern Mindoro College offers programs across several departments:\n\n• College of Education (BSEd, BEEd)\n• College of Business (BSA, BSBA)\n• College of Engineering & Technology\n• College of Arts & Sciences\n• College of Nursing\n• Technical-Vocational Programs\n\nVisit the Campus Map page to locate each department building!",
    category: "Programs",
    keywords: JSON.stringify(["courses", "programs", "available", "degree", "bsed", "beed", "bsa", "bsba", "engineering", "nursing", "education", "business"])
  },
  {
    question: "What is BSEd?",
    answer: "Bachelor of Secondary Education (BSEd) is a 4-year teacher education program. Specializations available:\n• English\n• Mathematics\n• Science\n• Filipino\n• Social Studies\n\nGraduates can take the Licensure Examination for Teachers (LET) and teach in high schools.",
    category: "Programs",
    keywords: JSON.stringify(["bsed", "secondary education", "teacher", "education", "teaching", "let"])
  },
  {
    question: "What is BEEd?",
    answer: "Bachelor of Elementary Education (BEEd) is a 4-year program preparing teachers for elementary level (Grades 1-6). Covers:\n• Child development\n• Teaching methodologies\n• Curriculum development\n• Classroom management\n\nGraduates can take the LET and teach in elementary schools.",
    category: "Programs",
    keywords: JSON.stringify(["beed", "elementary education", "teacher", "grade school", "teaching"])
  },
  {
    question: "What is BSA?",
    answer: "Bachelor of Science in Accountancy (BSA) is a 4-year program covering:\n• Financial accounting\n• Auditing\n• Taxation\n• Management accounting\n• Business law\n\nGraduates can take the CPA Board Exam and work as Certified Public Accountants.",
    category: "Programs",
    keywords: JSON.stringify(["bsa", "accountancy", "accounting", "cpa", "business", "finance"])
  },
  {
    question: "What is BSBA?",
    answer: "Bachelor of Science in Business Administration (BSBA) offers specializations in:\n• Marketing Management\n• Financial Management\n• Human Resource Management\n• Operations Management\n\n4-year program preparing students for business careers and entrepreneurship.",
    category: "Programs",
    keywords: JSON.stringify(["bsba", "business administration", "management", "marketing", "business"])
  },
  {
    question: "Do you offer online classes?",
    answer: "EMC offers flexible learning modalities:\n• Face-to-face classes (primary mode)\n• Blended learning (combination of online and face-to-face)\n• Online classes for specific subjects\n\nModality depends on the program and current health protocols. Check with your department for specific arrangements.",
    category: "Programs",
    keywords: JSON.stringify(["online", "classes", "distance learning", "blended", "modality", "virtual"])
  },
  
  // FEES & PAYMENTS
  {
    question: "What are the tuition fees?",
    answer: "Tuition fees vary by program and year level. For Academic Year 2025-2026:\n• College Programs: ₱15,000 - ₱25,000 per semester\n• Technical-Vocational: ₱8,000 - ₱12,000 per semester\n\nFees include tuition, laboratory fees, library fees, and miscellaneous charges. Payment plans are available. Contact the Finance Office for detailed breakdown.",
    category: "Fees",
    keywords: JSON.stringify(["tuition", "fees", "cost", "payment", "how much", "price", "finance"])
  },
  {
    question: "Can I pay tuition in installments?",
    answer: "Yes! EMC offers flexible payment plans:\n• Full payment (with 5% discount)\n• 2-installment plan (50% upon enrollment, 50% midterm)\n• 3-installment plan (40% enrollment, 30% midterm, 30% finals)\n\nNo interest charges. Visit the Cashier's Office to arrange your payment plan.",
    category: "Fees",
    keywords: JSON.stringify(["installment", "payment plan", "pay", "tuition", "flexible payment", "hulugan"])
  },
  {
    question: "What payment methods are accepted?",
    answer: "EMC accepts multiple payment methods:\n• Cash (at Cashier's Office)\n• GCash\n• Maya (PayMaya)\n• Bank Transfer (BDO, BPI, Landbank)\n• Credit/Debit Card\n\nFor online payments, get your reference number from the Cashier and present official receipt upon claiming.",
    category: "Fees",
    keywords: JSON.stringify(["payment", "gcash", "maya", "bank", "cash", "how to pay", "payment method"])
  },
  {
    question: "Are there additional fees?",
    answer: "Yes, aside from tuition, expect these fees:\n• Registration Fee: ₱500\n• ID Fee: ₱200 (one-time)\n• Laboratory Fees: ₱1,000-₱3,000 (depends on program)\n• Library Fee: ₱300\n• Medical/Dental Fee: ₱200\n• Student Activities Fee: ₱500\n• Internet Fee: ₱300\n\nTotal miscellaneous fees: approximately ₱3,000-₱5,000 per semester.",
    category: "Fees",
    keywords: JSON.stringify(["additional fees", "miscellaneous", "other fees", "registration", "laboratory fee"])
  },
  
  // SCHOLARSHIPS & FINANCIAL AID
  {
    question: "Are scholarships available?",
    answer: "Yes! EMC offers various scholarship programs:\n• Academic Scholarships (for honor students)\n• Athletic Scholarships\n• CHED/UNIFAST Scholarships\n• Local Government Scholarships\n• Private Donor Scholarships\n\nVisit the Scholarship Office (Admin Building, 2nd Floor) or check our website for application requirements and deadlines.",
    category: "Financial Aid",
    keywords: JSON.stringify(["scholarship", "financial aid", "grant", "discount", "ched", "unifast", "free tuition"])
  },
  {
    question: "How to apply for UNIFAST scholarship?",
    answer: "To apply for UNIFAST (Universal Access to Quality Tertiary Education):\n1. Enroll in EMC first\n2. Submit UNIFAST application form to Scholarship Office\n3. Provide family income documents\n4. Wait for CHED approval (usually 1-2 months)\n\nUNIFAST covers tuition fees for qualified students. Priority given to low-income families.",
    category: "Financial Aid",
    keywords: JSON.stringify(["unifast", "ched", "free tuition", "scholarship", "how to apply"])
  },
  {
    question: "What is the academic scholarship requirement?",
    answer: "Academic Scholarship requirements:\n• For incoming freshmen: General Average of 90% or higher\n• For continuing students: GPA of 1.75 or higher with no failing grades\n• Must maintain required GPA each semester\n\nScholarship grants:\n• 100% tuition discount (GWA 95% and above)\n• 50% tuition discount (GWA 90-94.99%)\n• 25% tuition discount (GWA 85-89.99%)",
    category: "Financial Aid",
    keywords: JSON.stringify(["academic scholarship", "honor", "grades", "discount", "gwa", "requirements"])
  },
  
  // LOCATIONS & FACILITIES
  {
    question: "Where is the registrar's office?",
    answer: "The Registrar's Office is located at the Ground Floor of the Administration Building (Dr. Angel Francisco Hall). Office Hours: Monday–Friday, 8:00 AM – 5:00 PM. You can use our Campus Map feature to get directions from any point on campus!",
    category: "Location",
    keywords: JSON.stringify(["registrar", "office", "where", "location", "admin building", "ground floor"])
  },
  {
    question: "Where is the library?",
    answer: "The Library & Learning Resource Center is a standalone building near the Administration Building. Features:\n• Main Reading Hall\n• Computer Lab with internet\n• Research & Reference Section\n• Periodicals Section\n• Study rooms\n\nHours: Mon–Fri 7:30 AM – 6:00 PM, Sat 8:00 AM – 12:00 PM. Use the Campus Map for directions!",
    category: "Location",
    keywords: JSON.stringify(["library", "where", "location", "study", "books", "computer lab"])
  },
  {
    question: "Where can I eat on campus?",
    answer: "The Canteen & Cafeteria is located near the center of campus. Offers:\n• Affordable meals (₱50-₱100)\n• Snacks and beverages\n• Faculty dining area\n• Clean and spacious seating\n\nOpen Mon–Sat, 6:30 AM – 6:00 PM. Also has snack stalls around campus.",
    category: "Location",
    keywords: JSON.stringify(["canteen", "cafeteria", "food", "eat", "lunch", "where to eat", "kain"])
  },
  {
    question: "Is there a clinic on campus?",
    answer: "Yes! The Health Services / Medical Clinic is located near the Administration Building. Services:\n• Basic medical consultation\n• First aid treatment\n• Dental services\n• Medical certificates for enrollment\n• Health education\n\nOpen Mon–Fri, 8:00 AM – 5:00 PM. Nurse on duty during school hours.",
    category: "Location",
    keywords: JSON.stringify(["clinic", "medical", "health", "doctor", "nurse", "sick", "first aid"])
  },
  {
    question: "Where is the gym?",
    answer: "The Gymnasium & Sports Complex is located at the western side of campus. Facilities include:\n• Basketball court\n• Volleyball court\n• Badminton court\n• Sports equipment room\n• Locker rooms\n\nOpen Mon–Sat, 6:00 AM – 8:00 PM. Used for PE classes and campus events.",
    category: "Location",
    keywords: JSON.stringify(["gym", "gymnasium", "sports", "basketball", "volleyball", "where", "location"])
  },
  
  // EXAMS & ACADEMICS
  {
    question: "What is the entrance exam coverage?",
    answer: "The Eastern Mindoro College Entrance Exam (EMCEE) covers:\n• English (grammar, reading comprehension, vocabulary)\n• Mathematics (algebra, geometry, word problems)\n• Science (biology, chemistry, physics basics)\n• General Knowledge (current events, Filipino culture)\n\nExam duration: 2-3 hours. Results released within 3-5 working days.",
    category: "Exams",
    keywords: JSON.stringify(["entrance exam", "emcee", "exam", "test", "coverage", "what to study"])
  },
  {
    question: "How to prepare for entrance exam?",
    answer: "Tips to prepare for EMCEE:\n• Review high school lessons (especially Math and English)\n• Practice reading comprehension\n• Study basic science concepts\n• Get enough sleep the night before\n• Arrive 30 minutes early\n• Bring pencils, eraser, sharpener\n• No calculators or electronic devices allowed\n\nDownload our Exam Tips guide from the Enrollment Guide page!",
    category: "Exams",
    keywords: JSON.stringify(["prepare", "entrance exam", "review", "study", "tips", "how to pass"])
  },
  {
    question: "What if I fail the entrance exam?",
    answer: "If you don't pass the entrance exam:\n• You can retake the exam after 1 month\n• Retake fee: ₱300\n• Schedule retake at the Registrar's Office\n• Consider taking a review course\n• Alternative: Apply for Technical-Vocational programs (lower passing score)\n\nDon't worry! Many students pass on their second attempt.",
    category: "Exams",
    keywords: JSON.stringify(["fail", "failed", "entrance exam", "retake", "bagsak", "hindi pumasa"])
  },
  {
    question: "When do classes start?",
    answer: "For Academic Year 2025-2026:\n• First Semester: August 18, 2025\n• Second Semester: January 12, 2026\n• Summer Classes: May 18, 2026\n\nOrientation for freshmen is 1 week before classes start. Check your email for schedule.",
    category: "Academics",
    keywords: JSON.stringify(["classes start", "first day", "when", "school year", "semester", "pasukan"])
  },
  {
    question: "What is the class schedule?",
    answer: "Class schedules vary by program and year level:\n• Morning classes: 7:30 AM - 12:00 PM\n• Afternoon classes: 1:00 PM - 6:00 PM\n• Evening classes: 6:00 PM - 9:00 PM (for working students)\n\nYou'll receive your official schedule during enrollment. Most programs have 5-6 subjects per semester.",
    category: "Academics",
    keywords: JSON.stringify(["schedule", "class schedule", "time", "what time", "classes"])
  },
  
  // CONTACT & SUPPORT
  {
    question: "How to contact EMC?",
    answer: "Contact Eastern Mindoro College:\n• Phone: (043) 123-4567\n• Email: info@emc.edu.ph\n• Registrar: registrar@emc.edu.ph\n• Facebook: facebook.com/EMCofficial\n• Website: www.emc.edu.ph\n\nOffice hours: Monday–Friday, 8:00 AM – 5:00 PM",
    category: "Contact",
    keywords: JSON.stringify(["contact", "phone", "email", "call", "reach", "communicate"])
  },
  {
    question: "Who do I contact for enrollment concerns?",
    answer: "For enrollment concerns, contact:\n• Registrar's Office: registrar@emc.edu.ph or (043) 123-4567\n• Visit: Admin Building, Ground Floor\n• Hours: Mon–Fri, 8:00 AM – 5:00 PM\n\nFor urgent concerns, you can also use our QA Chat for instant assistance!",
    category: "Contact",
    keywords: JSON.stringify(["enrollment concerns", "help", "problem", "question", "who to contact"])
  },
  {
    question: "Is there a student hotline?",
    answer: "Yes! EMC Student Hotline:\n• Phone: (043) 123-4567 local 101\n• Text: 0917-123-4567\n• Available: Mon–Fri, 8:00 AM – 5:00 PM\n\nFor after-hours support, use our 24/7 QA Chatbot on this website!",
    category: "Contact",
    keywords: JSON.stringify(["hotline", "emergency", "help", "support", "24/7"])
  }
];

for (const faq of faqs) {
  await FAQ.create(faq);
}

console.log("✅ FAQs created");

// Seed Buildings
const buildings = [
  {
    name: "Administration Building (Dr. Angel Francisco Hall)",
    shortName: "Admin Hall",
    category: "Administration",
    description: "Main administrative hub of Eastern Mindoro College. Houses the Registrar, Cashier, Guidance, and executive offices.",
    offices: JSON.stringify(["Registrar's Office", "Cashier / Finance", "Guidance & Counseling", "Office of the President", "Student Affairs"]),
    hours: "Mon–Fri: 8:00 AM – 5:00 PM",
    coordinates: JSON.stringify({ x: 50, y: 38 }),
    imageUrl: "/images/admin-building.jpg"
  },
  {
    name: "Library & Learning Resource Center",
    shortName: "Library",
    category: "Academic",
    description: "Multi-floor library with physical and digital collections, study rooms, computer stations, and research databases.",
    offices: JSON.stringify(["Main Reading Hall", "Computer Lab", "Research & Reference", "Periodicals Section"]),
    hours: "Mon–Fri: 7:30 AM – 6:00 PM · Sat: 8:00 AM – 12:00 PM",
    coordinates: JSON.stringify({ x: 72, y: 55 }),
    imageUrl: "/images/library.jpg"
  },
  {
    name: "College of Education Annex",
    shortName: "CEduc",
    category: "Academic",
    description: "Home to the Bachelor of Secondary Education (BSEd) and Bachelor of Elementary Education (BEEd) programs.",
    offices: JSON.stringify(["Dean's Office", "Faculty Rooms", "Demo Teaching Room", "Student Council"]),
    hours: "Mon–Fri: 7:30 AM – 5:00 PM",
    coordinates: JSON.stringify({ x: 22, y: 60 }),
    imageUrl: "/images/education-building.jpg"
  },
  {
    name: "College of Business Annex",
    shortName: "CBusiness",
    category: "Academic",
    description: "Houses BSA, BSBA programs, accounting labs, and business simulation rooms.",
    offices: JSON.stringify(["Dean's Office", "Accounting Lab", "Finance Room", "Business Simulation Lab"]),
    hours: "Mon–Fri: 7:30 AM – 5:00 PM",
    coordinates: JSON.stringify({ x: 35, y: 72 }),
    imageUrl: "/images/business-building.jpg"
  },
  {
    name: "Health Services / Medical Clinic",
    shortName: "Clinic",
    category: "Services",
    description: "Campus medical clinic providing basic health services, first aid, and medical certificates for enrollment.",
    offices: JSON.stringify(["Medical Clinic", "Dental Clinic", "Nurse Station"]),
    hours: "Mon–Fri: 8:00 AM – 5:00 PM",
    coordinates: JSON.stringify({ x: 75, y: 30 }),
    imageUrl: "/images/clinic.jpg"
  },
  {
    name: "Canteen & Cafeteria",
    shortName: "Canteen",
    category: "Services",
    description: "Campus dining area with affordable meals, snacks, and beverages for students and faculty.",
    offices: JSON.stringify(["Main Cafeteria", "Snack Stalls", "Faculty Dining"]),
    hours: "Mon–Sat: 6:30 AM – 6:00 PM",
    coordinates: JSON.stringify({ x: 58, y: 70 }),
    imageUrl: "/images/canteen.jpg"
  },
  {
    name: "Gymnasium & Sports Complex",
    shortName: "Gym",
    category: "Services",
    description: "Multi-purpose gymnasium for sports, physical education classes, and campus events.",
    offices: JSON.stringify(["Sports Office", "Equipment Room", "Locker Rooms"]),
    hours: "Mon–Sat: 6:00 AM – 8:00 PM",
    coordinates: JSON.stringify({ x: 40, y: 25 }),
    imageUrl: "/images/gym.jpg"
  }
];

for (const building of buildings) {
  await Building.create(building);
}

console.log("✅ Buildings created");
console.log("\n🎉 Database seeded successfully!");
console.log("\n📝 Admin credentials:");
console.log("   Email: admin@emc.edu.ph");
console.log("   Password: admin123");
console.log("\n📝 Test user credentials:");
console.log("   Email: john@example.com");
console.log("   Password: user123");

process.exit(0);
