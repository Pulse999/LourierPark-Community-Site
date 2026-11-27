
import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

// -----------------------------------------------------
// BUSINESS CATEGORIES
// -----------------------------------------------------

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

// -----------------------------------------------------
// PERMISSIONS
// -----------------------------------------------------

const permissions = [
  // Dashboard
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

  // Businesses
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

  // News and announcements
  {
    key: "content.view",
    module: "content",
    action: "view",
    description: "View community news and announcements.",
  },
  {
    key: "content.create",
    module: "content",
    action: "create",
    description: "Create community news and announcements.",
  },
  {
    key: "content.update",
    module: "content",
    action: "update",
    description: "Update community content.",
  },
  {
    key: "content.delete",
    module: "content",
    action: "delete",
    description: "Delete community content.",
  },
  {
    key: "content.publish",
    module: "content",
    action: "publish",
    description: "Publish and unpublish community content.",
  },

  // Events
  {
    key: "events.view",
    module: "events",
    action: "view",
    description: "View community events.",
  },
  {
    key: "events.create",
    module: "events",
    action: "create",
    description: "Create community events.",
  },
  {
    key: "events.update",
    module: "events",
    action: "update",
    description: "Update community events.",
  },
  {
    key: "events.delete",
    module: "events",
    action: "delete",
    description: "Delete community events.",
  },
  {
    key: "events.publish",
    module: "events",
    action: "publish",
    description: "Publish and cancel community events.",
  },
  {
    key: "events.submissions.view",
    module: "events",
    action: "submissions.view",
    description: "View submitted community events.",
  },
  {
    key: "events.submissions.review",
    module: "events",
    action: "submissions.review",
    description: "Review and process event submissions.",
  },

  // Community organisations
  {
    key: "organisations.view",
    module: "organisations",
    action: "view",
    description: "View community organisations.",
  },
  {
    key: "organisations.create",
    module: "organisations",
    action: "create",
    description: "Create community organisation records.",
  },
  {
    key: "organisations.update",
    module: "organisations",
    action: "update",
    description: "Update community organisation records.",
  },
  {
    key: "organisations.delete",
    module: "organisations",
    action: "delete",
    description: "Delete community organisation records.",
  },
  {
    key: "organisations.publish",
    module: "organisations",
    action: "publish",
    description: "Publish and unpublish organisations.",
  },

  // Community submissions
  {
    key: "submissions.view",
    module: "submissions",
    action: "view",
    description: "View community submissions.",
  },
  {
    key: "submissions.review",
    module: "submissions",
    action: "review",
    description: "Review, approve and reject community submissions.",
  },

  // Safety and security
  {
    key: "safety.view",
    module: "safety",
    action: "view",
    description: "View safety and security information.",
  },
  {
    key: "safety.create",
    module: "safety",
    action: "create",
    description: "Create safety and security notices.",
  },
  {
    key: "safety.update",
    module: "safety",
    action: "update",
    description: "Update safety and security information.",
  },
  {
    key: "safety.delete",
    module: "safety",
    action: "delete",
    description: "Delete safety and security information.",
  },
  {
    key: "safety.publish",
    module: "safety",
    action: "publish",
    description: "Publish safety and security notices.",
  },

  // Media and gallery
  {
    key: "media.view",
    module: "media",
    action: "view",
    description: "View uploaded media assets.",
  },
  {
    key: "media.upload",
    module: "media",
    action: "upload",
    description: "Upload images and documents.",
  },
  {
    key: "media.update",
    module: "media",
    action: "update",
    description: "Update media asset information.",
  },
  {
    key: "media.delete",
    module: "media",
    action: "delete",
    description: "Delete media assets.",
  },

  // Administration
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

// -----------------------------------------------------
// ROLE DEFINITIONS
// -----------------------------------------------------

const roleDefinitions = [
  {
    name: "Super Administrator",
    slug: "super-administrator",
    description: "Full access to the LourierPark administration system.",
    isSystem: true,
    permissionKeys: permissions.map((permission) => permission.key),
  },
  {
    name: "Content Administrator",
    slug: "content-administrator",
    description: "Manage community news, announcements and published content.",
    isSystem: true,
    permissionKeys: [
      "dashboard.view",
      "content.view",
      "content.create",
      "content.update",
      "content.delete",
      "content.publish",
      "media.view",
    ],
  },
  {
    name: "Business Administrator",
    slug: "business-administrator",
    description: "Manage local business listings and directory categories.",
    isSystem: true,
    permissionKeys: [
      "dashboard.view",
      "businesses.view",
      "businesses.create",
      "businesses.update",
      "businesses.delete",
      "businesses.publish",
      "businesses.feature",
      "categories.manage",
      "media.view",
    ],
  },
  {
    name: "Events Administrator",
    slug: "events-administrator",
    description: "Manage community events and review event submissions.",
    isSystem: true,
    permissionKeys: [
      "dashboard.view",
      "events.view",
      "events.create",
      "events.update",
      "events.delete",
      "events.publish",
      "events.submissions.view",
      "events.submissions.review",
      "media.view",
    ],
  },
  {
    name: "Community Moderator",
    slug: "community-moderator",
    description: "Review community submissions and manage organisation records.",
    isSystem: true,
    permissionKeys: [
      "dashboard.view",
      "submissions.view",
      "submissions.review",
      "organisations.view",
      "organisations.update",
      "organisations.publish",
      "events.submissions.view",
      "events.submissions.review",
    ],
  },
  {
    name: "Media Administrator",
    slug: "media-administrator",
    description: "Manage the community gallery and uploaded media assets.",
    isSystem: true,
    permissionKeys: [
      "dashboard.view",
      "media.view",
      "media.upload",
      "media.update",
      "media.delete",
    ],
  },
];

// -----------------------------------------------------
// SEED BUSINESS CATEGORIES
// -----------------------------------------------------

async function seedCategories() {
  console.log("Seeding business categories...");

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

  console.log(`Seeded ${categories.length} business categories.`);
}

// -----------------------------------------------------
// SEED PERMISSIONS
// -----------------------------------------------------

async function seedPermissions() {
  console.log("Seeding administrator permissions...");

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        key: permission.key,
      },
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

// -----------------------------------------------------
// SEED ADMINISTRATOR ROLES
// -----------------------------------------------------

async function seedRoles() {
  console.log("Seeding administrator roles...");

  for (const roleDefinition of roleDefinitions) {
    const {
      permissionKeys,
      ...roleData
    } = roleDefinition;

    const role = await prisma.role.upsert({
      where: {
        slug: roleData.slug,
      },
      update: {
        name: roleData.name,
        description: roleData.description,
        isSystem: roleData.isSystem,
      },
      create: roleData,
    });

    const rolePermissions = await prisma.permission.findMany({
      where: {
        key: {
          in: permissionKeys,
        },
      },
      select: {
        id: true,
      },
    });

    // Keep each seeded system role aligned with its definition.
    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          roleId: role.id,
        },
      });

      if (rolePermissions.length > 0) {
        await tx.rolePermission.createMany({
          data: rolePermissions.map((permission) => ({
            roleId: role.id,
            permissionId: permission.id,
          })),
          skipDuplicates: true,
        });
      }
    });

    console.log(
      `Seeded role: ${role.name} (${rolePermissions.length} permissions).`
    );
  }

  console.log(`Seeded ${roleDefinitions.length} administrator roles.`);
}

// -----------------------------------------------------
// SEED SUPER ADMINISTRATOR ACCOUNT
// -----------------------------------------------------

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
    throw new Error(
      "Administrator password must be at least 12 characters."
    );
  }

  const role = await prisma.role.findUnique({
    where: {
      slug: "super-administrator",
    },
  });

  if (!role) {
    throw new Error("Super Administrator role was not created.");
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  let adminUserId: string;

  if (admin) {
    adminUserId = admin.id;

    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        name,
        status: "ACTIVE",
        isSuperAdmin: true,
      },
    });

    console.log(
      "Existing administrator found. Password was not changed."
    );
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

  console.log("Super Administrator account and role assigned.");
}

// -----------------------------------------------------
// MAIN
// -----------------------------------------------------

async function main() {
  console.log("Starting LourierPark database seeding...");

  await seedCategories();
  await seedPermissions();
  await seedRoles();
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
