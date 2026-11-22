
export type BusinessStatus = "draft" | "published" | "unpublished" | "archived";

export type Business = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  tagline: string;
  description: string;
  coverImage: string;
  logo?: string;
  services: string[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  openingHours?: {
    day: string;
    hours: string;
    closed?: boolean;
  }[];
  gallery: string[];
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
  featured: boolean;
  status: BusinessStatus;
};

export const businessListings: Business[] = [
  {
    id: "demo-001",
    name: "Mama's Kitchen",
    slug: "mamas-kitchen",
    categoryId: "food",
    tagline: "A taste of home, made with care.",
    description:
      "This is a demonstration business profile showing how a local food business could present its story, offerings and contact information on the LourierPark directory. This is sample content and does not represent a verified local business.",
    coverImage: "/images/Local_buisness_hero.jpg",
    services: [
      "Homemade meals",
      "Takeaway orders",
      "Family meals",
      "Special occasion catering",
    ],
    phone: "",
    whatsapp: "",
    email: "",
    address: "LourierPark, Bloemfontein",
    openingHours: [
      { day: "Monday", hours: "09:00 – 17:00" },
      { day: "Tuesday", hours: "09:00 – 17:00" },
      { day: "Wednesday", hours: "09:00 – 17:00" },
      { day: "Thursday", hours: "09:00 – 17:00" },
      { day: "Friday", hours: "09:00 – 17:00" },
      { day: "Saturday", hours: "09:00 – 14:00" },
      { day: "Sunday", hours: "Closed", closed: true },
    ],
    gallery: [
      "/images/Local_buisness_hero.jpg",
      "/images/Lourier_Park_Community_Center_Image016.jpg",
      "/images/LP-Park.jpg",
    ],
    featured: true,
    status: "draft",
  },
];

export const getBusinessBySlug = (
  slug: string,
  categoryId?: string
) =>
  businessListings.find(
    (business) =>
      business.slug === slug &&
      (!categoryId || business.categoryId === categoryId)
  );

export const getPublishedBusinesses = () =>
  businessListings.filter(
    (business) => business.status === "published"
  );

export const getFeaturedBusinesses = () =>
  businessListings.filter(
    (business) =>
      business.status === "published" && business.featured
  );
