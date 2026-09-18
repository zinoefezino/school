export const student = {
  fullName: "Chidera Okafor",
  admissionNumber: "FA-2026-0142",
  classSection: "JSS1 Gold",
  dateOfBirth: new Date("2013-04-12"),
  gender: "female" as "male" | "female",
};

export const term = {
  name: "First Term",
  session: "2026/2027",
};

export const subjects = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Social Studies",
  "Computer Studies",
  "French",
];

export const timetable = [
  {
    day: "Monday",
    slots: [
      { time: "8:00 AM", subject: "Mathematics", room: "Room 4" },
      { time: "9:40 AM", subject: "English Language", room: "Room 4" },
      { time: "11:20 AM", subject: "Basic Science", room: "Lab 1" },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      { time: "8:00 AM", subject: "Social Studies", room: "Room 4" },
      { time: "9:40 AM", subject: "Computer Studies", room: "ICT Lab" },
      { time: "11:20 AM", subject: "French", room: "Room 2" },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      { time: "8:00 AM", subject: "English Language", room: "Room 4" },
      { time: "9:40 AM", subject: "Mathematics", room: "Room 4" },
      { time: "11:20 AM", subject: "Social Studies", room: "Room 4" },
    ],
  },
];

export const assignments = [
  {
    title: "Fractions and decimals",
    subject: "Mathematics",
    due: "Sep 22, 2026",
    status: "Pending",
  },
  {
    title: "Write a formal letter",
    subject: "English Language",
    due: "Sep 24, 2026",
    status: "Pending",
  },
  {
    title: "States of matter",
    subject: "Basic Science",
    due: "Sep 18, 2026",
    status: "Submitted",
  },
];

export const announcements = [
  {
    title: "Mid-term break notice",
    date: "Sep 15, 2026",
    body: "The school will close for mid-term break on Friday, September 25.",
  },
  {
    title: "Inter-house sports day",
    date: "Sep 2, 2026",
    body: "Students should report to their house captains for sports day preparations.",
  },
];

export function getAge(dateOfBirth: Date) {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const birthdayPassed =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() >= dateOfBirth.getDate());
  if (!birthdayPassed) age -= 1;
  return age;
}

export function getStudentAvatar(gender: "male" | "female", seed: string) {
  const params = new URLSearchParams({
    seed,
    gender,
    backgroundColor: "eff6ff",
  });
  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
}
