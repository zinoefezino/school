import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken } from "./auth";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  return token ? verifySessionToken(token) : null;
}
