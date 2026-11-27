
import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";
import {
  hashAnonymousId,
  isValidAnonymousId,
  sanitisePagePath,
  sanitiseReferrerHost,
} from "../utils/visitor.js";

export async function recordPageView(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { anonymousId, path, referrer } = req.body ?? {};

    if (!isValidAnonymousId(anonymousId)) {
      res.status(400).json({
        status: "error",
        message: "A valid anonymous visitor ID is required.",
      });
      return;
    }

    const safePath = sanitisePagePath(path);

    if (!safePath) {
      res.status(400).json({
        status: "error",
        message: "A valid public page path is required.",
      });
      return;
    }

    const referrerHost = sanitiseReferrerHost(referrer);
    const anonymousIdHash = hashAnonymousId(anonymousId);
    const now = new Date();

    // Find or create the anonymous visitor.
    // Avoids interactive transactions with the Neon connection pooler.
    const visitor = await prisma.websiteVisitor.upsert({
      where: { anonymousIdHash },
      update: {
        lastSeenAt: now,
      },
      create: {
        anonymousIdHash,
        firstSeenAt: now,
        lastSeenAt: now,
      },
      select: {
        id: true,
      },
    });

    // Record this individual page view.
    await prisma.websitePageView.create({
      data: {
        visitorId: visitor.id,
        path: safePath,
        referrerHost,
        createdAt: now,
      },
    });

    res.status(202).json({
      status: "success",
      message: "Page view recorded.",
    });
  } catch (error) {
    console.error("Website analytics tracking error:", error);

    res.status(500).json({
      status: "error",
      message: "Unable to record this page view.",
    });
  }
}
