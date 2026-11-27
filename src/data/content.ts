
export const imageUrls = {
  hero: '/images/adventures-in-the-hood.jpg',
  street: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85',
  garden: '/images/footer2.jpg',
  people: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
  coffee: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85',
  market: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=85',
  park: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85',
  hall: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85',
};

// ==========================================
// ACTUAL LOURIERPARK COMMUNITY PHOTOGRAPHS
// ==========================================

const localCommunityImages = [
  '/images/adventures-in-the-hood.jpg',
  '/images/footer2.jpg',
  '/images/Grayscale-Lakeside.jpg',

  '/images/Lourier_Park_Community_Center_Image006.jpg',
  '/images/Lourier_Park_Community_Center_Image010.jpg',
  '/images/Lourier_Park_Community_Center_Image013.jpg',
  '/images/Lourier_Park_Community_Center_Image016.jpg',
  '/images/Lourier_Park_Community_Center_Image017.jpg',
  '/images/Lourier_Park_Community_Center_Image021.jpg',
  '/images/Lourier_Park_Community_Center_Image025.jpg',

  '/images/LP%20Footer.jpg',
  '/images/LP%20Guesthouse.jpg',
  '/images/LP-Church.jpg',
  '/images/LP-Corner.jpg',
  '/images/LP-field.jpg',
  '/images/LP-Library.jpg',
  '/images/LP-Outer.jpg',
  '/images/LP-Park.jpg',
  '/images/LP-Road.jpg',
  '/images/LP-s-start.jpg',
  '/images/LP-School-1.jpg',
  '/images/LP-school-2.jpg',
  '/images/LP-Section-4-2.jpg',
  '/images/LP-Section-4.jpg',
  '/images/LP-Soccer-ground.jpg',
  '/images/LP-blue-container.jpg',
  '/images/LP-fieldroad.jpg',
  '/images/LP-church-2.jpg',
  '/images/Photo-15-1024x662.jpg',
  '/images/Rooidam-2.jpg',
  '/images/Rooidam.jpg',
];

// ==========================================
// HERO SLIDESHOW
// All 28 local photographs
// ==========================================

export const heroImages = [...localCommunityImages];

// ==========================================
// CONTINUOUS COMMUNITY IMAGE STRIP
// All 28 local photographs
// ==========================================

export const communityImages = [...localCommunityImages];

// ==========================================
// NEWS & COMMUNITY STORIES
// ==========================================

export const newsItems = [
  {
    category: 'Community',
    title: 'The stories that bring a neighbourhood together',
    date: 'Community feature',
    image: imageUrls.people,
    tag: 'Illustrative content',
  },
  {
    category: 'Local life',
    title: 'Making space for the everyday moments',
    date: 'Neighbourhood notes',
    image: imageUrls.garden,
    tag: 'Illustrative content',
  },
  {
    category: 'Discover',
    title: 'A closer look at the places around us',
    date: 'Explore LourierPark',
    image: imageUrls.street,
    tag: 'Illustrative content',
  },
];

// ==========================================
// EXPLORE LOURIERPARK
// ==========================================

export const exploreItems = [
  {
    title: 'Local businesses',
    description: 'Meet the independent businesses and services in our area.',
    image: imageUrls.coffee,
    href: '/explore',
    number: '01',
  },
  {
    title: 'Community facilities',
    description: 'Find useful local facilities and community spaces.',
    image: imageUrls.hall,
    href: '/explore',
    number: '02',
  },
  {
    title: 'Organisations',
    description: 'Discover the groups bringing people together.',
    image: imageUrls.people,
    href: '/community',
    number: '03',
  },
  {
    title: 'Parks & recreation',
    description: 'Explore outdoor spaces and places to unwind.',
    image: imageUrls.park,
    href: '/explore',
    number: '04',
  },
];
