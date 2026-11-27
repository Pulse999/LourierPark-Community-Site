
import { doubleCsrf } from "csrf-csrf";

import { AUTH_COOKIE_NAME } from "./auth.js";

const csrfSecret = process.env.CSRF_SECRET;

if (!csrfSecret || csrfSecret.length < 32) {
  throw new Error("CSRF_SECRET must be configured with at least 32 characters.");
}

const isProduction = process.env.NODE_ENV === "production";

const csrf = doubleCsrf({
  getSecret: () => csrfSecret,

  // Bind the CSRF token to the current administrator JWT.
  // Unauthenticated visitors use the anonymous identifier.
  getSessionIdentifier: (req) =>
    req.cookies?.[AUTH_COOKIE_NAME] ?? "anonymous",

  cookieName: isProduction ? "__Host-lp_csrf" : "lp_csrf",

  cookieOptions: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  },

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  getCsrfTokenFromRequest: (req) => {
    const token = req.headers["x-csrf-token"];
    return typeof token === "string" ? token : null;
  },
});

export const {
  doubleCsrfProtection,
  generateCsrfToken,
  invalidCsrfTokenError,
} = csrf;
