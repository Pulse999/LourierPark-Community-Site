
import { createHmac } from "node:crypto";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidAnonymousId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function hashAnonymousId(anonymousId: string): string {
  const secret = process.env.VISITOR_HASH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "VISITOR_HASH_SECRET must be configured with at least 32 characters."
    );
  }

  return createHmac("sha256", secret)
    .update(anonymousId)
    .digest("hex");
}

export function sanitisePagePath(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 500) {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  // Only store the path, never query parameters or fragments.
  const path = value.split("?")[0].split("#")[0];

  if (
    !path ||
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/api" ||
    path.startsWith("/api/")
  ) {
    return null;
  }

  return path;
}

export function sanitiseReferrerHost(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) {
    return null;
  }

  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url.hostname.toLowerCase().slice(0, 253) || null;
  } catch {
    return null;
  }
}
