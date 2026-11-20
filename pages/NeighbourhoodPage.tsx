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
  return (
    <main className="interior-page">
      <section className="interior-hero neighbourhood-hero">
        <div className="interior-hero-image">
          <img src="/images/LP-Outer.jpg" alt="LourierPark surroundings" />
        </div>

        <div className="interior-hero-overlay" />

        <div className="container interior-hero-content">
          <span className="eyebrow">EXPLORE THE AREA</span>

          <h1>
            Get to know
            <br />
            <em>your neighbourhood.</em>
          </h1>

          <p>
            From familiar streets to local facilities, discover the places
            that form part of everyday life in LourierPark.
          </p>

          <Link to="/map" className="button button-gold">
            Explore the community map <ArrowUpRight size={17} />
          </Link>
        </div>

        <span className="interior-hero-index">02 / OUR NEIGHBOURHOOD</span>
      </section>

      <section className="section-pad">
        <div className="container neighbourhood-intro">
          <div>
            <span className="eyebrow">AROUND OUR NEIGHBOURHOOD</span>
            <h2 className="interior-heading">
              Familiar places.
              <em> Shared spaces.</em>
            </h2>
          </div>

          <div className="interior-copy">
            <p className="lead">
              A neighbourhood is more than its streets. It is the places
              people visit, the services they use and the spaces they share.
            </p>
            <p>
              This guide will bring together useful information about
              LourierPark's facilities, landmarks and surroundings. Listings
              will be expanded as details are confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="neighbourhood-listing-section section-pad">
        <div className="container">
          <div className="section-topline">
            <div>
              <span className="eyebrow">DISCOVER LOCAL PLACES</span>
              <h2 className="interior-heading">
                Explore what’s
                <em> around you.</em>
              </h2>
            </div>

            <span className="listing-count">06 PLACE CATEGORIES</span>
          </div>

          <div className="neighbourhood-grid">
            {places.map((place, index) => (
              <article className="neighbourhood-card" key={place.title}>
                <div className="neighbourhood-card-image">
                  <img src={place.image} alt={place.title} loading="lazy" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="neighbourhood-card-copy">
                  <span className="eyebrow">{place.category}</span>
                  <h3>{place.title}</h3>
                  <p>{place.description}</p>
                  <Link to="/map" className="text-link">
                    View on community map <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="neighbourhood-feature">
        <div className="neighbourhood-feature-image">
          <img src="/images/LP-field.jpg" alt="Open space in the area" loading="lazy" />
        </div>

        <div className="neighbourhood-feature-copy">
          <span className="eyebrow">A CLOSER LOOK</span>
          <h2>
            There is more
            <br />
            to discover.
          </h2>
          <p>
            Help build a useful neighbourhood guide. Verified local
            information, business details and points of interest will be
            added as the directory grows.
          </p>
          <Link to="/contact" className="button button-gold">
            Suggest a local place <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}