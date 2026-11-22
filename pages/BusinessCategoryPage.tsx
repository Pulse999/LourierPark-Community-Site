
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Store,
  X,
} from "lucide-react";

import { getBusinessCategory } from "../src/data/businesses";
import { getPublishedBusinesses } from "../src/data/businessListings";

export default function BusinessCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const category = categoryId
    ? getBusinessCategory(categoryId)
    : undefined;

  const businesses = useMemo(
    () =>
      getPublishedBusinesses().filter(
        (business) => business.categoryId === categoryId
      ),
    [categoryId]
  );

  // Build filter options from the services actually offered.
  const availableServices = useMemo(
    () =>
      Array.from(
        new Set(businesses.flatMap((business) => business.services))
      ).sort((a, b) => a.localeCompare(b)),
    [businesses]
  );

  // Search and filter the published businesses.
  const filteredBusinesses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return businesses.filter((business) => {
      const searchableText = [
        business.name,
        business.tagline,
        business.description,
        ...business.services,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesService =
        !selectedService ||
        business.services.includes(selectedService);

      return matchesSearch && matchesService;
    });
  }, [businesses, searchTerm, selectedService]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedService
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedService("");
  };

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

              {businesses.length > 0 && (
                <span className="listing-count">
                  {filteredBusinesses.length
                    .toString()
                    .padStart(2, "0")}{" "}
                  OF {businesses.length.toString().padStart(2, "0")}{" "}
                  BUSINESSES
                </span>
              )}
            </div>

            {businesses.length > 0 ? (
              <>
                {/* SEARCH AND FILTER */}
                <div className="business-filter-bar">
                  <div className="business-search-box">
                    <Search size={19} />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search businesses, services..."
                      aria-label="Search businesses"
                    />

                    {searchTerm && (
                      <button
                        type="button"
                        className="business-search-clear"
                        onClick={() => setSearchTerm("")}
                        aria-label="Clear search"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>

                  <div className="business-service-filter">
                    <SlidersHorizontal size={17} />
                    <select
                      value={selectedService}
                      onChange={(event) =>
                        setSelectedService(event.target.value)
                      }
                      aria-label="Filter by service"
                    >
                      <option value="">All services</option>
                      {availableServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="business-filter-reset"
                      onClick={clearFilters}
                    >
                      Clear filters
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* MATCHING BUSINESS CARDS */}
                {filteredBusinesses.length > 0 ? (
                  <div className="business-listing-grid">
                    {filteredBusinesses.map((business) => (
                      <Link
                        to={`/local-businesses/${business.categoryId}/${business.slug}`}
                        className="business-listing-card"
                        key={business.id}
                      >
                        <div className="business-listing-image">
                          <img
                            src={business.coverImage}
                            alt={business.name}
                            loading="lazy"
                          />

                          {business.featured && (
                            <span className="business-featured-label">
                              Featured
                            </span>
                          )}

                          <span className="business-listing-arrow">
                            <ArrowUpRight size={19} />
                          </span>
                        </div>

                        <div className="business-listing-content">
                          <span className="business-listing-category">
                            {category.name}
                          </span>

                          <h3>{business.name}</h3>

                          <p className="business-listing-tagline">
                            {business.tagline}
                          </p>

                          <p className="business-listing-description">
                            {business.description}
                          </p>

                          {business.services.length > 0 && (
                            <div className="business-listing-services">
                              {business.services.slice(0, 3).map((service) => (
                                <span key={service}>{service}</span>
                              ))}
                            </div>
                          )}

                          <span className="business-listing-link">
                            View business profile
                            <ArrowUpRight size={15} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="business-no-results">
                    <div className="business-no-results-icon">
                      <Search size={25} />
                    </div>

                    <h3>No matching businesses found.</h3>

                    <p>
                      Try a different search term or select another
                      service to discover more local businesses.
                    </p>

                    <button
                      type="button"
                      className="business-filter-reset"
                      onClick={clearFilters}
                    >
                      Clear search and filters
                      <X size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* EMPTY STATE */
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
            )}
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
