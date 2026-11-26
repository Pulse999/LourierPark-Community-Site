
import "dotenv/config";
import bcrypt from "bcryptjs";

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

const permissions = [
  {
    key: "dashboard.view",
    module: "dashboard",
    action: "view",
    description: "View the administration dashboard.",
  },
  {
    key: "dashboard.analytics.view",
    module: "dashboard",
    action: "analytics.view",
    description: "View dashboard analytics and website statistics.",
  },
  {
    key: "businesses.view",
    module: "businesses",
    action: "view",
    description: "View business directory records.",
  },
  {
    key: "businesses.create",
    module: "businesses",
    action: "create",
    description: "Create business listings.",
  },
  {
    key: "businesses.update",
    module: "businesses",
    action: "update",
    description: "Update business listings.",
  },
  {
    key: "businesses.delete",
    module: "businesses",
    action: "delete",
    description: "Delete business listings.",
  },
  {
    key: "businesses.publish",
    module: "businesses",
    action: "publish",
    description: "Publish and unpublish business listings.",
  },
  {
    key: "businesses.feature",
    module: "businesses",
    action: "feature",
    description: "Feature and unfeature business listings.",
  },
  {
    key: "categories.manage",
    module: "categories",
    action: "manage",
    description: "Manage business categories.",
  },
  {
    key: "admins.manage",
    module: "admins",
    action: "manage",
    description: "Manage administrator accounts.",
  },
  {
    key: "admin.invitations.create",
    module: "admins",
    action: "invite",
    description: "Create invitations for new administrators.",
  },
  {
    key: "roles.manage",
    module: "roles",
    action: "manage",
    description: "Manage roles and permissions.",
  },
  {
    key: "audit.view",
    module: "audit",
    action: "view",
    description: "View administrative audit logs.",
  },
];

async function seedCategories() {
  console.log("Seeding business categories...");

  for (const category of categories) {
    await prisma.businessCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} business categories.`);
}

async function seedPermissions() {
  console.log("Seeding administrator permissions...");

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        module: permission.module,
        action: permission.action,
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log(`Seeded ${permissions.length} permissions.`);
}

async function seedSuperAdministrator() {
  console.log("Setting up the initial administrator...");

  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured."
    );
  }

  if (password.length < 12) {
    throw new Error("Administrator password must be at least 12 characters.");
  }

  const role = await prisma.role.upsert({
    where: { slug: "super-administrator" },
    update: {
      name: "Super Administrator",
      description: "Full access to the LourierPark administration system.",
      isSystem: true,
    },
    create: {
      name: "Super Administrator",
      slug: "super-administrator",
      description: "Full access to the LourierPark administration system.",
      isSystem: true,
    },
  });

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  let adminUserId: string;

  if (admin) {
    adminUserId = admin.id;

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        name,
        status: "ACTIVE",
        isSuperAdmin: true,
      },
    });

    console.log("Existing administrator found. Password was not changed.");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);

    const createdAdmin = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
        status: "ACTIVE",
        isSuperAdmin: true,
      },
    });

    adminUserId = createdAdmin.id;

    console.log("Initial administrator created.");
  }

  // Assign every seeded permission to the super administrator role.
  const seededPermissions = await prisma.permission.findMany({
    where: {
      key: { in: permissions.map((permission) => permission.key) },
    },
    select: { id: true },
  });

  await prisma.rolePermission.createMany({
    data: seededPermissions.map((permission) => ({
      roleId: role.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  await prisma.adminRole.upsert({
    where: {
      adminUserId_roleId: {
        adminUserId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      adminUserId,
      roleId: role.id,
    },
  });

  console.log("Super Administrator role and permissions assigned.");
}

async function main() {
  console.log("Starting LourierPark database seeding...");

  await seedCategories();
  await seedPermissions();
  await seedSuperAdministrator();

  console.log("Database seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
