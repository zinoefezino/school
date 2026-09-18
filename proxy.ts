import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookieName, verifySessionToken } from "./lib/auth";

const dashboardRoles = [
  { prefix: "/dashboard/admin", role: "ADMIN" },
  { prefix: "/dashboard/staff", role: "STAFF" },
  { prefix: "/dashboard/parent", role: "PARENT" },
  { prefix: "/dashboard/student", role: "STUDENT" },
] as const;

export function proxy(request: NextRequest) {
  const match = dashboardRoles.find(({ prefix }) =>
    request.nextUrl.pathname.startsWith(prefix),
  );
  if (!match) return NextResponse.next();

  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session || session.role !== match.role) {
    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
