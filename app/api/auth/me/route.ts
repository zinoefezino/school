import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken } from "../../../../lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session)
    return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, user: session });
}
