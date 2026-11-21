
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const photos = [
  {
    src: "/images/adventures-in-the-hood.jpg",
    title: "Life around LourierPark",
    category: "Community",
  },
  {
    src: "/images/LP-Road.jpg",
    title: "Neighbourhood streets",
    category: "Neighbourhood",
  },
  {
    src: "/images/LP-Park.jpg",
    title: "Outdoor spaces",
    category: "Places",
  },
  {
    src: "/images/LP-School-1.jpg",
    title: "Education and learning",
    category: "Facilities",
  },
  {
    src: "/images/LP-Church.jpg",
    title: "Community institutions",
    category: "Facilities",
  },
  {
    src: "/images/LP-Soccer-ground.jpg",
    title: "Sport and recreation",
    category: "Places",
  },
  {
    src: "/images/LP-Library.jpg",
    title: "Local facilities",
    category: "Facilities",
  },
  {
    src: "/images/Rooidam.jpg",
    title: "The wider surroundings",
    category: "Neighbourhood",
  },
  {
    src: "/images/Lourier_Park_Community_Center_Image016.jpg",
    title: "Community spaces",
    category: "Community",
  },
  {
    src: "/images/LP-field.jpg",
    title: "Open spaces",
    category: "Places",
  },
  {
    src: "/images/LP-Section-4.jpg",
    title: "Around the neighbourhood",
    category: "Neighbourhood",
  },
  {
    src: "/images/LP-Guesthouse.jpg",
    title: "Local places",
    category: "Places",
  },
];

const filters = [
  "All photos",
  "Community",
  "Neighbourhood",
  "Facilities",
  "Places",
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All photos");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const visiblePhotos = photos
    .map((photo, index) => ({
      ...photo,
      originalIndex: index,
    }))
    .filter(
      (photo) =>
        activeFilter === "All photos" ||
        photo.category === activeFilter
    );

  const currentPhoto =
    selectedPhoto !== null ? photos[selectedPhoto] : null;

  const currentVisibleIndex = visiblePhotos.findIndex(
    (photo) => photo.originalIndex === selectedPhoto
  );

  const isLightboxOpen = selectedPhoto !== null;

  function showPrevious() {
    if (currentVisibleIndex === -1 || visiblePhotos.length <= 1) return;

    const previousIndex =
      (currentVisibleIndex - 1 + visiblePhotos.length) %
      visiblePhotos.length;

    setSelectedPhoto(visiblePhotos[previousIndex].originalIndex);
  }

  function showNext() {
    if (currentVisibleIndex === -1 || visiblePhotos.length <= 1) return;

    const nextIndex =
      (currentVisibleIndex + 1) % visiblePhotos.length;

    setSelectedPhoto(visiblePhotos[nextIndex].originalIndex);
  }

  function openPhoto(index: number, event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setSelectedPhoto(index);
  }

  function closePhoto() {
    setSelectedPhoto(null);
  }

  // Lock background scrolling and manage focus when opening/closing.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;

      openerRef.current?.focus();
    };
  }, [isLightboxOpen]);

  // Keyboard navigation within the active gallery filter.
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePhoto();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, currentVisibleIndex, visiblePhotos.length]);

  return (
    <main className="interior-page">
      {/* Gallery hero */}
      <section className="interior-hero gallery-hero">
        <div className="interior-hero-image">
          <img
            src="/images/Lourier_Park_Community_Center_Image017.jpg"
            alt="A view of LourierPark"
          />
        </div>

        <div className="interior-hero-overlay" />

        <div className="container interior-hero-content">
          <span className="eyebrow">A VISUAL JOURNEY</span>

          <h1>
            A place.
            <br />
            A people.
            <br />
            <em>A thousand stories.</em>
          </h1>

          <p>
            A growing collection of photographs capturing the places,
            surroundings and everyday character of LourierPark.
          </p>
        </div>

        <span className="interior-hero-index">
          04 / COMMUNITY GALLERY
        </span>
      </section>

      {/* Gallery collection */}
      <section className="section-pad gallery-page-section">
        <div className="container">
          <div className="section-topline">
            <div>
              <span className="eyebrow">MOMENTS & PLACES</span>

              <h2 className="interior-heading">
                See LourierPark
                <em> through our eyes.</em>
              </h2>

              <p className="gallery-intro">
                Explore photographs of the neighbourhood and its surroundings.
                Captions and community contributions can be added as the
                gallery develops.
              </p>
            </div>

            <span className="listing-count" aria-live="polite">
              {visiblePhotos.length.toString().padStart(2, "0")} PHOTOGRAPHS
            </span>
          </div>

          {/* Category filters */}
          <div
            className="gallery-filters"
            role="group"
            aria-label="Filter gallery photos"
          >
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <div className="gallery-grid" aria-live="polite">
            {visiblePhotos.map((photo, index) => (
              <button
                type="button"
                className="gallery-photo"
                key={photo.src}
                style={
                  {
                    "--photo-delay": `${index * 65}ms`,
                  } as CSSProperties
                }
                onClick={(event) =>
                  openPhoto(photo.originalIndex, event)
                }
                aria-label={`View ${photo.title}`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                />

                <span className="gallery-photo-overlay">
                  <span>{photo.category}</span>
                  <strong>{photo.title}</strong>
                </span>

                <span
                  className="gallery-photo-indicator"
                  aria-hidden="true"
                >
                  <ArrowRight size={18} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Community contribution CTA */}
      <section className="gallery-community-cta">
        <div className="container gallery-community-cta-inner">
          <div>
            <span className="eyebrow">HELP TELL OUR STORY</span>

            <h2>
              Have a photograph
              <br />
              <em>to share?</em>
            </h2>

            <p>
              We want this gallery to reflect the real LourierPark and the
              people who know it best. Community photo submissions can be
              introduced in a future update.
            </p>
          </div>

          <Link to="/contact" className="button button-gold">
            Get in touch <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Full-screen photo viewer */}
      {currentPhoto && selectedPhoto !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closePhoto}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="gallery-lightbox-close"
            onClick={closePhoto}
            aria-label="Close photo viewer"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            className="gallery-lightbox-arrow previous"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photo"
            disabled={visiblePhotos.length <= 1}
          >
            <ArrowLeft size={22} />
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              key={currentPhoto.src}
              src={currentPhoto.src}
              alt={currentPhoto.title}
            />

            <div>
              <span>{currentPhoto.category}</span>
              <strong>{currentPhoto.title}</strong>

              <small>
                {(currentVisibleIndex + 1)
                  .toString()
                  .padStart(2, "0")}{" "}
                / {visiblePhotos.length.toString().padStart(2, "0")}
              </small>
            </div>
          </div>

          <button
            type="button"
            className="gallery-lightbox-arrow next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
            disabled={visiblePhotos.length <= 1}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      )}
    </main>
  );
}
