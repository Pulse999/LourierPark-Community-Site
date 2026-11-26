// pages/admin/AdminDashboardPage.tsx
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Newspaper,
  RefreshCw,
  Shield,
  Store,
  Users,
  Megaphone,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../src/context/AuthContext";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
).replace(/\/$/, "");

interface DashboardStats {
  generatedAt: string;
  timezone: string;
  overview: {
    businesses: {
      published: number;
      draft: number;
      unpublished: number;
      archived: number;
      featured: number;
      total: number;
    };
    content: {
      news: number;
      announcements: number;
    };
    events: {
      upcoming: number;
      pendingSubmissions: number;
    };
    organisations: {
      published: number;
    };
    administrators: {
      active: number;
      total: number;
    };
  };
  recentActivity: {
    id: string;
    action: string;
    resourceType: string;
    resourceId: string;
    createdAt: string;
    adminUser: {
      name: string;
    } | null;
  }[];
}

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

const numberFormatter = new Intl.NumberFormat("en-ZA");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg",
  }).format(new Date(value));
}

function formatActivityLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\./g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminDashboardPage() {
  const { administrator } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to load dashboard statistics."
        );
      }

      setStats(result.data);
    } catch (err) {
      console.error("Dashboard statistics request failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const overview = stats?.overview;
  const businesses = overview?.businesses;

  const businessStatuses = [
    {
      label: "Published",
      value: businesses?.published ?? 0,
      className: "published",
    },
    {
      label: "Draft",
      value: businesses?.draft ?? 0,
      className: "draft",
    },
    {
      label: "Unpublished",
      value: businesses?.unpublished ?? 0,
      className: "unpublished",
    },
    {
      label: "Archived",
      value: businesses?.archived ?? 0,
      className: "archived",
    },
  ];

  const businessTotal = businesses?.total ?? 0;

  return (
    <div className="admin-dashboard">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">YOUR WORKSPACE</p>
          <h1>
            Good to see you, {administrator?.name?.split(" ")[0] || "Admin"}.
          </h1>
          <p>Here's your overview of the LourierPark community platform.</p>
        </div>

        <div className="admin-dashboard-role">
          <Shield size={16} />
          {administrator?.isSuperAdmin
            ? "Super Administrator"
            : "Administrator"}
        </div>
      </header>

      {/* Dashboard statistics */}
      <section className="dashboard-analytics">
        <div className="dashboard-analytics-heading">
          <div>
            <span className="admin-section-kicker">PLATFORM OVERVIEW</span>
            <h2>Community at a glance.</h2>
            <p>Live statistics retrieved from your community database.</p>
          </div>

          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => void fetchStats()}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "dashboard-spin" : ""}
            />
            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </div>

        {error && (
          <div className="dashboard-error">
            <AlertCircle size={19} />
            <div>
              <strong>Unable to load analytics</strong>
              <p>{error}</p>
            </div>
            <button type="button" onClick={() => void fetchStats()}>
              Retry
            </button>
          </div>
        )}

        <div className="dashboard-stats-grid">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <Store size={20} />
            </div>
            <div>
              <span>Total businesses</span>
              <strong>
                {loading ? "—" : formatNumber(businesses?.total ?? 0)}
              </strong>
              <small>
                {businesses?.featured ?? 0} featured listings
              </small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <Newspaper size={20} />
            </div>
            <div>
              <span>Published news</span>
              <strong>
                {loading ? "—" : formatNumber(overview?.content.news ?? 0)}
              </strong>
              <small>Community news articles</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon gold">
              <Megaphone size={20} />
            </div>
            <div>
              <span>Announcements</span>
              <strong>
                {loading
                  ? "—"
                  : formatNumber(overview?.content.announcements ?? 0)}
              </strong>
              <small>Published announcements</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon purple">
              <CalendarDays size={20} />
            </div>
            <div>
              <span>Upcoming events</span>
              <strong>
                {loading
                  ? "—"
                  : formatNumber(overview?.events.upcoming ?? 0)}
              </strong>
              <small>
                {overview?.events.pendingSubmissions ?? 0} pending submissions
              </small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon teal">
              <Building2 size={20} />
            </div>
            <div>
              <span>Organisations</span>
              <strong>
                {loading
                  ? "—"
                  : formatNumber(overview?.organisations.published ?? 0)}
              </strong>
              <small>Published organisations</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon navy">
              <Users size={20} />
            </div>
            <div>
              <span>Administrators</span>
              <strong>
                {loading
                  ? "—"
                  : formatNumber(overview?.administrators.total ?? 0)}
              </strong>
              <small>
                {overview?.administrators.active ?? 0} active administrators
              </small>
            </div>
          </article>
        </div>

        <div className="dashboard-analytics-grid">
          {/* Business breakdown */}
          <article className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="admin-section-kicker">DIRECTORY</span>
                <h3>Business listings</h3>
              </div>
              <BarChart3 size={20} />
            </div>

            <div className="dashboard-business-total">
              <strong>
                {loading ? "—" : formatNumber(businessTotal)}
              </strong>
              <span>Total listings</span>
            </div>

            <div className="dashboard-business-bar">
              {businessTotal > 0 &&
                businessStatuses.map((item) => (
                  <div
                    key={item.label}
                    className={`dashboard-bar-segment ${item.className}`}
                    style={{
                      width: `${(item.value / businessTotal) * 100}%`,
                    }}
                    title={`${item.label}: ${item.value}`}
                  />
                ))}
            </div>

            <div className="dashboard-business-legend">
              {businessStatuses.map((item) => (
                <div key={item.label}>
                  <span
                    className={`dashboard-legend-dot ${item.className}`}
                  />
                  <span>{item.label}</span>
                  <strong>
                    {loading ? "—" : formatNumber(item.value)}
                  </strong>
                </div>
              ))}
            </div>
          </article>

          {/* Recent activity */}
          <article className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="admin-section-kicker">ADMINISTRATION</span>
                <h3>Recent activity</h3>
              </div>
              <Activity size={20} />
            </div>

            {loading ? (
              <div className="dashboard-empty-state">
                Loading recent activity...
              </div>
            ) : stats?.recentActivity.length ? (
              <div className="dashboard-activity-list">
                {stats.recentActivity.map((activity) => (
                  <div className="dashboard-activity-item" key={activity.id}>
                    <div className="dashboard-activity-icon">
                      <CheckCircle2 size={17} />
                    </div>
                    <div className="dashboard-activity-content">
                      <strong>
                        {formatActivityLabel(activity.action)}
                      </strong>
                      <span>
                        {formatActivityLabel(activity.resourceType)}
                        {activity.resourceId
                          ? ` · ${activity.resourceId.slice(0, 8)}`
                          : ""}
                      </span>
                      <small>
                        {activity.adminUser?.name || "Administrator"} ·{" "}
                        {formatDate(activity.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <Clock3 size={22} />
                <p>No recent administrator activity yet.</p>
              </div>
            )}
          </article>
        </div>

        {stats && (
          <p className="dashboard-last-updated">
            Last updated: {formatDate(stats.generatedAt)} (South African time)
          </p>
        )}
      </section>

      {/* Content management */}
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
