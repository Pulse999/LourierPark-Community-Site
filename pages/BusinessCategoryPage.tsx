
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Store,
} from "lucide-react";

import { getBusinessCategory } from "../src/data/businesses";

export default function BusinessCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = categoryId
    ? getBusinessCategory(categoryId)
    : undefined;

  if (!category) {
    return (
      <main className="interior-page business-category-page">
        <section className="business-category-not-found section-pad">
          <div className="container">
            <span className="eyebrow">LOCAL DIRECTORY</span>
            <h1>Category not found.</h1>
            <p>
              We couldn't find the category you're looking for.
              Browse the directory to explore all available categories.
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

  const CategoryIcon = category.icon;

  return (
    <main className="interior-page business-category-page">
      <section className="business-category-section section-pad">
        <div className="container">

          {/* BREADCRUMB */}
          <nav
            className="business-breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/local-businesses">Local Businesses</Link>
            <span>/</span>
            <span aria-current="page">{category.name}</span>
          </nav>

          {/* CATEGORY HEADER */}
          <div className="business-category-header">
            <Link
              to="/local-businesses"
              className="business-back-link"
            >
              <ArrowLeft size={16} />
              Back to all categories
            </Link>

            <div className="business-category-header-content">
              <div className="business-category-large-icon">
                <CategoryIcon size={30} strokeWidth={1.5} />
              </div>

              <span className="eyebrow">
                EXPLORE LOCAL BUSINESSES
              </span>

              <h1>
                {category.name}
                <em>.</em>
              </h1>

              <p>{category.description}</p>
            </div>
          </div>

          {/* CATEGORY SERVICES */}
          <section className="business-category-services">
            <div className="business-category-section-heading">
              <div>
                <span className="eyebrow">
                  WHAT YOU CAN FIND
                </span>
                <h2>
                  Services in this <em>category.</em>
                </h2>
              </div>

              <span className="listing-count">
                {category.services.length
                  .toString()
                  .padStart(2, "0")} SERVICES
              </span>
            </div>

            <div className="business-category-service-grid">
              {category.services.map((service) => (
                <div
                  className="business-category-service"
                  key={service}
                >
                  <span />
                  {service}
                </div>
              ))}
            </div>
          </section>

          {/* BUSINESS LISTINGS */}
          <section className="business-category-listings">
            <div className="business-category-section-heading">
              <div>
                <span className="eyebrow">
                  THE LOCAL DIRECTORY
                </span>
                <h2>
                  Businesses in <em>LourierPark.</em>
                </h2>
                <p>
                  Discover local people and businesses offering
                  services in your neighbourhood.
                </p>
              </div>
            </div>

            {/* EMPTY STATE — UNTIL BUSINESSES ARE ADDED */}
            <div className="business-category-empty">
              <div className="business-category-empty-icon">
                <Store size={30} strokeWidth={1.5} />
              </div>

              <span className="eyebrow">
                GROWING OUR DIRECTORY
              </span>

              <h3>
                Good things are <em>coming.</em>
              </h3>

              <p>
                We haven't added any approved businesses to this
                category just yet. We're working on connecting
                residents with the talented people and services
                in LourierPark.
              </p>

              <div className="business-category-empty-actions">
                <Link
                  to="/contact"
                  className="button button-gold"
                >
                  Suggest a local business
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/local-businesses"
                  className="business-text-link"
                >
                  Explore other categories
                </Link>
              </div>
            </div>
          </section>

          {/* LOCATION NOTE */}
          <div className="business-category-location-note">
            <MapPin size={17} />
            <span>
              Supporting independent businesses in LourierPark,
              Bloemfontein, Free State.
            </span>
          </div>

        </div>
      </section>
    </main>
  );
}
