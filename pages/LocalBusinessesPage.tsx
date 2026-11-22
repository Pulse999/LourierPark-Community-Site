
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Search,
  Store,
  X,
} from "lucide-react";

import { businessCategories } from "../src/data/businesses";

export default function LocalBusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

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
  }, [searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
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
          <span className="eyebrow">
            EXPLORE LOURIERPARK · LOCAL DIRECTORY
          </span>

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

          <a
            href="#business-directory"
            className="button button-gold"
          >
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
            <span className="eyebrow">
              THE LOCAL DIRECTORY
            </span>

            <h2 className="interior-heading">
              Good things are
              <em>closer than you think.</em>
            </h2>
          </div>

          <div className="business-intro-copy">
            <p>
              Our neighbourhood is home to people with skills, ideas and
              businesses worth discovering. This directory is being developed
              to make it easier to find local services and support the people
              behind them.
            </p>

            <span>
              Browse the categories below to find the services you need.
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
              <span className="eyebrow">
                FIND WHAT YOU NEED
              </span>

              <h2 className="interior-heading">
                Browse the
                <em>categories.</em>
              </h2>
            </div>

            <span className="listing-count">
              {filteredCategories.length.toString().padStart(2, "0")}{" "}
              CATEGORIES
            </span>
          </div>

          {/* SEARCH */}
          <div className="business-search-wrap">
            <Search size={19} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for a service, trade or business category..."
              aria-label="Search business categories and services"
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

          {/* CATEGORY GRID */}
          {filteredCategories.length > 0 ? (
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
          ) : (
            <div className="business-empty-state">
              <Search size={28} />

              <h3>No matching categories found</h3>

              <p>
                Try another search term or clear your search to browse
                all categories.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear search
              </button>
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
            <span className="eyebrow">
              ARE YOU A LOCAL BUSINESS OWNER?
            </span>

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

          <Link
            to="/contact"
            className="button button-gold"
          >
            Get your business listed
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
