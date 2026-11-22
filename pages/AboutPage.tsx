import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Heart, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      "[data-about-reveal]",
    );

    document.documentElement.classList.add("has-about-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return () => {
        document.documentElement.classList.remove("has-about-reveal");
      };
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -55px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("has-about-reveal");
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[#f7f8f5] text-[#092b40]">
      {/* ==================================================
          CINEMATIC HERO
      ================================================== */}

      <section className="interior-hero about-hero about-cinematic-hero relative isolate flex min-h-[620px] items-end overflow-hidden bg-[#092b40]">
        <div className="interior-hero-image about-hero-image absolute inset-0">
          <img
            src="/images/Lourier_Park_Community_Center_Image006.jpg"
            alt="Community space in LourierPark"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="interior-hero-overlay absolute inset-0" />

        <div className="interior-hero-content container relative z-10 mx-auto w-full px-6 pb-24 pt-32 md:px-12 lg:px-20">
          <span className="eyebrow about-hero-kicker">GET TO KNOW US</span>

          <h1 className="about-hero-title">
            More than a place.
            <br />
            <em>A sense of belonging.</em>
          </h1>

          <p className="about-hero-description mt-6 max-w-xl">
            Discover the story, character and community spirit of LourierPark,
            Bloemfontein.
          </p>

          <Link
            to="/neighbourhood"
            className="button button-gold about-hero-button mt-9 inline-flex items-center gap-4 transition-all duration-300 hover:-translate-y-1"
          >
            Explore our neighbourhood
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <span className="interior-hero-index absolute bottom-7 right-6 z-10 md:right-12 lg:right-20">
          01 / ABOUT LOURIERPARK
        </span>

        <div className="about-hero-progress absolute bottom-0 left-0 z-20 h-[3px] w-full origin-left bg-[#eca02c]" />
      </section>

      {/* ==================================================
          INTRODUCTION
      ================================================== */}

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-2 lg:gap-24">
          <div data-about-reveal="left">
            <span className="eyebrow">OUR COMMUNITY</span>

            <h2 className="interior-heading mt-5 max-w-xl">
              Every neighbourhood has a story.
              <em> This is ours.</em>
            </h2>

            <div className="about-heading-line mt-8 h-[2px] w-16 bg-[#eca02c]" />
          </div>

          <div className="interior-copy" data-about-reveal="right">
            <p className="lead">
              Welcome to LourierPark — a neighbourhood in Bloemfontein, Free
              State.
            </p>

            <p className="mt-5">
              This website is a place to discover our surroundings, celebrate
              local life and help residents stay connected. It is being
              developed as a shared community resource, with information
              contributed and verified by the people who know LourierPark.
            </p>

            <div className="mt-8 border-l-2 border-[#eca02c] bg-[#e9efea] px-6 py-5 about-note">
              <p className="placeholder-note">
                <strong>Content to personalise:</strong>
                <br />
                Replace this introduction with a verified overview of
                LourierPark, its location, identity and the people who call it
                home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          OUR STORY — IMAGE WIPE REVEAL
      ================================================== */}

      <section className="bg-[#e9efea] px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div
            className="group relative about-story-visual"
            data-about-reveal="left"
          >
            <div className="relative aspect-[4/5] max-h-[650px] overflow-hidden">
              <img
                src="/images/adventures-in-the-hood.jpg"
                alt="A view of neighbourhood life"
                loading="lazy"
                className="about-story-photo h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#092b40]/55 via-transparent to-transparent" />

              <span className="absolute bottom-6 left-6 text-[9px] font-bold tracking-[0.2em] text-white">
                THE PLACE WE CALL HOME
              </span>
            </div>

            
          </div>

          <div className="about-story-copy" data-about-reveal="right">
            <span className="eyebrow">OUR STORY</span>

            <h2 className="interior-heading mt-5">
              A neighbourhood shaped by
              <em> its people.</em>
            </h2>

            <div className="interior-copy mt-7">
              <p>
                Every street, familiar place and shared experience contributes
                to the identity of a neighbourhood.
              </p>

              <p className="mt-5">
                This space will tell the story of LourierPark — its beginnings,
                development, important milestones and the people who have helped
                shape it.
              </p>
            </div>

            <div
              className="about-content-list mt-9 border border-[#092b40]/10 bg-white/70 p-6"
              data-about-reveal="up"
            >
              <strong className="text-sm">Content to add</strong>

              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#277a43]" />
                  History and origins of LourierPark
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#277a43]" />
                  Important community milestones
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#277a43]" />
                  Stories from long-standing residents
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          COMMUNITY VALUES — STAGGERED CARDS
      ================================================== */}

      <section className="px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-[1320px]">
          <div
            className="mx-auto mb-14 max-w-2xl text-center"
            data-about-reveal="up"
          >
            <span className="eyebrow">WHAT MATTERS TO US</span>

            <h2 className="interior-heading mt-5">
              A community built around
              <em> connection.</em>
            </h2>

            <p className="interior-copy mt-5">
              The values below are suggested themes for the community's
              identity. They can be refined with residents.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* People first */}

            <article
              className="group about-value-card border border-[#092b40]/10 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#277a43]/40 hover:shadow-xl"
              data-about-reveal="card"
            >
              <span className="mb-7 flex h-14 w-14 items-center justify-center bg-[#e9efea] text-[#277a43] transition-colors duration-300 group-hover:bg-[#277a43] group-hover:text-white">
                <Users size={23} />
              </span>

              <h3 className="mb-4">People first</h3>

              <p className="text-sm leading-7 text-slate-600">
                Recognising the residents, families and individuals who make
                this neighbourhood what it is.
              </p>

              <span className="mt-8 block h-px w-10 bg-[#eca02c] transition-all duration-500 group-hover:w-full" />
            </article>

            {/* Community spirit */}

            <article
              className="group about-value-card border border-[#092b40]/10 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#277a43]/40 hover:shadow-xl"
              data-about-reveal="card"
            >
              <span className="mb-7 flex h-14 w-14 items-center justify-center bg-[#e9efea] text-[#277a43] transition-colors duration-300 group-hover:bg-[#277a43] group-hover:text-white">
                <Heart size={23} />
              </span>

              <h3 className="mb-4">Community spirit</h3>

              <p className="text-sm leading-7 text-slate-600">
                Creating opportunities for neighbours to connect, participate
                and support one another.
              </p>

              <span className="mt-8 block h-px w-10 bg-[#eca02c] transition-all duration-500 group-hover:w-full" />
            </article>

            {/* Local pride */}

            <article
              className="group about-value-card border border-[#092b40]/10 bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#277a43]/40 hover:shadow-xl"
              data-about-reveal="card"
            >
              <span className="mb-7 flex h-14 w-14 items-center justify-center bg-[#e9efea] text-[#277a43] transition-colors duration-300 group-hover:bg-[#277a43] group-hover:text-white">
                <MapPin size={23} />
              </span>

              <h3 className="mb-4">Local pride</h3>

              <p className="text-sm leading-7 text-slate-600">
                Celebrating local places, facilities, businesses and the
                character of LourierPark.
              </p>

              <span className="mt-8 block h-px w-10 bg-[#eca02c] transition-all duration-500 group-hover:w-full" />
            </article>
          </div>
        </div>
      </section>

      {/* ==================================================
          DISCOVER MORE — CINEMATIC CTA
      ================================================== */}

      <section className="about-final-cta relative overflow-hidden bg-[#092b40] px-6 py-20 text-white md:px-12 md:py-24 lg:px-20">
        <div className="about-cta-orbit about-cta-orbit-one pointer-events-none absolute -right-10 -top-24" />
        <div className="about-cta-orbit about-cta-orbit-two pointer-events-none absolute -right-10 -top-24" />

        <div className="pointer-events-none absolute -right-10 -top-24 font-serif text-[300px] leading-none text-white/[0.035]">
          L.
        </div>

        <div
          className="relative mx-auto flex max-w-[1320px] flex-col justify-between gap-10 md:flex-row md:items-center"
          data-about-reveal="up"
        >
          <div>
            <span className="eyebrow">DISCOVER MORE</span>

            <h2 className="mt-5">
              Get to know the place
              <br />
              <em>we call home.</em>
            </h2>
          </div>

          <Link
            to="/neighbourhood"
            className="button button-gold about-cta-button inline-flex shrink-0 items-center gap-4 transition-all duration-300 hover:-translate-y-1"
          >
            Our neighbourhood
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
