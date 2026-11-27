
import type { Request, Response, NextFunction } from "express";

const allowedOrigin = new URL(
  process.env.CLIENT_URL || "http://localhost:5173"
).origin;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");

  const referer = req.get("referer");
  let requestOrigin = origin;

  // Some clients may provide Referer instead of Origin.
  if (!requestOrigin && referer) {
    try {
      requestOrigin = new URL(referer).origin;
    } catch {
      requestOrigin = undefined;
    }
  }

  if (!requestOrigin || requestOrigin !== allowedOrigin) {
    res.status(403).json({
      status: "error",
      message: "Request origin could not be verified.",
    });
    return;
  }

  if (req.get("x-requested-with") !== "XMLHttpRequest") {
    res.status(403).json({
      status: "error",
      message: "Required request header is missing.",
    });
    return;
  }

  next();
};
