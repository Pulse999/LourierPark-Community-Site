import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Store,
  X,
} from "lucide-react";

import {
  businessCategories,
  getBusinessCategory,
} from "../src/data/businesses";
import { getPublishedBusinesses } from "../src/data/businessListings";

export default function LocalBusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const businesses = useMemo(() => getPublishedBusinesses(), []);

  const query = searchTerm.trim().toLowerCase();

  // Category cards can also be searched.
  const filteredCategories = useMemo(() => {
    return businessCategories.filter((category) => {
      const searchableText = [
        category.name,
        category.description,
        ...category.services,
      ]
        .join(" ")
        .toLowerCase();

      return !query || searchableText.includes(query);
    });
  }, [query]);

  // Only show services currently offered by published businesses.

  const availableServices = useMemo(() => {
    const relevantBusinesses = selectedCategory
      ? businesses.filter(
          (business) => business.categoryId === selectedCategory,
        )
      : businesses;

    return Array.from(
      new Set(relevantBusinesses.flatMap((business) => business.services)),
    ).sort((a, b) => a.localeCompare(b));
  }, [businesses, selectedCategory]);

  // Search across all published businesses and apply filters.
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const category = getBusinessCategory(business.categoryId);

      const searchableText = [
        business.name,
        business.tagline,
        business.description,
        category?.name ?? "",
        category?.description ?? "",
        ...business.services,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesCategory =
        !selectedCategory || business.categoryId === selectedCategory;

      const matchesService =
        !selectedService || business.services.includes(selectedService);

      const matchesFeatured = !featuredOnly || business.featured;

      return (
        matchesSearch && matchesCategory && matchesService && matchesFeatured
      );
    });
  }, [businesses, query, selectedCategory, selectedService, featuredOnly]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedCategory || selectedService || featuredOnly,
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedService("");
    setFeaturedOnly(false);
  };

  return (
    <div className="interior-page business-page">
      {/* HERO */}
      <section className="interior-hero business-hero">
        <div className="interior-hero-image">
          <img
            src="/images/Local_buisness_hero.jpg"
            alt="Local businesses in the LourierPark community"
          />
        </div>

        <div className="interior-hero-overlay" />

        <div className="container interior-hero-content">
          <span className="eyebrow">EXPLORE LOURIERPARK · LOCAL DIRECTORY</span>

          <h1>
            Discover local.
            <br />
            <em>Support local.</em>
          </h1>

          <p>
            From everyday essentials to skilled services, discover the
            independent businesses and service providers that make our
            neighbourhood work.
          </p>

          <a href="#business-directory" className="button button-gold">
            Explore the directory
            <ArrowDown size={16} />
          </a>
        </div>

        <div className="interior-hero-index">
          LOCAL BUSINESSES · LOURIERPARK
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="business-intro-section section-pad">
        <div className="container business-intro-layout">
          <div>
            <span className="eyebrow">THE LOCAL DIRECTORY</span>

            <h2 className="interior-heading">
              Good things are
              <em>closer than you think.</em>
            </h2>
          </div>

          <div className="business-intro-copy">
            <p>
              Our neighbourhood is home to people with skills, ideas and
              businesses worth discovering. This directory is being developed to
              make it easier to find local services and support the people
              behind them.
            </p>

            <span>
              Browse the categories below or search for a business directly.
            </span>
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section
        className="business-directory-section section-pad"
        id="business-directory"
      >
        <div className="container">
          {/* DIRECTORY HEADING */}
          <div className="section-topline business-directory-heading">
            <div>
              <span className="eyebrow">FIND WHAT YOU NEED</span>

              <h2 className="interior-heading">
                Browse the
                <em>directory.</em>
              </h2>

              <p>
                Search local businesses, explore services and discover people
                working in your neighbourhood.
              </p>
            </div>

            <span className="listing-count">
              {filteredBusinesses.length.toString().padStart(2, "0")} OF{" "}
              {businesses.length.toString().padStart(2, "0")} BUSINESSES
            </span>
          </div>

          {/* DIRECTORY SEARCH */}
          <div className="business-search-wrap">
            <Search size={19} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search business names, services or categories..."
              aria-label="Search all local businesses"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* DIRECTORY FILTERS */}
          <div className="business-directory-filters">
            <label className="business-directory-select">
              <SlidersHorizontal size={17} />

              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setSelectedService("");
                }}
                aria-label="Filter by business category"
              >
                <option value="">All categories</option>

                {businessCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="business-directory-select">
              <Store size={17} />

              <select
                value={selectedService}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setSelectedService("");
                }}
                aria-label="Filter by service"
              >
                <option value="">All services</option>

                {availableServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label className="business-featured-filter">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setSelectedService("");
                }}
              />
              <span>Featured businesses only</span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                className="business-directory-clear"
                onClick={clearFilters}
              >
                Clear filters
                <X size={15} />
              </button>
            )}
          </div>

          {/* CATEGORY GRID */}
          {filteredCategories.length > 0 && (
            <div className="business-directory-categories">
              <div className="business-directory-subheading">
                <div>
                  <span className="eyebrow">EXPLORE BY CATEGORY</span>
                  <h3>
                    Find a service <em>nearby.</em>
                  </h3>
                </div>

                <span className="listing-count">
                  {filteredCategories.length.toString().padStart(2, "0")}{" "}
                  CATEGORIES
                </span>
              </div>

              <div className="business-category-grid">
                {filteredCategories.map((category, index) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      to={`/local-businesses/${category.id}`}
                      key={category.id}
                      className="business-category-card"
                      style={
                        {
                          "--business-delay": `${index * 45}ms`,
                        } as CSSProperties
                      }
                    >
                      <span className="business-card-top">
                        <span className="business-category-icon">
                          <Icon size={23} strokeWidth={1.6} />
                        </span>

                        <ArrowUpRight
                          className="business-category-arrow"
                          size={19}
                        />
                      </span>

                      <span className="business-category-copy">
                        <strong>{category.name}</strong>
                        <small>{category.description}</small>
                      </span>

                      <span className="business-card-footer">
                        <span>EXPLORE SERVICES</span>
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* PUBLISHED BUSINESS RESULTS */}
          <div className="business-directory-results">
            <div className="business-directory-subheading">
              <div>
                <span className="eyebrow">THE LOCAL DIRECTORY</span>
                <h3>
                  Local businesses <em>worth discovering.</em>
                </h3>
              </div>

              <span className="listing-count">
                {filteredBusinesses.length.toString().padStart(2, "0")} RESULTS
              </span>
            </div>

            {filteredBusinesses.length > 0 ? (
              <div className="business-listing-grid">
                {filteredBusinesses.map((business) => {
                  const category = getBusinessCategory(business.categoryId);

                  return (
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
                          {category?.name ?? "Local business"}
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
                  );
                })}
              </div>
            ) : (
              <div className="business-no-results">
                <div className="business-no-results-icon">
                  <Search size={25} />
                </div>

                <h3>No matching businesses found.</h3>

                <p>
                  Try another search term or adjust your filters to discover
                  more local businesses.
                </p>

                <button
                  type="button"
                  className="business-directory-clear"
                  onClick={clearFilters}
                >
                  Clear search and filters
                  <X size={15} />
                </button>
              </div>
            )}
          </div>

          {/* NO CATEGORY MATCHES */}
          {filteredCategories.length === 0 && query && (
            <div className="business-no-category-match">
              <p>
                No categories match your search. You can still browse the
                business results above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BUSINESS OWNER CTA */}
      <section className="business-owner-section">
        <div className="container business-owner-inner">
          <div className="business-owner-icon">
            <Store size={28} strokeWidth={1.5} />
          </div>

          <div className="business-owner-copy">
            <span className="eyebrow">ARE YOU A LOCAL BUSINESS OWNER?</span>

            <h2>
              Your business
              <em>belongs here.</em>
            </h2>

            <p>
              Help your neighbours discover what you offer. We're building a
              directory that gives local businesses and independent service
              providers a place to be seen.
            </p>
          </div>

          <Link to="/contact" className="button button-gold">
            Get your business listed
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
