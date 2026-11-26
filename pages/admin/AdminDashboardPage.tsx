// pages/admin/AdminDashboardPage.tsx

import {
  ArrowRight,
  CalendarDays,
  Newspaper,
  Shield,
  Store,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../src/context/AuthContext";

const managementSections = [
  {
    title: "Local businesses",
    description: "Manage business listings, profiles and featured businesses.",
    path: "/admin/businesses",
    icon: Store,
  },
  {
    title: "News & announcements",
    description: "Publish community news, notices and important announcements.",
    path: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Events",
    description: "Create and manage upcoming community events.",
    path: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Community organisations",
    description: "Maintain information about local groups and organisations.",
    path: "/admin/organisations",
    icon: Users,
  },
  {
    title: "Safety & security",
    description: "Manage safety notices, alerts and neighbourhood updates.",
    path: "/admin/safety",
    icon: Shield,
  },
];

export default function AdminDashboardPage() {
  const { administrator } = useAuth();

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">YOUR WORKSPACE</p>
          <h1>Good to see you, {administrator?.name?.split(" ")[0]}.</h1>
          <p>
            Here's your overview of the LourierPark community platform.
          </p>
        </div>

        <div className="admin-dashboard-role">
          <Shield size={16} />
          {administrator?.isSuperAdmin
            ? "Super Administrator"
            : "Administrator"}
        </div>
      </header>

      <section className="admin-dashboard-intro">
        <div>
          <span className="admin-section-kicker">CONTENT MANAGEMENT</span>
          <h2>Manage your community.</h2>
          <p>
            Keep LourierPark informed and connected by managing the
            information published on the community website.
          </p>
        </div>
      </section>

      <section className="admin-management-section">
        <div className="admin-section-heading">
          <div>
            <h2>Management areas</h2>
            <p>Choose an area to manage.</p>
          </div>
        </div>

        <div className="admin-management-grid">
          {managementSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                to={section.path}
                className="admin-management-card"
                key={section.path}
              >
                <div className="admin-management-card-icon">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <div className="admin-management-card-content">
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>

                <ArrowRight
                  size={18}
                  className="admin-management-card-arrow"
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
