
import type { Request, Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

// -----------------------------------------------------
// LIST ADMINISTRATORS
// -----------------------------------------------------

export const getAdministrators = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const administrators = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        isSuperAdmin: true,
        lastLoginAt: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [
        { isSuperAdmin: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.status(200).json({
      status: "ok",
      data: { administrators },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// LIST AVAILABLE ROLES
// -----------------------------------------------------

export const getAdministratorRoles = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isSystem: true,
        _count: {
          select: {
            administrators: true,
          },
        },
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                key: true,
                module: true,
                action: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      status: "ok",
      data: { roles },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// UPDATE ADMINISTRATOR STATUS
// -----------------------------------------------------

export const updateAdministratorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentAdmin = (req as AuthenticatedRequest).admin;
    const administratorId = req.params.id;

    const allowedStatuses = [
      "ACTIVE",
      "SUSPENDED",
      "DEACTIVATED",
    ] as const;

    const newStatus = req.body.status;

    if (!currentAdmin) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    if (
      typeof newStatus !== "string" ||
      !allowedStatuses.includes(
        newStatus as (typeof allowedStatuses)[number]
      )
    ) {
      res.status(400).json({
        status: "error",
        message: "Please provide a valid administrator status.",
      });
      return;
    }

    if (administratorId === currentAdmin.id) {
      res.status(400).json({
        status: "error",
        message: "You cannot change your own administrator status.",
      });
      return;
    }

    const targetAdmin = await prisma.adminUser.findUnique({
      where: { id: administratorId },
    });

    if (!targetAdmin) {
      res.status(404).json({
        status: "error",
        message: "Administrator not found.",
      });
      return;
    }

    if (targetAdmin.isSuperAdmin) {
      res.status(403).json({
        status: "error",
        message: "A super administrator account cannot be modified here.",
      });
      return;
    }

    const updatedAdmin = await prisma.$transaction(async (tx) => {
      const updated = await tx.adminUser.update({
        where: { id: administratorId },
        data: {
          status: newStatus,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isSuperAdmin: true,
        },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: currentAdmin.id,
          action: "ADMIN_STATUS_UPDATED",
          resourceType: "AdminUser",
          resourceId: administratorId,
          details: {
            previousStatus: targetAdmin.status,
            newStatus,
            targetEmail: targetAdmin.email,
          },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });

      return updated;
    });

    res.status(200).json({
      status: "ok",
      message: "Administrator status updated successfully.",
      data: { administrator: updatedAdmin },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// LIST ADMINISTRATOR INVITATIONS
// -----------------------------------------------------

export const getAdministratorInvitations = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invitations = await prisma.adminInvitation.findMany({
      select: {
        id: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdAt: true,
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            roles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "ok",
      data: { invitations },
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// REVOKE ADMINISTRATOR INVITATION
// -----------------------------------------------------

export const revokeAdministratorInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentAdmin = (req as AuthenticatedRequest).admin;
    const invitationId = req.params.id;

    if (!currentAdmin) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: { id: invitationId },
      include: {
        adminUser: true,
      },
    });

    if (!invitation) {
      res.status(404).json({
        status: "error",
        message: "Invitation not found.",
      });
      return;
    }

    if (
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt <= new Date() ||
      invitation.adminUser.status !== "INVITED"
    ) {
      res.status(400).json({
        status: "error",
        message: "This invitation is no longer pending.",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const revoked = await tx.adminInvitation.updateMany({
        where: {
          id: invitation.id,
          acceptedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revoked.count !== 1) {
        throw new Error("INVITATION_NO_LONGER_PENDING");
      }

      await tx.adminUser.update({
        where: { id: invitation.adminUserId },
        data: { status: "DEACTIVATED" },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: currentAdmin.id,
          action: "ADMIN_INVITATION_REVOKED",
          resourceType: "AdminInvitation",
          resourceId: invitation.id,
          details: {
            invitedEmail: invitation.adminUser.email,
          },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        },
      });
    });

    res.status(200).json({
      status: "ok",
      message: "Administrator invitation revoked successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVITATION_NO_LONGER_PENDING"
    ) {
      res.status(400).json({
        status: "error",
        message: "This invitation is no longer pending.",
      });
      return;
    }

    next(error);
  }
};
