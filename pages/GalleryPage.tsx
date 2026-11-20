import { useState } from "react";
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

const filters = ["All photos", "Community", "Neighbourhood", "Facilities", "Places"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All photos");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const visiblePhotos = photos
    .map((photo, index) => ({ ...photo, originalIndex: index }))
    .filter(
      (photo) =>
        activeFilter === "All photos" || photo.category === activeFilter
    );

  const currentPhoto =
    selectedPhoto !== null ? photos[selectedPhoto] : null;

  function showPrevious() {
    if (selectedPhoto === null) return;
    setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length);
  }

  function showNext() {
    if (selectedPhoto === null) return;
    setSelectedPhoto((selectedPhoto + 1) % photos.length);
  }

  return (
    <main className="interior-page">
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

        <span className="interior-hero-index">04 / COMMUNITY GALLERY</span>
      </section>

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

            <span className="listing-count">
              {visiblePhotos.length.toString().padStart(2, "0")} PHOTOGRAPHS
            </span>
          </div>

          <div className="gallery-filters" aria-label="Filter gallery photos">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {visiblePhotos.map((photo) => (
              <button
                type="button"
                className="gallery-photo"
                key={photo.src}
                onClick={() => setSelectedPhoto(photo.originalIndex)}
                aria-label={`View ${photo.title}`}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <span className="gallery-photo-overlay">
                  <span>{photo.category}</span>
                  <strong>{photo.title}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

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

          <a href="/contact" className="button button-gold">
            Get in touch <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {currentPhoto && selectedPhoto !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setSelectedPhoto(null)}
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
          >
            <ArrowLeft size={22} />
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={currentPhoto.src} alt={currentPhoto.title} />
            <div>
              <span>{currentPhoto.category}</span>
              <strong>{currentPhoto.title}</strong>
              <small>
                {(selectedPhoto + 1).toString().padStart(2, "0")} /{" "}
                {photos.length.toString().padStart(2, "0")}
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
          >
            <ArrowRight size={22} />
          </button>
        </div>
      )}
    </main>
  );
}