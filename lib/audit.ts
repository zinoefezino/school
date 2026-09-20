import type { SessionPayload } from "./auth";
import AuditLog from "../models/AuditLog";

type AuditInput = {
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  session?: SessionPayload | null;
};

export async function writeAuditLog({
  action,
  targetType,
  targetId,
  metadata,
  session,
}: AuditInput) {
  try {
    await AuditLog.create({
      actor: session?.userId,
      actorEmail: session?.email,
      actorRole: session?.role,
      action,
      targetType,
      targetId,
      metadata,
    });
  } catch (error) {
    console.error("[audit-log]", error);
  }
}
