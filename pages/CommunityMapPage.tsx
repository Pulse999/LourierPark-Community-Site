
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Search,
} from "lucide-react";

const categories = [
  "All places",
  "Community",
  "Education",
  "Faith",
  "Recreation",
  "Local services",
];

const locations = [
  {
    name: "Community centre",
    category: "Community",
    description:
      "Community facility information will be added here.",
    image: "/images/Lourier_Park_Community_Center_Image013.jpg",
  },
  {
    name: "Local school",
    category: "Education",
    description:
      "Verified school details and contact information will appear here.",
    image: "/images/LP-School-1.jpg",
  },
  {
    name: "Place of worship",
    category: "Faith",
    description:
      "Local place of worship information will be added here.",
    image: "/images/LP-Church.jpg",
  },
  {
    name: "Recreation area",
    category: "Recreation",
    description:
      "Information about local outdoor and recreational spaces.",
    image: "/images/LP-Park.jpg",
  },
  {
    name: "Sports facility",
    category: "Recreation",
    description:
      "Sports and activity facility details will appear here.",
    image: "/images/LP-Soccer-ground.jpg",
  },
];

export default function CommunityMapPage() {
  const [activeCategory, setActiveCategory] =
    useState("All places");

  const [search, setSearch] = useState("");

  // Filter locations by category and search term.
  const filteredLocations = locations.filter((location) => {
    const matchesCategory =
      activeCategory === "All places" ||
      location.category === activeCategory;

    const matchesSearch =
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Scroll-triggered reveal animations.
  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>("[data-reveal]");

    document.documentElement.classList.add("has-scroll-reveal");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) =>
        element.classList.add("is-visible")
      );

      return () => {
        document.documentElement.classList.remove(
          "has-scroll-reveal"
        );
      };
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            element.classList.add("is-visible");

            currentObserver.unobserve(element);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();

      document.documentElement.classList.remove(
        "has-scroll-reveal"
      );
    };
  }, []);

  const mapSearchUrl =
    "https://www.openstreetmap.org/search?query=LourierPark%2C%20Bloemfontein%2C%20South%20Africa";

  return (
    <main className="interior-page overflow-hidden bg-[#f7f8f5] text-[#092b40]">

      {/* =========================================
          HERO — CINEMATIC MAP INTRODUCTION
      ========================================= */}

      <section className="interior-hero map-page-hero group relative isolate flex min-h-[620px] items-end overflow-hidden bg-[#092b40]">

        <div className="interior-hero-image absolute inset-0 overflow-hidden">
          <img
            src="/images/LP-Road.jpg"
            alt="A street in the neighbourhood"
            className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
          />
        </div>

        <div className="interior-hero-overlay absolute inset-0" />

        {/* Decorative map grid */}
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
              backgroundSize: "75px 75px",
              maskImage:
                "linear-gradient(to right, transparent, black)",
            }}
          />
        </div>

        <div className="container interior-hero-content relative z-10 mx-auto w-full px-6 pb-24 pt-32 md:px-12 lg:px-20">

          <div data-reveal="up">
            <span className="eyebrow">
              FIND YOUR WAY AROUND
            </span>
          </div>

          <h1 data-reveal="up">
            Your community.
            <br />
            <em>On the map.</em>
          </h1>

          <p
            className="mt-6 max-w-xl"
            data-reveal="up"
          >
            Discover useful places, local facilities and points
            of interest around LourierPark.
          </p>

          <div
            className="mt-10 flex items-center gap-3 text-white/70"
            data-reveal="up"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#eca02c] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#eca02c]" />
            </span>

            <span className="text-xs tracking-[0.15em]">
              DISCOVER YOUR SURROUNDINGS
            </span>
          </div>
        </div>

        <span
          className="interior-hero-index absolute bottom-7 right-6 z-10 md:right-12 lg:right-20"
          data-reveal="left"
        >
          03 / COMMUNITY MAP
        </span>

        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[#eca02c] transition-transform duration-[1800ms] ease-out group-hover:scale-x-100" />
      </section>

      {/* =========================================
          DIRECTORY — SEARCH & FILTER
      ========================================= */}

      <section className="section-pad community-map-page relative overflow-hidden">

        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full border border-[#277a43]/10" />

        <div className="container relative z-10 mx-auto">

          <div
            className="section-topline"
            data-reveal="up"
          >
            <div>
              <span className="eyebrow">
                LOCAL DIRECTORY
              </span>

              <h2 className="interior-heading">
                Find a place.
                <em> Find your way.</em>
              </h2>
            </div>

            <span className="listing-count">
              COMMUNITY PLACE FINDER
            </span>
          </div>

          {/* SEARCH */}
          <div
            className="map-search group transition-all duration-500 focus-within:-translate-y-1 focus-within:shadow-xl"
            data-reveal="up"
          >
            <Search
              size={19}
              className="shrink-0 transition-colors duration-300 group-focus-within:text-[#277a43]"
            />

            <input
              type="search"
              placeholder="Search places and facilities..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search community places"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mr-2 text-xs text-[#277a43] transition-colors hover:text-[#092b40]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* CATEGORY FILTERS */}
          <div
            className="map-category-filters"
            data-reveal="up"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`transition-all duration-300 hover:-translate-y-1 ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
                style={{
                  transitionDelay: `${index * 35}ms`,
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* =========================================
              DIRECTORY AND MAP LAYOUT
          ========================================= */}

          <div className="map-directory-layout">

            {/* LOCATION RESULTS */}
            <div
              className="map-directory-list"
              data-reveal="left"
            >

              <div className="map-results-heading">
                <span>PLACES & FACILITIES</span>

                <span className="tabular-nums">
                  {filteredLocations.length} RESULTS
                </span>
              </div>

              <div className="space-y-3">

                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location, index) => (
                    <article
                      className="map-location-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                      key={location.name}
                      style={{
                        animation: "mapCardEnter 650ms cubic-bezier(.22,1,.36,1) both",
                        animationDelay: `${index * 90}ms`,
                      }}
                    >
                      <div className="relative shrink-0 overflow-hidden">
                        <img
                          src={location.image}
                          alt=""
                          loading="lazy"
                          className="transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>

                      <div className="min-w-0">
                        <span className="eyebrow">
                          {location.category}
                        </span>

                        <h3 className="transition-colors duration-300 group-hover:text-[#277a43]">
                          {location.name}
                        </h3>

                        <p>{location.description}</p>

                        <span className="map-location-status">
                          <MapPin size={13} />
                          Location details to be verified
                        </span>
                      </div>

                      <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-[#eca02c] transition-all duration-700 group-hover:w-full" />
                    </article>
                  ))
                ) : (
                  <div
                    className="map-empty animate-[mapCardEnter_400ms_ease-out_both]"
                  >
                    <Search
                      size={25}
                      className="mx-auto mb-4 text-[#277a43]/50"
                    />

                    <p>
                      No matching places found. Try another
                      search or category.
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* MAP PREVIEW */}
            <div
              className="map-placeholder group relative overflow-hidden"
              data-reveal="right"
            >

              <div className="map-placeholder-art relative overflow-hidden">

                {/* Animated map grid */}
                <div className="pointer-events-none absolute inset-0 opacity-30">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(39,122,67,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(39,122,67,.15) 1px, transparent 1px)",
                      backgroundSize: "38px 38px",
                    }}
                  />
                </div>

                {/* Decorative road paths */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-[12%] top-[-15%] h-[130%] w-8 rotate-[32deg] border-x border-[#277a43]/15 bg-white/30" />

                  <div className="absolute right-[20%] top-[-20%] h-[140%] w-10 rotate-[-28deg] border-x border-[#277a43]/15 bg-white/30" />

                  <div className="absolute left-[-10%] top-[52%] h-8 w-[120%] rotate-[-12deg] border-y border-[#277a43]/15 bg-white/30" />

                  <div className="absolute left-[-10%] top-[22%] h-6 w-[120%] rotate-[17deg] border-y border-[#277a43]/15 bg-white/30" />
                </div>

                {/* Map location marker */}
                <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">

                  <div className="relative flex h-24 w-24 items-center justify-center">

                    <span className="absolute inset-0 animate-ping rounded-full border border-[#277a43]/50" />

                    <span className="absolute inset-3 animate-pulse rounded-full bg-[#277a43]/10" />

                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#277a43] text-white shadow-xl transition-transform duration-500 group-hover:scale-110">
                      <MapPin size={25} />
                    </span>
                  </div>

                  <span className="mt-2 bg-[#092b40] px-4 py-2 text-[9px] font-bold tracking-[0.18em] text-white shadow-lg">
                    LOURIERPARK
                  </span>

                  <span className="mt-2 text-[8px] font-bold tracking-[0.2em] text-[#092b40]/60">
                    INTERACTIVE MAP COMING SOON
                  </span>
                </div>

                {/* Decorative map coordinates */}
                <span className="absolute left-5 top-5 text-[8px] tracking-[0.15em] text-[#092b40]/45">
                  LP / 01
                </span>

                <span className="absolute bottom-5 right-5 text-[8px] tracking-[0.15em] text-[#092b40]/45">
                  FREE STATE · SA
                </span>

              </div>

              <div className="map-placeholder-footer">
                <div>
                  <strong>Explore the area</strong>

                  <p>
                    Open a map search for LourierPark while
                    verified map locations are being prepared.
                  </p>
                </div>

                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LourierPark in OpenStreetMap"
                  className="transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:bg-[#277a43] hover:text-white"
                >
                  <ArrowUpRight size={19} />
                </a>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <p
            className="map-disclaimer"
            data-reveal="up"
          >
            Place descriptions, exact positions and map boundaries
            are placeholders until confirmed. This page is not yet
            a verified geographic directory.
          </p>

        </div>
      </section>
    </main>
  );
}
