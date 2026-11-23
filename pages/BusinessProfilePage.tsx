
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Store,
  X,
} from "lucide-react";

import { getBusinessBySlug } from "../src/data/businessListings";
import { getBusinessCategory } from "../src/data/businesses";

export default function BusinessProfilePage() {
  const { categoryId, businessSlug } = useParams<{
    categoryId: string;
    businessSlug: string;
  }>();

  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(
  null
);

const closeGallery = () => setActiveImageIndex(null);

const showPreviousImage = () => {
  if (!business || activeImageIndex === null) return;

  setActiveImageIndex(
    (activeImageIndex - 1 + business.gallery.length) %
      business.gallery.length
  );
};

const showNextImage = () => {
  if (!business || activeImageIndex === null) return;

  setActiveImageIndex(
    (activeImageIndex + 1) % business.gallery.length
  );
};

useEffect(() => {
  if (activeImageIndex === null) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
  };

  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [activeImageIndex]);

  const business =
    businessSlug && categoryId
      ? getBusinessBySlug(businessSlug, categoryId)
      : undefined;

  const category = business
    ? getBusinessCategory(business.categoryId)
    : undefined;

  // Only published businesses are accessible publicly.
  if (!business || business.status !== "published" || !category) {
    return (
      <main className="interior-page business-profile-page">
        <section className="business-profile-not-found section-pad">
          <div className="container">
            <Store size={36} />

            <span className="eyebrow">LOCAL DIRECTORY</span>

            <h1>Business not found.</h1>

            <p>
              This business listing is unavailable or has not yet
              been published.
            </p>

            <Link
              to="/local-businesses"
              className="button button-gold"
            >
              <ArrowLeft size={16} />
              Back to directory
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const hasContactDetails =
    business.phone ||
    business.whatsapp ||
    business.email ||
    business.website;

  return (
    <main className="interior-page business-profile-page">

      {/* COVER IMAGE */}
      <section className="business-profile-hero">
        <img
          src={business.coverImage}
          alt={`${business.name} cover`}
          className="business-profile-cover-image"
        />

        <div className="business-profile-cover-overlay" />

        <div className="container business-profile-hero-content">
          <nav
            className="business-breadcrumb business-profile-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/local-businesses">Local Businesses</Link>
            <span>/</span>
            <Link to={`/local-businesses/${category.id}`}>
              {category.name}
            </Link>
            <span>/</span>
            <span aria-current="page">{business.name}</span>
          </nav>

          <span className="eyebrow">
            {category.name.toUpperCase()} · LOURIERPARK
          </span>

          <h1>{business.name}</h1>

          <p>{business.tagline}</p>
        </div>
      </section>

      {/* PROFILE CONTENT */}
      <section className="business-profile-content section-pad">
        <div className="container">

          <Link
            to={`/local-businesses/${category.id}`}
            className="business-back-link"
          >
            <ArrowLeft size={16} />
            Back to {category.name}
          </Link>

          <div className="business-profile-layout">

            {/* MAIN COLUMN */}
            <div className="business-profile-main">

              {/* ABOUT */}
              <section className="business-profile-section">
                <span className="eyebrow">GET TO KNOW THEM</span>

                <h2>
                  About the <em>business.</em>
                </h2>

                <p>{business.description}</p>
              </section>

              {/* SERVICES */}
              <section className="business-profile-section">
                <span className="eyebrow">WHAT THEY OFFER</span>

                <h2>
                  Products & <em>services.</em>
                </h2>

                <div className="business-profile-services">
                  {business.services.map((service) => (
                    <div key={service}>
                      <span />
                      {service}
                    </div>
                  ))}
                </div>
              </section>

              {/* GALLERY */}
              {business.gallery.length > 0 && (
                <section className="business-profile-section">
                  <span className="eyebrow">A CLOSER LOOK</span>

                  <h2>
                    Business <em>gallery.</em>
                  </h2>

                  <div className="business-profile-gallery">
                    {business.gallery.map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`${business.name} gallery ${index + 1}`}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="business-profile-sidebar">

              {/* CONTACT */}
              <div className="business-profile-card">
                <span className="eyebrow">GET IN TOUCH</span>

                <h3>Contact details</h3>

                {hasContactDetails ? (
                  <div className="business-profile-contact-list">
                    {business.phone && (
                      <a href={`tel:${business.phone}`}>
                        <Phone size={17} />
                        {business.phone}
                      </a>
                    )}

                    {business.whatsapp && (
                      <a
                        href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Phone size={17} />
                        WhatsApp
                        <ArrowUpRight size={14} />
                      </a>
                    )}

                    {business.email && (
                      <a href={`mailto:${business.email}`}>
                        <Mail size={17} />
                        {business.email}
                      </a>
                    )}

                    {business.website && (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Globe size={17} />
                        Visit website
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p>Contact information will be added soon.</p>
                )}
              </div>

              {/* LOCATION */}
              {business.address && (
                <div className="business-profile-card">
                  <span className="eyebrow">FIND THEM</span>

                  <h3>Location</h3>

                  <div className="business-profile-detail">
                    <MapPin size={18} />
                    <span>{business.address}</span>
                  </div>
                </div>
              )}

              {/* OPENING HOURS */}
              {business.openingHours &&
                business.openingHours.length > 0 && (
                  <div className="business-profile-card">
                    <span className="eyebrow">WHEN TO VISIT</span>

                    <h3>Opening hours</h3>

                    <div className="business-profile-hours-heading">
                      <Clock3 size={17} />
                      <span>Operating hours</span>
                    </div>

                    <div className="business-profile-hours">
                      {business.openingHours.map((item) => (
                        <div key={item.day}>
                          <span>{item.day}</span>
                          <span className={item.closed ? "is-closed" : ""}>
                            {item.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* SOCIAL LINKS */}
              {(business.socialLinks?.facebook ||
                business.socialLinks?.instagram) && (
                <div className="business-profile-card">
                  <span className="eyebrow">FOLLOW ALONG</span>

                  <h3>Social media</h3>

                  <div className="business-profile-socials">
                    {business.socialLinks.facebook && (
                      <a
                        href={business.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook"
                      >
                        <Facebook size={19} />
                      </a>
                    )}

                    {business.socialLinks.instagram && (
                      <a
                        href={business.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram size={19} />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </aside>
          </div>

          {/* CATEGORY RETURN */}
          <div className="business-profile-return">
            <Link
              to={`/local-businesses/${category.id}`}
              className="business-text-link"
            >
              <ArrowLeft size={15} />
              Explore more in {category.name}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
