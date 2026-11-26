
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} from "../utils/auth.js";

const ADMIN_INVITATION_EXPIRY_HOURS = 48;
const BCRYPT_ROUNDS = 12;

const hashInvitationToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

// -----------------------------------------------------
// ADMIN LOGIN
// -----------------------------------------------------

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

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

    res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

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

// -----------------------------------------------------
// ADMIN LOGOUT
// -----------------------------------------------------

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: undefined,
  });

  res.status(200).json({
    status: "ok",
    message: "Logout successful.",
  });
};

// -----------------------------------------------------
// CURRENT ADMINISTRATOR
// -----------------------------------------------------

export const getCurrentAdmin = (
  req: Request,
  res: Response
): void => {
  const admin = (req as AuthenticatedRequest).admin;

  if (!admin) {
    res.status(401).json({
      status: "error",
      message: "Authentication required.",
    });
    return;
  }

  res.status(200).json({
    status: "ok",
    data: {
      administrator: admin,
    },
  });
};

// -----------------------------------------------------
// CREATE ADMINISTRATOR INVITATION
// -----------------------------------------------------

export const createAdminInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inviter = (req as AuthenticatedRequest).admin;

    if (!inviter) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";

    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const roleId =
      typeof req.body.roleId === "string" ? req.body.roleId.trim() : "";

    if (!name || !email || !roleId) {
      res.status(400).json({
        status: "error",
        message: "Name, email and role are required.",
      });
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      res.status(400).json({
        status: "error",
        message: "Please provide a valid email address.",
      });
      return;
    }

    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      res.status(409).json({
        status: "error",
        message: "An administrator with this email already exists.",
      });
      return;
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      res.status(404).json({
        status: "error",
        message: "The selected administrator role was not found.",
      });
      return;
    }

    if (role.slug === "super-administrator" && !inviter.isSuperAdmin) {
      res.status(403).json({
        status: "error",
        message: "Only a super administrator can assign this role.",
      });
      return;
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashInvitationToken(rawToken);

    const expiresAt = new Date(
      Date.now() + ADMIN_INVITATION_EXPIRY_HOURS * 60 * 60 * 1000
    );

    // This password is intentionally random and never disclosed.
    // The invitee sets their own password when accepting the invitation.
    const unusablePassword = randomBytes(48).toString("hex");
    const passwordHash = await bcrypt.hash(
      unusablePassword,
      BCRYPT_ROUNDS
    );

    const invitation = await prisma.$transaction(async (tx) => {
      const invitedAdmin = await tx.adminUser.create({
        data: {
          name,
          email,
          passwordHash,
          status: "INVITED",
          roles: {
            create: {
              roleId: role.id,
            },
          },
        },
      });

      const createdInvitation = await tx.adminInvitation.create({
        data: {
          adminUserId: invitedAdmin.id,
          invitedById: inviter.id,
          tokenHash,
          expiresAt,
        },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: inviter.id,
          action: "ADMIN_INVITATION_CREATED",
          resourceType: "AdminInvitation",
          resourceId: createdInvitation.id,
          details: {
            invitedEmail: email,
            assignedRole: role.slug,
          },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });

      return createdInvitation;
    });

    const clientUrl = (
      process.env.CLIENT_URL || "http://localhost:5173"
    ).replace(/\/+$/, "");

    const invitationUrl =
      `${clientUrl}/admin/accept-invitation?token=${rawToken}`;

    res.status(201).json({
      status: "ok",
      message: "Administrator invitation created successfully.",
      data: {
        invitation: {
          id: invitation.id,
          email,
          role: role.name,
          expiresAt: invitation.expiresAt,
        },
        ...(process.env.NODE_ENV !== "production"
          ? { invitationUrl }
          : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// ACCEPT ADMINISTRATOR INVITATION
// -----------------------------------------------------

export const acceptAdminInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      typeof req.body.token === "string" ? req.body.token.trim() : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!token || !password) {
      res.status(400).json({
        status: "error",
        message: "Invitation token and password are required.",
      });
      return;
    }

    if (token.length !== 64) {
      res.status(400).json({
        status: "error",
        message: "Invalid invitation token.",
      });
      return;
    }

    if (password.length < 12) {
      res.status(400).json({
        status: "error",
        message: "Your password must contain at least 12 characters.",
      });
      return;
    }

    const tokenHash = hashInvitationToken(token);

    const invitation = await prisma.adminInvitation.findUnique({
      where: { tokenHash },
      include: {
        adminUser: true,
      },
    });

    if (
      !invitation ||
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt <= new Date() ||
      invitation.adminUser.status !== "INVITED"
    ) {
      res.status(400).json({
        status: "error",
        message: "This invitation is invalid, expired or already used.",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await prisma.$transaction(async (tx) => {
      const updatedInvitation = await tx.adminInvitation.updateMany({
        where: {
          id: invitation.id,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      if (updatedInvitation.count !== 1) {
        throw new Error("INVITATION_ALREADY_USED");
      }

      await tx.adminUser.update({
        where: { id: invitation.adminUserId },
        data: {
          passwordHash,
          status: "ACTIVE",
        },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: invitation.adminUserId,
          action: "ADMIN_INVITATION_ACCEPTED",
          resourceType: "AdminInvitation",
          resourceId: invitation.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    });

    res.status(200).json({
      status: "ok",
      message: "Invitation accepted. You can now log in.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVITATION_ALREADY_USED"
    ) {
      res.status(400).json({
        status: "error",
        message: "This invitation is invalid, expired or already used.",
      });
      return;
    }

    next(error);
  }
};
