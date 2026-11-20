import { useState } from "react";
import { ArrowUpRight, MapPin, Search } from "lucide-react";

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
    description: "Community facility information will be added here.",
    image: "/images/Lourier_Park_Community_Center_Image013.jpg",
  },
  {
    name: "Local school",
    category: "Education",
    description: "Verified school details and contact information will appear here.",
    image: "/images/LP-School-1.jpg",
  },
  {
    name: "Place of worship",
    category: "Faith",
    description: "Local place of worship information will be added here.",
    image: "/images/LP-Church.jpg",
  },
  {
    name: "Recreation area",
    category: "Recreation",
    description: "Information about local outdoor and recreational spaces.",
    image: "/images/LP-Park.jpg",
  },
  {
    name: "Sports facility",
    category: "Recreation",
    description: "Sports and activity facility details will appear here.",
    image: "/images/LP-Soccer-ground.jpg",
  },
];

export default function CommunityMapPage() {
  const [activeCategory, setActiveCategory] = useState("All places");
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter((location) => {
    const matchesCategory =
      activeCategory === "All places" ||
      location.category === activeCategory;

    const matchesSearch =
      location.name.toLowerCase().includes(search.toLowerCase()) ||
      location.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const mapSearchUrl =
    "https://www.openstreetmap.org/search?query=LourierPark%2C%20Bloemfontein%2C%20South%20Africa";

  return (
    <main className="interior-page">
      <section className="interior-hero map-page-hero">
        <div className="interior-hero-image">
          <img src="/images/LP-Road.jpg" alt="A street in the neighbourhood" />
        </div>

        <div className="interior-hero-overlay" />

        <div className="container interior-hero-content">
          <span className="eyebrow">FIND YOUR WAY AROUND</span>
          <h1>
            Your community.
            <br />
            <em>On the map.</em>
          </h1>
          <p>
            Discover useful places, local facilities and points of interest
            around LourierPark.
          </p>
        </div>

        <span className="interior-hero-index">03 / COMMUNITY MAP</span>
      </section>

      <section className="section-pad community-map-page">
        <div className="container">
          <div className="section-topline">
            <div>
              <span className="eyebrow">LOCAL DIRECTORY</span>
              <h2 className="interior-heading">
                Find a place.
                <em> Find your way.</em>
              </h2>
            </div>
            <span className="listing-count">COMMUNITY PLACE FINDER</span>
          </div>

          <div className="map-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search places and facilities..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search community places"
            />
          </div>

          <div className="map-category-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category ? "active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="map-directory-layout">
            <div className="map-directory-list">
              <div className="map-results-heading">
                <span>PLACES & FACILITIES</span>
                <span>{filteredLocations.length} RESULTS</span>
              </div>

              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <article className="map-location-card" key={location.name}>
                    <img src={location.image} alt="" loading="lazy" />

                    <div>
                      <span className="eyebrow">{location.category}</span>
                      <h3>{location.name}</h3>
                      <p>{location.description}</p>
                      <span className="map-location-status">
                        <MapPin size={13} /> Location details to be verified
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="map-empty">
                  No matching places found. Try another search or category.
                </p>
              )}
            </div>

            <div className="map-placeholder">
              <div className="map-placeholder-art">
                <span className="map-placeholder-pin">
                  <MapPin size={25} />
                </span>
                <span className="map-placeholder-label">LOURierPARK</span>
                <span className="map-placeholder-subtitle">
                  INTERACTIVE MAP COMING SOON
                </span>
              </div>

              <div className="map-placeholder-footer">
                <div>
                  <strong>Explore the area</strong>
                  <p>
                    Open a map search for LourierPark while verified map
                    locations are being prepared.
                  </p>
                </div>

                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open LourierPark in OpenStreetMap"
                >
                  <ArrowUpRight size={19} />
                </a>
              </div>
            </div>
          </div>

          <p className="map-disclaimer">
            Place descriptions, exact positions and map boundaries are
            placeholders until confirmed. This page is not yet a verified
            geographic directory.
          </p>
        </div>
      </section>
    </main>
  );
}