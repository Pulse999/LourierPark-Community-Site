
import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

const TIME_ZONE = "Africa/Johannesburg";
const DAY_MS = 24 * 60 * 60 * 1000;

type Period = "7d" | "30d";

function getSouthAfricanDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getSouthAfricanMidnight(date: Date): Date {
  const dateString = getSouthAfricanDate(date);
  return new Date(`${dateString}T00:00:00+02:00`);
}

function getDateKey(date: Date): string {
  return getSouthAfricanDate(date);
}

function getDateRange(days: number, now: Date) {
  const todayStart = getSouthAfricanMidnight(now);

  return {
    start: new Date(todayStart.getTime() - (days - 1) * DAY_MS),
    end: now,
  };
}

export async function getWebsiteAnalytics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const requestedPeriod = req.query.period;

    const period: Period =
      requestedPeriod === "7d" ? "7d" : "30d";

    const now = new Date();
    const todayStart = getSouthAfricanMidnight(now);
    const todayEnd = new Date(todayStart.getTime() + DAY_MS);

    const days = period === "7d" ? 7 : 30;
    const range = getDateRange(days, now);

    const [
      todayPageViews,
      todayUniqueVisitors,
      periodPageViews,
      periodUniqueVisitors,
      pageViewRecords,
      popularPages,
      trafficSources,
    ] = await Promise.all([
      prisma.websitePageView.count({
        where: {
          createdAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
      }),

      prisma.websitePageView.findMany({
        where: {
          createdAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
        distinct: ["visitorId"],
        select: {
          visitorId: true,
        },
      }),

      prisma.websitePageView.count({
        where: {
          createdAt: {
            gte: range.start,
            lte: range.end,
          },
        },
      }),

      prisma.websitePageView.findMany({
        where: {
          createdAt: {
            gte: range.start,
            lte: range.end,
          },
        },
        distinct: ["visitorId"],
        select: {
          visitorId: true,
        },
      }),

      prisma.websitePageView.findMany({
        where: {
          createdAt: {
            gte: range.start,
            lte: range.end,
          },
        },
        select: {
          visitorId: true,
          path: true,
          referrerHost: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.websitePageView.groupBy({
        by: ["path"],
        where: {
          createdAt: {
            gte: range.start,
            lte: range.end,
          },
        },
        _count: {
          path: true,
        },
        orderBy: {
          _count: {
            path: "desc",
          },
        },
        take: 10,
      }),

      prisma.websitePageView.groupBy({
        by: ["referrerHost"],
        where: {
          createdAt: {
            gte: range.start,
            lte: range.end,
          },
          referrerHost: {
            not: null,
          },
        },
        _count: {
          referrerHost: true,
        },
        orderBy: {
          _count: {
            referrerHost: "desc",
          },
        },
        take: 10,
      }),
    ]);

    // Build a daily trend, including days with zero activity.
    const trendMap = new Map<
      string,
      { pageViews: number; visitors: Set<string> }
    >();

    for (let index = 0; index < days; index++) {
      const date = new Date(range.start.getTime() + index * DAY_MS);
      const dateKey = getDateKey(date);

      trendMap.set(dateKey, {
        pageViews: 0,
        visitors: new Set<string>(),
      });
    }

    for (const record of pageViewRecords) {
      const dateKey = getDateKey(record.createdAt);
      const day = trendMap.get(dateKey);

      if (day) {
        day.pageViews += 1;
        day.visitors.add(record.visitorId);
      }
    }

    const dailyTrend = Array.from(trendMap.entries()).map(
      ([date, values]) => ({
        date,
        pageViews: values.pageViews,
        uniqueVisitors: values.visitors.size,
      })
    );

    // A visitor is considered new when their first recorded visit
    // falls within the selected reporting period.
    const newVisitors = await prisma.websiteVisitor.count({
      where: {
        firstSeenAt: {
          gte: range.start,
          lte: range.end,
        },
        pageViews: {
          some: {
            createdAt: {
              gte: range.start,
              lte: range.end,
            },
          },
        },
      },
    });

    const uniqueVisitorCount = periodUniqueVisitors.length;

    const returningVisitors = Math.max(
      0,
      uniqueVisitorCount - newVisitors
    );

    res.status(200).json({
      status: "success",
      data: {
        generatedAt: now.toISOString(),
        timezone: TIME_ZONE,
        period,

        today: {
          uniqueVisitors: todayUniqueVisitors.length,
          pageViews: todayPageViews,
        },

        selectedPeriod: {
          uniqueVisitors: uniqueVisitorCount,
          pageViews: periodPageViews,
          newVisitors,
          returningVisitors,
        },

        dailyTrend,

        popularPages: popularPages.map((page) => ({
          path: page.path,
          pageViews: page._count.path,
        })),

        trafficSources: trafficSources.map((source) => ({
          hostname: source.referrerHost,
          pageViews: source._count.referrerHost,
        })),
      },
    });
  } catch (error) {
    console.error("Website analytics reporting error:", error);

    res.status(500).json({
      status: "error",
      message: "Unable to retrieve website analytics.",
    });
  }
}
