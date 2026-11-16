
import { useEffect, useState } from "react";

import {
  imageUrls,
  newsItems,
  exploreItems,
  heroImages,
  communityImages,
} from "../src/data/content";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";
import { SectionHeading } from "../src/components/SectionHeading";

type HeroSlideState = {
  current: string;
  previous: string | null;
  transition: number;
};

export default function HomePage() {
  // Select a random hero image when the homepage loads.
  const [heroSlide, setHeroSlide] = useState<HeroSlideState>(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);

    return {
      current: heroImages[randomIndex],
      previous: null,
      transition: 0,
    };
  });

  // Preload hero images and rotate them automatically.
  useEffect(() => {
    heroImages.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });

    const interval = window.setInterval(() => {
      setHeroSlide((current) => {
        const availableImages = heroImages.filter(
          (src) => src !== current.current
        );

        const nextImage =
          availableImages[
            Math.floor(Math.random() * availableImages.length)
          ];

        return {
          current: nextImage,
          previous: current.current,
          transition: current.transition + 1,
        };
      });
    }, 7500);

    return () => window.clearInterval(interval);
  }, []);

  // Remove the outgoing image after its animation finishes.
  useEffect(() => {
    if (!heroSlide.previous) return;

    const timeout = window.setTimeout(() => {
      setHeroSlide((current) => ({
        ...current,
        previous: null,
      }));
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [heroSlide.transition, heroSlide.previous]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">

        {/* Previous image during transition */}
        {heroSlide.previous && (
          <div
            className="hero-image hero-image--exit"
            style={{
              backgroundImage: `url(${heroSlide.previous})`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Current hero image */}
        <div
          key={heroSlide.transition}
          className="hero-image hero-image--enter"
          style={{
            backgroundImage: `url(${heroSlide.current})`,
          }}
          aria-hidden="true"
        />

        <div className="hero-shade" />

        <div className="hero-content container">
          <span className="hero-kicker">
            <i /> A COMMUNITY IN BLOEMFONTEIN, SOUTH AFRICA
          </span>

          <h1>
            More Than a<br />
            Neighbourhood.
            <br />
            <em>A Community.</em>
          </h1>

          <p>
            Discover LourierPark. Explore our community, meet the people behind
            it and stay connected with everything happening around us.
          </p>

          <div className="hero-actions">
            <Link to="/explore" className="button button-gold">
              Explore LourierPark <ArrowUpRight size={17} />
            </Link>

            <Link to="/community" className="hero-text-link">
              Discover our community <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="hero-bottom">
          <span>01 / THE PLACE WE CALL HOME</span>

          <span className="hero-scroll">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
        </div>

        <div className="hero-side-note">
          LOURIERPARK · FREE STATE
        </div>
      </section>

      {/* COMMUNITY IMAGE BELT */}
      <section
        className="image-belt-section"
        aria-label="Community-inspired photography"
      >
        <div className="belt-label">
          <span>THE FEEL OF COMMUNITY</span>

          <span>
            01 — {communityImages.length.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="image-belt">
          {[...communityImages, ...communityImages].map((src, i) => (
            <div className="belt-image" key={`${src}-${i}`}>
              <img
                src={src}
                alt="Illustrative neighbourhood and community scene"
                loading="lazy"
              />

              <span>LOURierPARK LIFE</span>
            </div>
          ))}
        </div>

        <p className="belt-caption">
          A PLACE TO BELONG. A COMMUNITY TO BE PART OF.
        </p>
      </section>

      {/* OUR STORY SECTION */}
      <section className="story-section section-pad">
        <div className="container story-grid">

          <div className="story-visual">
            <img
              className="story-main-image"
              src={imageUrls.people}
              alt="People spending time together outdoors"
              loading="lazy"
            />

            <div className="story-stamp">
              <span>OUR</span>
              <strong>PLACE</strong>
              <span>OUR PEOPLE</span>
            </div>

            <div className="story-image-caption">
              THE BEST PART OF ANY PLACE IS ITS PEOPLE.
            </div>
          </div>

          <div className="story-copy">
            <span className="eyebrow">A PLACE TO CALL HOME</span>

            <h2>
              It’s the little things that make a <em>community.</em>
            </h2>

            <p className="story-lead">
              The familiar faces. The local places. The moments that bring
              neighbours a little closer.
            </p>

            <p>
              LourierPark is a neighbourhood with a story still being written.
              This is a place to discover what’s around us, celebrate the people
              who make a difference and keep up with the things that matter
              locally.
            </p>

            <Link to="/about" className="text-link">
              Get to know LourierPark <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* COMMUNITY NEWS SECTION */}
      <section className="news-section section-pad">
        <div className="container">

          <div className="section-topline">
            <SectionHeading
              eyebrow="THE LATEST FROM AROUND US"
              title={
                <>
                  Stories worth
                  <br />
                  <em>sharing.</em>
                </>
              }
              text="A place for local stories, community updates and the moments worth celebrating."
            />

            <Link
              to="/community"
              className="text-link desktop-only"
            >
              All community stories <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="news-grid">
            {newsItems.map((item, i) => (
              <article
                className={`news-card ${i === 0 ? "featured" : ""}`}
                key={item.title}
              >
                <Link to="/community" className="news-image">
                  <img
                    src={item.image}
                    alt="Illustrative community scene"
                    loading="lazy"
                  />

                  <span>{item.category}</span>
                </Link>

                <div className="news-card-copy">
                  <small>
                    {item.date} <i /> {item.tag}
                  </small>

                  <h3>
                    <Link to="/community">{item.title}</Link>
                  </h3>

                  <Link
                    to="/community"
                    className="circle-link"
                    aria-label="Read community story"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <Link
            to="/community"
            className="text-link mobile-only"
          >
            All community stories <ArrowUpRight size={16} />
          </Link>

        </div>
      </section>

      {/* COMMUNITY EVENTS SECTION */}
      <section className="events-section section-pad">
        <div className="container events-layout">

          <div className="events-intro">
            <span className="eyebrow">MAKE A DATE OF IT</span>

            <h2>
              Good things
              <br />
              happen when
              <br />
              <em>we get together.</em>
            </h2>

            <p>
              From community gatherings to local activities, this is where
              you’ll find what’s coming up in LourierPark.
            </p>

            <Link
              to="/community"
              className="button button-outline"
            >
              Explore community <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="event-feature">
            <img
              src={imageUrls.market}
              alt="Outdoor market scene"
              loading="lazy"
            />

            <div className="event-overlay">
              <span className="event-label">
                <CalendarDays size={14} /> COMMUNITY CALENDAR
              </span>

              <h3>
                There’s room for
                <br />
                something wonderful.
              </h3>

              <p>
                Community events and gatherings will appear here as they are
                confirmed.
              </p>

              <Link to="/community">
                Discover events <ArrowRight size={16} />
              </Link>
            </div>

            <span className="event-corner">L.</span>
          </div>

        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-section section-pad">
        <div className="container">

          <div className="section-topline">
            <SectionHeading
              eyebrow="GET TO KNOW YOUR SURROUNDINGS"
              title={
                <>
                  There’s more to
                  <br />
                  <em>discover.</em>
                </>
              }
              text="From the people behind local businesses to the places that bring us together, start exploring."
            />

            <Link
              to="/explore"
              className="text-link desktop-only"
            >
              Explore everything <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="explore-grid">
            {exploreItems.map((item) => (
              <Link
                to={item.href}
                className="explore-card"
                key={item.title}
              >
                <img src={item.image} alt="" loading="lazy" />

                <div className="explore-card-shade" />

                <span className="explore-number">
                  {item.number}
                </span>

                <div className="explore-card-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <span className="explore-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* COMMUNITY MAP SECTION */}
      <section className="map-section section-pad">
        <div className="container map-layout">

          <div className="map-copy">
            <span className="eyebrow">FIND YOUR WAY AROUND</span>

            <h2>
              Closer to
              <br />
              <em>your community.</em>
            </h2>

            <p>
              Get to know the local places, services and spaces that make up
              everyday life in LourierPark.
            </p>

            <Link to="/explore" className="text-link">
              Explore the neighbourhood <ArrowUpRight size={16} />
            </Link>

            <span className="map-footnote">
              Map locations and neighbourhood boundaries will be added after
              geographic details are verified.
            </span>
          </div>

          <div
            className="map-art"
            role="img"
            aria-label="Decorative map-inspired illustration. Not a geographic map."
          >
            <div className="map-art-top">
              <span>
                <MapPin size={14} /> LOURIERPARK / THE NEIGHBOURHOOD
              </span>

              <span>MAP PREVIEW</span>
            </div>

            <div className="map-lines">
              <i />
              <i />
              <i />
              <i />
              <i />

              <b />
              <b />
              <b />
            </div>

            <div className="map-center">
              <span className="map-pin">
                <MapPin size={19} />
              </span>

              <strong>YOUR COMMUNITY</strong>
              <small>PLACEHOLDER MAP ARTWORK</small>
            </div>

            <div className="map-legend">
              <span>
                <i className="legend-dot green" /> COMMUNITY
              </span>

              <span>
                <i className="legend-dot gold" /> PLACES TO DISCOVER
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* GET INVOLVED SECTION */}
      <section className="participate-section">

        <div
          className="participate-bg"
          style={{
            backgroundImage: `url(${imageUrls.garden})`,
          }}
        />

        <div className="participate-overlay" />

        <div className="container participate-content">
          <span className="eyebrow">THIS IS YOUR COMMUNITY, TOO</span>

          <h2>
            Your Neighbourhood.
            <br />
            <em>Your Voice.</em>
          </h2>

          <p>
            Know a local business? Have a story to share? Want to tell us about
            an event? Help us make this a place that reflects the people who
            call it home.
          </p>

          <Link
            to="/contact"
            className="button button-gold"
          >
            Get involved <ArrowUpRight size={17} />
          </Link>
        </div>

        <span className="participate-watermark">L.</span>

      </section>
    </>
  );
}
