import {
  createHmac,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(nodeScrypt);
export const sessionCookieName = "school_session";
const sessionLifetimeSeconds = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF" | "PARENT" | "STUDENT";
  expiresAt: number;
};

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return secret;
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [, salt, storedKey] = storedHash.split("$");
  if (!salt || !storedKey) return false;
  const key = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(storedKey, "hex");
  return expected.length === key.length && timingSafeEqual(expected, key);
}

export function createSessionToken(payload: Omit<SessionPayload, "expiresAt">) {
  const value: SessionPayload = {
    ...payload,
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
  };
  const encoded = encode(JSON.stringify(value));
  const signature = createHmac("sha256", authSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", authSecret())
    .update(encoded)
    .digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  )
    return null;
  const payload = JSON.parse(decode(encoded)) as SessionPayload;
  return payload.expiresAt > Date.now() ? payload : null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  };
}
