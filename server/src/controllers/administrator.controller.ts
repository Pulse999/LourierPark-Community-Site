
import type { Request, Response, NextFunction } from "express";

import { AdminStatus } from "../generated/prisma/client.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

// -----------------------------------------------------
// HELPERS
// -----------------------------------------------------

const getRouteParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    return value[0]?.trim() || null;
  }

  return null;
};

const getCurrentAdmin = (req: Request) => {
  return (req as AuthenticatedRequest).admin;
};

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
      orderBy: {
        name: "asc",
      },
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
    const currentAdmin = getCurrentAdmin(req);
    const administratorId = getRouteParam(req.params.id);

    if (!currentAdmin) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    if (!administratorId) {
      res.status(400).json({
        status: "error",
        message: "Invalid administrator ID.",
      });
      return;
    }

    const allowedStatuses = [
      AdminStatus.ACTIVE,
      AdminStatus.SUSPENDED,
      AdminStatus.DEACTIVATED,
    ] as const;

    const newStatus: unknown = req.body?.status;

    if (
      typeof newStatus !== "string" ||
      !allowedStatuses.some((status) => status === newStatus)
    ) {
      res.status(400).json({
        status: "error",
        message: "Please provide a valid administrator status.",
      });
      return;
    }

    const validatedStatus = newStatus as (typeof allowedStatuses)[number];

    if (administratorId === currentAdmin.id) {
      res.status(400).json({
        status: "error",
        message: "You cannot change your own administrator status.",
      });
      return;
    }

    const targetAdmin = await prisma.adminUser.findUnique({
      where: {
        id: administratorId,
      },
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
        where: {
          id: administratorId,
        },
        data: {
          status: validatedStatus,
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
            newStatus: validatedStatus,
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
      data: {
        administrator: updatedAdmin,
      },
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
        adminUserId: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
        createdAt: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const administratorIds = [
      ...new Set(invitations.map((invitation) => invitation.adminUserId)),
    ];

    const administrators = administratorIds.length
      ? await prisma.adminUser.findMany({
          where: {
            id: {
              in: administratorIds,
            },
          },
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
        })
      : [];

    const administratorMap = new Map(
      administrators.map((administrator) => [
        administrator.id,
        administrator,
      ])
    );

    const invitationResults = invitations.map((invitation) => ({
      id: invitation.id,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      revokedAt: invitation.revokedAt,
      createdAt: invitation.createdAt,
      adminUser: administratorMap.get(invitation.adminUserId) ?? null,
      invitedBy: invitation.invitedBy,
    }));

    res.status(200).json({
      status: "ok",
      data: {
        invitations: invitationResults,
      },
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
    const currentAdmin = getCurrentAdmin(req);
    const invitationId = getRouteParam(req.params.id);

    if (!currentAdmin) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    if (!invitationId) {
      res.status(400).json({
        status: "error",
        message: "Invalid invitation ID.",
      });
      return;
    }

    const invitation = await prisma.adminInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      res.status(404).json({
        status: "error",
        message: "Invitation not found.",
      });
      return;
    }

    const invitedAdmin = await prisma.adminUser.findUnique({
      where: {
        id: invitation.adminUserId,
      },
    });

    if (!invitedAdmin) {
      res.status(404).json({
        status: "error",
        message: "Invited administrator not found.",
      });
      return;
    }

    if (
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt <= new Date() ||
      invitedAdmin.status !== AdminStatus.INVITED
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
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          revokedAt: new Date(),
        },
      });

      if (revoked.count !== 1) {
        throw new Error("INVITATION_NO_LONGER_PENDING");
      }

      await tx.adminUser.update({
        where: {
          id: invitation.adminUserId,
        },
        data: {
          status: AdminStatus.DEACTIVATED,
        },
      });

      await tx.auditLog.create({
        data: {
          adminUserId: currentAdmin.id,
          action: "ADMIN_INVITATION_REVOKED",
          resourceType: "AdminInvitation",
          resourceId: invitation.id,
          details: {
            invitedEmail: invitedAdmin.email,
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
