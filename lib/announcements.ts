export type AnnouncementAudience = "STUDENT" | "PARENT" | "STAFF";

export type Announcement = {
  title: string;
  body: string;
  audiences: AnnouncementAudience[];
  date: string;
  unread: boolean;
};

export const announcements: Announcement[] = [
  {
    title: "Mid-term break notice",
    body: "School will be closed from October 3 to October 10 for mid-term break. Classes resume October 13.",
    audiences: ["STUDENT", "PARENT", "STAFF"],
    date: "Sep 15, 2026",
    unread: true,
  },
  {
    title: "PTA meeting - Term 1",
    body: "The first PTA meeting of the term will be held in the main hall at 10am on Saturday.",
    audiences: ["PARENT"],
    date: "Sep 10, 2026",
    unread: false,
  },
  {
    title: "Inter-house sports day",
    body: "This year's inter-house sports competition takes place on the school field. All houses should report by 8am.",
    audiences: ["STUDENT", "STAFF"],
    date: "Sep 2, 2026",
    unread: true,
  },
  {
    title: "Result submission deadline",
    body: "Teaching staff should submit all CA and exam scores for review before September 25.",
    audiences: ["STAFF"],
    date: "Sep 12, 2026",
    unread: true,
  },
];

export function audienceLabel(audiences: AnnouncementAudience[]) {
  if (audiences.length === 3) return "Everyone";
  return audiences
    .map((audience) => audience.charAt(0) + audience.slice(1).toLowerCase())
    .join(", ");
}

export function announcementsFor(audience: AnnouncementAudience) {
  return announcements.filter((announcement) =>
    announcement.audiences.includes(audience),
  );
}

export function unreadAnnouncementsFor(audience: AnnouncementAudience) {
  return announcements.filter(
    (announcement) =>
      announcement.unread && announcement.audiences.includes(audience),
  ).length;
}

export function unreadAnnouncementsCount() {
  return announcements.filter((announcement) => announcement.unread).length;
}

export function announcementReadStorageKey(
  audience: "ADMIN" | AnnouncementAudience,
) {
  return `school-announcements-read-${audience.toLowerCase()}`;
}

export function announcementReadIdsStorageKey(
  audience: "ADMIN" | AnnouncementAudience,
) {
  return `school-announcements-read-ids-${audience.toLowerCase()}`;
}

export function studentReadResultTermsStorageKey() {
  return "school-student-read-result-terms";
}
