
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  JWT_SECRET,
} from "../utils/auth.js";

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    name: string;
    email: string;
    isSuperAdmin: boolean;
    roles: string[];
    permissions: string[];
  };
}

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME] ?? "";

    // Verify the JWT signature and expiration.
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "string" ||
      typeof (decoded as JwtPayload).sub !== "string"
    ) {
      res.status(401).json({
        status: "error",
        message: "Invalid authentication token.",
      });
      return;
    }

    const adminId = (decoded as JwtPayload).sub as string;

    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!admin || admin.status !== "ACTIVE") {
      res.clearCookie(AUTH_COOKIE_NAME, {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: undefined,
});

      res.status(401).json({
        status: "error",
        message: "Administrator account is inactive.",
      });
      return;
    }

    const roles = admin.roles.map(({ role }) => role.slug);

    const permissions = [
      ...new Set(
        admin.roles.flatMap(({ role }) =>
          role.permissions.map(
            ({ permission }) => permission.key
          )
        )
      ),
    ];

    (req as AuthenticatedRequest).admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isSuperAdmin: admin.isSuperAdmin,
      roles,
      permissions,
    };

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      res.clearCookie(AUTH_COOKIE_NAME, {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: undefined,
});

      res.status(401).json({
        status: "error",
        message: "Your session is invalid or has expired.",
      });
      return;
    }

    next(error);
  }
};

export const requirePermission = (permission: string) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const admin = (req as AuthenticatedRequest).admin;

    if (!admin) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    if (
      !admin.isSuperAdmin &&
      !admin.permissions.includes(permission)
    ) {
      res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action.",
      });
      return;
    }

    next();
  };
};
