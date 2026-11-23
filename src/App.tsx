import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";

import HomePage from "../pages/HomePage";
import SimplePage from "../pages/SimplePage";

import AboutPage from "../pages/AboutPage";
import NeighbourhoodPage from "../pages/NeighbourhoodPage";
import CommunityMapPage from "../pages/CommunityMapPage";
import GalleryPage from "../pages/GalleryPage";
import LocalBusinessesPage from "../pages/LocalBusinessesPage";
import BusinessCategoryPage from "../pages/BusinessCategoryPage";
import BusinessProfilePage from "../pages/BusinessProfilePage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Discover */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/neighbourhood" element={<NeighbourhoodPage />} />
        <Route path="/map" element={<CommunityMapPage />} />
        <Route path="/gallery" element={<GalleryPage />} />

        {/* Explore */}
        <Route path="/local-businesses" element={<LocalBusinessesPage />} />
        <Route
          path="/local-businesses/:categoryId"
          element={<BusinessCategoryPage />}
        />
        <Route
          path="/local-businesses/:categoryId/:businessSlug"
          element={<BusinessProfilePage />}
        />

        {/* Existing pages — kept intact */}
        <Route
          path="/explore"
          element={
            <SimplePage
              eyebrow="Explore"
              title="Discover what’s around you."
              body="A growing guide to local businesses, community facilities and places worth discovering. Verified listings will be added as we gather information from the community."
            />
          }
        />

        <Route
          path="/community"
          element={
            <SimplePage
              eyebrow="Community"
              title="The people make the place."
              body="News, announcements, events and community organisations will have a home here. Public contributions will be reviewed before anything is published."
            />
          }
        />

        <Route
          path="/contact"
          element={
            <SimplePage
              eyebrow="Get involved"
              title="Your neighbourhood. Your voice."
              body="Have a suggestion, a community story or an event to share? Our public submission forms will be added in a later development stage."
            />
          }
        />
      </Route>
    </Routes>
  );
}
