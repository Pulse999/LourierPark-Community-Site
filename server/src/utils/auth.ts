
import type { CookieOptions } from "express";
import type { SignOptions } from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "lp_admin_token";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters.");
}

export const JWT_SECRET = jwtSecret;

export const JWT_EXPIRES_IN = (
  process.env.JWT_EXPIRES_IN || "8h"
) as SignOptions["expiresIn"];

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};
