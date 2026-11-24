
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

// GET /api/business-categories
export const getBusinessCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.businessCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        _count: {
          select: {
            businesses: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: "ok",
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/business-categories/:slug
export const getBusinessCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug) {
      res.status(400).json({
        status: "error",
        message: "A valid category slug is required.",
      });
      return;
    }

    const category = await prisma.businessCategory.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        _count: {
          select: {
            businesses: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({
        status: "error",
        message: "Business category not found.",
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/business-categories/:slug/businesses
export const getBusinessesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    if (!slug) {
      res.status(400).json({
        status: "error",
        message: "A valid category slug is required.",
      });
      return;
    }

    const category = await prisma.businessCategory.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });

    if (!category) {
      res.status(404).json({
        status: "error",
        message: "Business category not found.",
      });
      return;
    }

    const businesses = await prisma.business.findMany({
      where: {
        categoryId: category.id,
        status: "PUBLISHED",
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
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
      },
    });

    res.status(200).json({
      status: "ok",
      category,
      results: businesses.length,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};
