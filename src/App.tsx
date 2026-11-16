import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import HomePage from "../pages/HomePage";
import SimplePage from "../pages/SimplePage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/about"
          element={
            <SimplePage
              eyebrow="Discover"
              title="A neighbourhood with a story."
              body="LourierPark is more than a place on the map. This is where we'll share the neighbourhood's identity, character and community story using information verified with the people who call it home."
            />
          }
        />
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
