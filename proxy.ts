import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "school_session";

type UserRole = "ADMIN" | "STAFF" | "PARENT" | "STUDENT";

type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
};

const roleHome: Record<UserRole, string> = {
  ADMIN: "/dashboard/admin",
  STAFF: "/dashboard/staff",
  PARENT: "/dashboard/parent",
  STUDENT: "/dashboard/student",
};

const dashboardRoles: { prefix: string; role: UserRole }[] = [
  { prefix: "/dashboard/admin", role: "ADMIN" },
  { prefix: "/dashboard/staff", role: "STAFF" },
  { prefix: "/dashboard/parent", role: "PARENT" },
  { prefix: "/dashboard/student", role: "STUDENT" },
];

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function base64UrlToText(value: string) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function verifySession(token: string): Promise<SessionPayload | null> {
  const [encoded, signature] = token.split(".");
  const secret = process.env.AUTH_SECRET;

  if (!encoded || !signature || !secret) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encoded),
  );
  const expected = bytesToBase64Url(new Uint8Array(signed));

  if (expected !== signature) return null;

  try {
    const payload = JSON.parse(base64UrlToText(encoded)) as SessionPayload;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function loginRedirect(request: NextRequest) {
  const url = new URL("/portal/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  const response = NextResponse.redirect(url);
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const required = dashboardRoles.find(({ prefix }) =>
    pathname.startsWith(prefix),
  );
  const token = request.cookies.get(sessionCookieName)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) return loginRedirect(request);

  if (required && session.role !== required.role) {
    return NextResponse.redirect(new URL(roleHome[session.role], request.url));
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(roleHome[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
