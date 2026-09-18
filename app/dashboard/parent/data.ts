export const parent = {
  fullName: "Mrs. Ngozi Okafor",
  email: "ngozi.okafor@example.com",
};

export const children = [
  {
    id: "chidera-okafor",
    name: "Chidera Okafor",
    admissionNumber: "FA-2026-0142",
    classSection: "JSS1 Gold",
    attendance: "94%",
    average: "82.2%",
    balance: 0,
    dueDate: "Oct 15, 2026",
    avatar: "CO",
  },
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    admissionNumber: "FA-2024-0108",
    classSection: "Primary 4A",
    attendance: "97%",
    average: "88.4%",
    balance: 45000,
    dueDate: "Oct 15, 2026",
    avatar: "AO",
  },
];

export const parentAnnouncements = [
  {
    title: "Mid-term break notice",
    date: "Sep 15, 2026",
    body: "School will be closed from October 3 to October 10.",
  },
  {
    title: "PTA meeting - Term 1",
    date: "Sep 10, 2026",
    body: "The first PTA meeting of the term will be held in the main hall at 10am.",
  },
];

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
