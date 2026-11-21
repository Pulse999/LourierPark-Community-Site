
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const places = [
  {
    title: "Community spaces",
    category: "PLACES TO CONNECT",
    description:
      "A closer look at spaces where residents can meet, participate and spend time together.",
    image: "/images/Lourier_Park_Community_Center_Image010.jpg",
  },
  {
    title: "Education",
    category: "SCHOOLS & LEARNING",
    description:
      "Discover educational facilities and learning institutions in and around the neighbourhood.",
    image: "/images/LP-School-1.jpg",
  },
  {
    title: "Faith & worship",
    category: "COMMUNITY INSTITUTIONS",
    description:
      "A directory of local places of worship and their community activities.",
    image: "/images/LP-Church.jpg",
  },
  {
    title: "Parks & recreation",
    category: "OUTDOORS",
    description:
      "Explore outdoor spaces, recreational areas and places to enjoy the neighbourhood.",
    image: "/images/LP-Park.jpg",
  },
  {
    title: "Sport & activities",
    category: "ACTIVE COMMUNITY",
    description:
      "Spaces for sport, recreation and activities that bring people together.",
    image: "/images/LP-Soccer-ground.jpg",
  },
  {
    title: "Local surroundings",
    category: "EVERYDAY LOURIERPARK",
    description:
      "Explore streets, familiar landmarks and the everyday character of the area.",
    image: "/images/LP-Road.jpg",
  },
];

export default function NeighbourhoodPage() {
  // Scroll-triggered animations
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

  return (
    <main className="interior-page overflow-hidden bg-[#f7f8f5] text-[#092b40]">
      {/* =========================================
          HERO — CINEMATIC IMAGE REVEAL
      ========================================= */}

      <section className="interior-hero neighbourhood-hero group relative isolate flex min-h-[620px] items-end overflow-hidden bg-[#092b40]">
        <div className="interior-hero-image absolute inset-0 overflow-hidden">
          <img
            src="/images/LP-Outer.jpg"
            alt="LourierPark surroundings"
            className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
          />
        </div>

        <div className="interior-hero-overlay absolute inset-0" />

        <div className="interior-hero-content container relative z-10 mx-auto w-full px-6 pb-24 pt-32 md:px-12 lg:px-20">
          <div data-reveal="up">
            <span className="eyebrow">
              EXPLORE THE AREA
            </span>
          </div>

          <h1 data-reveal="up">
            Get to know
            <br />
            <em>your neighbourhood.</em>
          </h1>

          <p
            className="mt-6 max-w-xl"
            data-reveal="up"
          >
            From familiar streets to local facilities, discover
            the places that form part of everyday life in
            LourierPark.
          </p>

          <div data-reveal="up">
            <Link
              to="/map"
              className="button button-gold mt-9 inline-flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Explore the community map
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        <span
          className="interior-hero-index absolute bottom-7 right-6 z-10 md:right-12 lg:right-20"
          data-reveal="left"
        >
          02 / OUR NEIGHBOURHOOD
        </span>

        <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-[#eca02c] transition-transform duration-[1800ms] ease-out group-hover:scale-x-100" />
      </section>

      {/* =========================================
          INTRODUCTION — SPLIT REVEAL
      ========================================= */}

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-2 lg:gap-24">
          <div data-reveal="left">
            <span className="eyebrow">
              AROUND OUR NEIGHBOURHOOD
            </span>

            <h2 className="interior-heading mt-5 max-w-xl">
              Familiar places.
              <em> Shared spaces.</em>
            </h2>

            <div className="mt-8 h-px w-20 origin-left bg-[#eca02c] transition-all duration-700 hover:w-40" />
          </div>

          <div
            className="interior-copy"
            data-reveal="right"
          >
            <p className="lead">
              A neighbourhood is more than its streets. It is
              the places people visit, the services they use
              and the spaces they share.
            </p>

            <p className="mt-5">
              This guide will bring together useful
              information about LourierPark's facilities,
              landmarks and surroundings. Listings will be
              expanded as details are confirmed.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          PLACES — STAGGERED CARD REVEALS
      ========================================= */}

      <section className="neighbourhood-listing-section section-pad relative overflow-hidden bg-[#e9efea]">
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full border border-[#277a43]/10" />
        <div className="pointer-events-none absolute -right-12 top-22 h-56 w-56 rounded-full border border-[#277a43]/10" />

        <div className="container relative z-10 mx-auto">
          <div
            className="section-topline"
            data-reveal="up"
          >
            <div>
              <span className="eyebrow">
                DISCOVER LOCAL PLACES
              </span>

              <h2 className="interior-heading">
                Explore what’s
                <em> around you.</em>
              </h2>
            </div>

            <span className="listing-count">
              06 PLACE CATEGORIES
            </span>
          </div>

          <div className="neighbourhood-grid">
            {places.map((place, index) => (
              <article
                className="neighbourhood-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                key={place.title}
                data-reveal="up"
                style={{
                  transitionDelay: `${index * 110}ms`,
                }}
              >
                <div className="neighbourhood-card-image relative overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-[#092b40]/0 transition-colors duration-500 group-hover:bg-[#092b40]/15" />

                  <span className="transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eca02c] group-hover:text-[#092b40]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="neighbourhood-card-copy relative">
                  <span className="eyebrow">
                    {place.category}
                  </span>

                  <h3 className="transition-colors duration-300 group-hover:text-[#277a43]">
                    {place.title}
                  </h3>

                  <p>{place.description}</p>

                  <Link
                    to="/map"
                    className="text-link inline-flex items-center gap-2"
                  >
                    View on community map

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>

                  <div className="mt-5 h-px w-0 bg-[#eca02c] transition-all duration-700 group-hover:w-full" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURE — IMAGE AND CONTENT REVEAL
      ========================================= */}

      <section className="neighbourhood-feature group relative overflow-hidden">
        <div
          className="neighbourhood-feature-image overflow-hidden"
          data-reveal="left"
        >
          <img
            src="/images/LP-field.jpg"
            alt="Open space in the area"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
          />
        </div>

        <div
          className="neighbourhood-feature-copy"
          data-reveal="right"
        >
          <span className="eyebrow">
            A CLOSER LOOK
          </span>

          <h2>
            There is more
            <br />
            to discover.
          </h2>

          <p>
            Help build a useful neighbourhood guide. Verified
            local information, business details and points of
            interest will be added as the directory grows.
          </p>

          <Link
            to="/contact"
            className="button button-gold inline-flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Suggest a local place

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
