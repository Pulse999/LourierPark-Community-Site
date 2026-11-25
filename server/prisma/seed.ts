
import { prisma } from "../src/lib/prisma.js";

const categories = [
  {
    name: "Food & Takeaways",
    slug: "food",
    description: "Local meals, takeaways and convenient food services.",
    icon: "utensils",
    sortOrder: 1,
  },
  {
    name: "Baking & Confectionery",
    slug: "bakeries",
    description: "Freshly baked goods, cakes and sweet treats.",
    icon: "cake-slice",
    sortOrder: 2,
  },
  {
    name: "Coffee Shops & Refreshments",
    slug: "coffee",
    description: "Coffee, light meals and places to grab a refreshment.",
    icon: "coffee",
    sortOrder: 3,
  },
  {
    name: "Hair, Beauty & Grooming",
    slug: "beauty",
    description: "Personal care, hair styling and beauty services.",
    icon: "scissors",
    sortOrder: 4,
  },
  {
    name: "Automotive Services",
    slug: "automotive",
    description: "Vehicle maintenance, repairs and cleaning.",
    icon: "car",
    sortOrder: 5,
  },
  {
    name: "Repairs & Maintenance",
    slug: "repairs",
    description: "Reliable help with household repairs and installations.",
    icon: "wrench",
    sortOrder: 6,
  },
  {
    name: "Gardening & Landscaping",
    slug: "gardening",
    description: "Garden care and outdoor property maintenance.",
    icon: "sprout",
    sortOrder: 7,
  },
  {
    name: "Building & Construction",
    slug: "construction",
    description: "Building, renovation and skilled construction services.",
    icon: "hammer",
    sortOrder: 8,
  },
  {
    name: "Painting & Decorating",
    slug: "painting",
    description: "Interior, exterior and property finishing services.",
    icon: "paintbrush",
    sortOrder: 9,
  },
  {
    name: "Plumbing Services",
    slug: "plumbing",
    description: "Water systems, plumbing repairs and installations.",
    icon: "droplets",
    sortOrder: 10,
  },
  {
    name: "Electrical Services",
    slug: "electrical",
    description: "Electrical repairs, installations and related services.",
    icon: "zap",
    sortOrder: 11,
  },
  {
    name: "IT & Technology",
    slug: "technology",
    description: "Computer support, internet access and technical assistance.",
    icon: "laptop",
    sortOrder: 12,
  },
  {
    name: "Printing & Office Services",
    slug: "printing",
    description: "Printing, copying and everyday document services.",
    icon: "printer",
    sortOrder: 13,
  },
  {
    name: "Convenience & Retail",
    slug: "retail",
    description: "Everyday essentials and locally operated shops.",
    icon: "shopping-basket",
    sortOrder: 14,
  },
  {
    name: "Clothing & Textiles",
    slug: "clothing",
    description: "Clothing, alterations and sewing services.",
    icon: "shirt",
    sortOrder: 15,
  },
  {
    name: "Pet Care & Animal Services",
    slug: "pets",
    description: "Care and services for household pets.",
    icon: "paw-print",
    sortOrder: 16,
  },
  {
    name: "Health & Wellness",
    slug: "health",
    description: "Local wellness and personal health services.",
    icon: "heart-pulse",
    sortOrder: 17,
  },
  {
    name: "Transport & Delivery",
    slug: "transport",
    description: "Local transport, collection and delivery services.",
    icon: "truck",
    sortOrder: 18,
  },
];

async function main() {
  console.log("Starting business category seeding...");

  for (const category of categories) {
    await prisma.businessCategory.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
  }

  console.log(`Successfully seeded ${categories.length} business categories.`);
}

main()
  .catch((error) => {
    console.error("Business category seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });