export type AnnouncementAudience = "STUDENT" | "PARENT" | "STAFF";

export function audienceLabel(audiences: AnnouncementAudience[]) {
  if (audiences.length === 3) return "Everyone";
  return audiences
    .map((audience) => audience.charAt(0) + audience.slice(1).toLowerCase())
    .join(", ");
}

export function studentReadResultTermsStorageKey() {
  return "school-student-read-result-terms";
}
