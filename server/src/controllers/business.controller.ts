
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

// GET /api/businesses
// Retrieve all published businesses.
export const getPublishedBusinesses = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { isFeatured: "desc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        description: true,
        coverImage: true,
        logo: true,
        services: true,
        phone: true,
        whatsapp: true,
        email: true,
        website: true,
        address: true,
        facebook: true,
        instagram: true,
        isFeatured: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            url: true,
            altText: true,
            sortOrder: true,
          },
        },
        hours: {
          orderBy: { day: "asc" },
          select: {
            day: true,
            opensAt: true,
            closesAt: true,
            isClosed: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "ok",
      results: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/businesses/:slug
// Retrieve one published business profile.
export const getPublishedBusinessBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string") {
      res.status(400).json({
        status: "error",
        message: "Invalid business slug.",
      });
      return;
    }

    const business = await prisma.business.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        tagline: true,
        description: true,
        coverImage: true,
        logo: true,
        services: true,
        phone: true,
        whatsapp: true,
        email: true,
        website: true,
        address: true,
        facebook: true,
        instagram: true,
        isFeatured: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            url: true,
            altText: true,
            sortOrder: true,
          },
        },
        hours: {
          orderBy: { day: "asc" },
          select: {
            day: true,
            opensAt: true,
            closesAt: true,
            isClosed: true,
          },
        },
      },
    });

    if (!business) {
      res.status(404).json({
        status: "error",
        message: "Business not found.",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: business,
    });
  } catch (error) {
    next(error);
  }
};
