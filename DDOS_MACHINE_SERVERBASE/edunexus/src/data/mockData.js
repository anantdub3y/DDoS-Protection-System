export const student = {
  name: "Apoorva Shukla",
  rollNo: "2200123CS",
  branch: "Computer Science & Engineering",
  semester: "4th Semester",
  year: "2nd Year",
  section: "B",
  cgpa: 8.5,
  attendance: 82,
  avatar: "AS",
  college: "EduNexus Institute of Technology",
  email: "apoorva.2200123@edunexus.ac.in",
  phone: "+91 98765 43210",
  dob: "12 Aug 2004",
  address: "Kanpur, Uttar Pradesh",
  enrollmentYear: 2022,
};

export const subjects = [
  { code: "CS401", name: "Data Structures & Algorithms", credits: 4, faculty: "Dr. Meera Joshi", attendance: 88 },
  { code: "CS402", name: "Operating Systems", credits: 4, faculty: "Prof. Rakesh Verma", attendance: 75 },
  { code: "CS403", name: "Database Management Systems", credits: 3, faculty: "Dr. Sunita Yadav", attendance: 91 },
  { code: "CS404", name: "Computer Networks", credits: 3, faculty: "Dr. Anil Kumar", attendance: 79 },
  { code: "CS405", name: "Theory of Computation", credits: 4, faculty: "Prof. Priya Sharma", attendance: 85 },
  { code: "MA401", name: "Probability & Statistics", credits: 3, faculty: "Dr. Vivek Tripathi", attendance: 72 },
];

export const timetable = {
  Monday:    ["DSA", "OS", "—", "DBMS", "Networks", "ToC"],
  Tuesday:   ["OS", "—", "Stats", "DSA", "—", "DBMS"],
  Wednesday: ["Networks", "ToC", "—", "OS", "DSA", "—"],
  Thursday:  ["DBMS", "Stats", "DSA", "—", "Networks", "ToC"],
  Friday:    ["ToC", "DSA", "—", "Stats", "OS", "DBMS"],
  Saturday:  ["—", "Networks", "Stats", "—", "—", "—"],
};

export const timeSlots = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00"];

export const results = [
  {
    semester: "Semester 3",
    sgpa: 8.6,
    subjects: [
      { code: "CS301", name: "Discrete Mathematics", internal: 28, external: 62, total: 90, grade: "A+" },
      { code: "CS302", name: "Object Oriented Programming", internal: 25, external: 58, total: 83, grade: "A" },
      { code: "CS303", name: "Digital Electronics", internal: 22, external: 55, total: 77, grade: "B+" },
      { code: "CS304", name: "Computer Architecture", internal: 24, external: 60, total: 84, grade: "A" },
      { code: "MA301", name: "Linear Algebra", internal: 27, external: 63, total: 90, grade: "A+" },
    ]
  },
  {
    semester: "Semester 2",
    sgpa: 8.3,
    subjects: [
      { code: "CS201", name: "Programming in C++", internal: 26, external: 60, total: 86, grade: "A" },
      { code: "CS202", name: "Data Communication", internal: 23, external: 54, total: 77, grade: "B+" },
      { code: "MA201", name: "Calculus & Differential Equations", internal: 21, external: 52, total: 73, grade: "B" },
      { code: "PH201", name: "Engineering Physics", internal: 24, external: 56, total: 80, grade: "A" },
    ]
  },
  {
    semester: "Semester 1",
    sgpa: 8.4,
    subjects: [
      { code: "CS101", name: "Fundamentals of Programming", internal: 27, external: 62, total: 89, grade: "A" },
      { code: "MA101", name: "Engineering Mathematics-I", internal: 25, external: 58, total: 83, grade: "A" },
      { code: "ME101", name: "Engineering Mechanics", internal: 20, external: 50, total: 70, grade: "B" },
      { code: "EN101", name: "Technical Communication", internal: 28, external: 63, total: 91, grade: "A+" },
    ]
  }
];

export const announcements = [
  { id: 1, title: "Mid-Semester Examination Schedule Released", date: "28 Mar 2026", category: "Exam", urgent: true, body: "Mid-semester exams for all 4th semester students will commence from 10th April 2026. Detailed schedule available on the portal." },
  { id: 2, title: "Industrial Visit — ISRO Lucknow Campus", date: "25 Mar 2026", category: "Event", urgent: false, body: "CSE & ECE students are invited for an industrial visit to ISRO Lucknow on 5th April. Register before 1st April." },
  { id: 3, title: "Hackathon Registration Open — HackNexus 2026", date: "22 Mar 2026", category: "Event", urgent: true, body: "Annual intra-college hackathon HackNexus 2026 registrations are open. Form teams of 2-4. Last date: 31st March." },
  { id: 4, title: "Library Due Date Reminder", date: "20 Mar 2026", category: "Admin", urgent: false, body: "All issued books must be returned by 5th April to avoid fine. Check your issued books in the library portal." },
  { id: 5, title: "Guest Lecture — AI in Healthcare", date: "18 Mar 2026", category: "Academic", urgent: false, body: "Dr. Ramesh Iyer from AIIMS Delhi will deliver a guest lecture on AI applications in healthcare on 2nd April, 2 PM, Seminar Hall." },
  { id: 6, title: "Scholarship Form Submission Deadline", date: "15 Mar 2026", category: "Admin", urgent: true, body: "Students applying for state merit scholarship must submit physical forms to admin office by 8th April." },
];

export const fees = {
  paid: [
    { description: "Tuition Fee — Semester 3", amount: 45000, date: "10 Jul 2025", receipt: "RC-2025-0034" },
    { description: "Hostel Fee — Sem 3", amount: 18000, date: "10 Jul 2025", receipt: "RC-2025-0035" },
    { description: "Tuition Fee — Semester 4", amount: 45000, date: "5 Jan 2026", receipt: "RC-2026-0018" },
  ],
  pending: [
    { description: "Hostel Fee — Semester 4", amount: 18000, dueDate: "15 Apr 2026" },
    { description: "Exam Fee — Semester 4", amount: 2500, dueDate: "20 Apr 2026" },
  ],
};
