import { ArrowRight, ArrowUpRight, Heart, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="interior-page">
      <section className="interior-hero about-hero">
        <div className="interior-hero-image">
          <img
            src="/images/Lourier_Park_Community_Center_Image006.jpg"
            alt="Community space in LourierPark"
          />
        </div>

        <div className="interior-hero-overlay" />

        <div className="container interior-hero-content">
          <span className="eyebrow">GET TO KNOW US</span>

          <h1>
            More than a place.
            <br />
            <em>A sense of belonging.</em>
          </h1>

          <p>
            Discover the story, character and community spirit of LourierPark,
            Bloemfontein.
          </p>

          <Link to="/neighbourhood" className="button button-gold">
            Explore our neighbourhood <ArrowUpRight size={17} />
          </Link>
        </div>

        <span className="interior-hero-index">01 / ABOUT LOURIERPARK</span>
      </section>

      <section className="section-pad">
        <div className="container about-intro-grid">
          <div>
            <span className="eyebrow">OUR COMMUNITY</span>
            <h2 className="interior-heading">
              Every neighbourhood has a story.
              <em> This is ours.</em>
            </h2>
          </div>

          <div className="interior-copy">
            <p className="lead">
              Welcome to LourierPark — a neighbourhood in Bloemfontein,
              Free State.
            </p>

            <p>
              This website is a place to discover our surroundings, celebrate
              local life and help residents stay connected. It is being
              developed as a shared community resource, with information
              contributed and verified by the people who know LourierPark.
            </p>

            <p className="placeholder-note">
              [Replace this section with a verified introduction to
              LourierPark and its community.]
            </p>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container about-story-grid">
          <div className="about-story-image">
            <img
              src="/images/adventures-in-the-hood.jpg"
              alt="A view of neighbourhood life"
              loading="lazy"
            />
            <span>THE PLACE WE CALL HOME</span>
          </div>

          <div className="about-story-copy">
            <span className="eyebrow">OUR STORY</span>
            <h2 className="interior-heading">
              A neighbourhood shaped by
              <em> its people.</em>
            </h2>

            <p>
              Every street, familiar place and shared experience contributes
              to the identity of a neighbourhood.
            </p>

            <p>
              This space will tell the story of LourierPark — its beginnings,
              development, important milestones and the people who have helped
              shape it.
            </p>

            <div className="placeholder-note">
              <strong>Content to add:</strong>
              <ul>
                <li>History and origins of LourierPark</li>
                <li>Important community milestones</li>
                <li>Stories from long-standing residents</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="centered-section-heading">
            <span className="eyebrow">WHAT MATTERS TO US</span>
            <h2 className="interior-heading">
              A community built around
              <em> connection.</em>
            </h2>
            <p>
              The values below are suggested themes for the community's
              identity. They can be refined with residents.
            </p>
          </div>

          <div className="value-grid">
            <article className="value-card">
              <span className="value-icon"><Users size={23} /></span>
              <h3>People first</h3>
              <p>
                Recognising the residents, families and individuals who make
                this neighbourhood what it is.
              </p>
            </article>

            <article className="value-card">
              <span className="value-icon"><Heart size={23} /></span>
              <h3>Community spirit</h3>
              <p>
                Creating opportunities for neighbours to connect, participate
                and support one another.
              </p>
            </article>

            <article className="value-card">
              <span className="value-icon"><MapPin size={23} /></span>
              <h3>Local pride</h3>
              <p>
                Celebrating local places, facilities, businesses and the
                character of LourierPark.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="interior-cta">
        <div className="container interior-cta-content">
          <div>
            <span className="eyebrow">DISCOVER MORE</span>
            <h2>
              Get to know the place
              <br />
              <em>we call home.</em>
            </h2>
          </div>

          <Link to="/neighbourhood" className="button button-gold">
            Our neighbourhood <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}