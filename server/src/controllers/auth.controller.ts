
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} from "../utils/auth.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password
        : "";

    if (!email || !password) {
      res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
      return;
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
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
      res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password.",
      });
      return;
    }

    const token = jwt.sign(
      { sub: admin.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie(
      AUTH_COOKIE_NAME,
      token,
      AUTH_COOKIE_OPTIONS
    );

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const roles = admin.roles.map(({ role }) => ({
      id: role.id,
      name: role.name,
      slug: role.slug,
    }));

    const permissions = [
      ...new Set(
        admin.roles.flatMap(({ role }) =>
          role.permissions.map(({ permission }) => permission.key)
        )
      ),
    ];

    res.status(200).json({
      status: "ok",
      message: "Login successful.",
      data: {
        administrator: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          isSuperAdmin: admin.isSuperAdmin,
          roles,
          permissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: undefined,
  });

  res.status(200).json({
    status: "ok",
    message: "Logout successful.",
  });
};
