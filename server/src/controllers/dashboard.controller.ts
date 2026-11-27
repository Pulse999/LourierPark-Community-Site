
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const TIME_ZONE = "Africa/Johannesburg";

function getSouthAfricanDayRange(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  const dateString = `${values.year}-${values.month}-${values.day}`;

  // South Africa uses UTC+02:00 and does not observe daylight saving time.
  return {
    start: new Date(`${dateString}T00:00:00+02:00`),
    end: new Date(
      new Date(`${dateString}T00:00:00+02:00`).getTime() +
        24 * 60 * 60 * 1000
    ),
  };
}

export async function getDashboardStats(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const now = new Date();
    const today = getSouthAfricanDayRange(now);

    const [
      publishedBusinesses,
      draftBusinesses,
      unpublishedBusinesses,
      archivedBusinesses,
      featuredBusinesses,
      publishedNews,
      publishedAnnouncements,
      upcomingEvents,
      publishedOrganisations,
      pendingEventSubmissions,
      activeAdministrators,
      totalAdministrators,
      recentActivity,
    ] = await Promise.all([
      prisma.business.count({
        where: { status: "PUBLISHED" },
      }),

      prisma.business.count({
        where: { status: "DRAFT" },
      }),

      prisma.business.count({
        where: { status: "UNPUBLISHED" },
      }),

      prisma.business.count({
        where: { status: "ARCHIVED" },
      }),

      prisma.business.count({
        where: {
          status: "PUBLISHED",
          isFeatured: true,
        },
      }),

      prisma.communityPost.count({
        where: {
          type: "NEWS",
          status: "PUBLISHED",
        },
      }),

      prisma.communityPost.count({
        where: {
          type: "ANNOUNCEMENT",
          status: "PUBLISHED",
        },
      }),

      prisma.communityEvent.count({
        where: {
          status: "PUBLISHED",
          startAt: { gte: now },
        },
      }),

      prisma.communityOrganisation.count({
        where: { status: "PUBLISHED" },
      }),

      prisma.eventSubmission.count({
        where: { status: "PENDING" },
      }),

      prisma.adminUser.count({
        where: { status: "ACTIVE" },
      }),

      prisma.adminUser.count(),

      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          resourceType: true,
          resourceId: true,
          createdAt: true,
          adminUser: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        generatedAt: now.toISOString(),
        timezone: TIME_ZONE,

        overview: {
          businesses: {
            published: publishedBusinesses,
            draft: draftBusinesses,
            unpublished: unpublishedBusinesses,
            archived: archivedBusinesses,
            featured: featuredBusinesses,
            total:
              publishedBusinesses +
              draftBusinesses +
              unpublishedBusinesses +
              archivedBusinesses,
          },

          content: {
            news: publishedNews,
            announcements: publishedAnnouncements,
          },

          events: {
            upcoming: upcomingEvents,
            pendingSubmissions: pendingEventSubmissions,
          },

          organisations: {
            published: publishedOrganisations,
          },

          administrators: {
            active: activeAdministrators,
            total: totalAdministrators,
          },
        },

        recentActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      status: "error",
      message: "Unable to retrieve dashboard statistics.",
    });
  }
}
