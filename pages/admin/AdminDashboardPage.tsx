
// pages/admin/AdminDashboardPage.tsx

import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Globe2,
  Megaphone,
  Newspaper,
  RefreshCw,
  Shield,
  Store,
  TrendingUp,
  UserRoundPlus,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
).replace(/\/$/, "");

// -----------------------------------------------------
// TYPES
// -----------------------------------------------------

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
    resourceId: string | null;
    createdAt: string;

    adminUser: {
      name: string;
    } | null;
  }[];
}

interface WebsiteAnalytics {
  generatedAt: string;
  timezone: string;
  period: "7d" | "30d";

  today: {
    uniqueVisitors: number;
    pageViews: number;
  };

  selectedPeriod: {
    uniqueVisitors: number;
    pageViews: number;
    newVisitors: number;
    returningVisitors: number;
  };

  dailyTrend: {
    date: string;
    pageViews: number;
    uniqueVisitors: number;
  }[];

  popularPages: {
    path: string;
    pageViews: number;
  }[];

  trafficSources: {
    hostname: string;
    pageViews: number;
  }[];
}

interface AnalyticsApiResponse {
  status: string;
  data: WebsiteAnalytics;
  message?: string;
}

// -----------------------------------------------------
// MANAGEMENT SECTIONS
// -----------------------------------------------------

const managementSections = [
  {
    title: "Local businesses",
    description:
      "Manage business listings, profiles and featured businesses.",
    path: "/admin/businesses",
    icon: Store,
  },
  {
    title: "News & announcements",
    description:
      "Publish community news, notices and important announcements.",
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
    description:
      "Maintain information about local groups and organisations.",
    path: "/admin/organisations",
    icon: Users,
  },
  {
    title: "Safety & security",
    description:
      "Manage safety notices, alerts and neighbourhood updates.",
    path: "/admin/safety",
    icon: Shield,
  },
];

// -----------------------------------------------------
// HELPERS
// -----------------------------------------------------

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

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    timeZone: "Africa/Johannesburg",
  }).format(new Date(`${value}T12:00:00+02:00`));
}

function formatActivityLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\./g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// -----------------------------------------------------
// DASHBOARD
// -----------------------------------------------------

export default function AdminDashboardPage() {
  const { administrator } = useAuth();

  // Community statistics
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Website analytics
  const [analytics, setAnalytics] =
    useState<WebsiteAnalytics | null>(null);

  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsPeriod, setAnalyticsPeriod] =
    useState<"7d" | "30d">("7d");

  // -----------------------------------------------------
  // FETCH COMMUNITY STATISTICS
  // -----------------------------------------------------

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

  // -----------------------------------------------------
  // FETCH WEBSITE ANALYTICS
  // -----------------------------------------------------

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/dashboard/analytics?period=${analyticsPeriod}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result =
        (await response.json()) as AnalyticsApiResponse;

      if (!response.ok || result.status !== "success") {
        throw new Error(
          result.message || "Unable to load website analytics."
        );
      }

      setAnalytics(result.data);
    } catch (err) {
      console.error("Website analytics request failed:", err);

      setAnalyticsError(
        err instanceof Error
          ? err.message
          : "Unable to load website analytics."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsPeriod]);

  // -----------------------------------------------------
  // INITIAL DATA LOADING
  // -----------------------------------------------------

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  // -----------------------------------------------------
  // DERIVED DATA
  // -----------------------------------------------------

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

  const dailyTrend = analytics?.dailyTrend ?? [];

  const maxPageViews = Math.max(
    1,
    ...dailyTrend.map((day) => day.pageViews)
  );

  const chartPoints = dailyTrend.map((day, index) => {
    const x =
      dailyTrend.length > 1
        ? (index / (dailyTrend.length - 1)) * 100
        : 50;

    const y = 100 - (day.pageViews / maxPageViews) * 85;

    return `${x},${y}`;
  });

  const chartLine = chartPoints.join(" ");

  // -----------------------------------------------------
  // REFRESH ALL DASHBOARD DATA
  // -----------------------------------------------------

  const refreshDashboard = () => {
    void fetchStats();
    void fetchAnalytics();
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------

  return (
    <div className="admin-dashboard">

      {/* PAGE HEADER */}

      <header className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">YOUR WORKSPACE</p>

          <h1>
            Good to see you,{" "}
            {administrator?.name?.split(" ")[0] || "Admin"}.
          </h1>

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

      {/* =====================================================
          DASHBOARD ANALYTICS
      ===================================================== */}

      <section className="dashboard-analytics">

        {/* ANALYTICS HEADER */}

        <div className="dashboard-analytics-heading">
          <div>
            <span className="admin-section-kicker">
              PLATFORM OVERVIEW
            </span>

            <h2>Community at a glance.</h2>

            <p>
              Live statistics retrieved from your community database.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={refreshDashboard}
            disabled={loading || analyticsLoading}
          >
            <RefreshCw
              size={15}
              className={
                loading || analyticsLoading
                  ? "dashboard-spin"
                  : ""
              }
            />

            {loading || analyticsLoading
              ? "Refreshing..."
              : "Refresh data"}
          </button>
        </div>

        {/* COMMUNITY STATISTICS ERROR */}

        {error && (
          <div className="dashboard-error">
            <AlertCircle size={19} />

            <div>
              <strong>Unable to load dashboard statistics</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => void fetchStats()}
            >
              Retry
            </button>
          </div>
        )}

        {/* COMMUNITY STATISTICS CARDS */}

        <div className="dashboard-stats-grid">

          {/* BUSINESSES */}

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <Store size={20} />
            </div>

            <div>
              <span>Total businesses</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(businesses?.total ?? 0)}
              </strong>

              <small>
                {businesses?.featured ?? 0} featured listings
              </small>
            </div>
          </article>

          {/* NEWS */}

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <Newspaper size={20} />
            </div>

            <div>
              <span>Published news</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(overview?.content.news ?? 0)}
              </strong>

              <small>Community news articles</small>
            </div>
          </article>

          {/* ANNOUNCEMENTS */}

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon gold">
              <Megaphone size={20} />
            </div>

            <div>
              <span>Announcements</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      overview?.content.announcements ?? 0
                    )}
              </strong>

              <small>Published announcements</small>
            </div>
          </article>

          {/* EVENTS */}

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
                {overview?.events.pendingSubmissions ?? 0} pending
                submissions
              </small>
            </div>
          </article>

          {/* ORGANISATIONS */}

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon teal">
              <Building2 size={20} />
            </div>

            <div>
              <span>Organisations</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      overview?.organisations.published ?? 0
                    )}
              </strong>

              <small>Published organisations</small>
            </div>
          </article>

          {/* ADMINISTRATORS */}

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon navy">
              <Users size={20} />
            </div>

            <div>
              <span>Administrators</span>

              <strong>
                {loading
                  ? "—"
                  : formatNumber(
                      overview?.administrators.total ?? 0
                    )}
              </strong>

              <small>
                {overview?.administrators.active ?? 0} active
                administrators
              </small>
            </div>
          </article>
        </div>

        {/* =====================================================
            WEBSITE ANALYTICS
        ===================================================== */}

        <section className="website-analytics">

          {/* WEBSITE ANALYTICS HEADER */}

          <div className="dashboard-panel-heading">
            <div>
              <span className="admin-section-kicker">
                WEBSITE PERFORMANCE
              </span>

              <h3>Website traffic</h3>

              <p>
                Understand how the community uses the LourierPark
                website.
              </p>
            </div>

            <Globe2 size={21} />
          </div>

          {/* ANALYTICS ERROR */}

          {analyticsError && (
            <div className="dashboard-error">
              <AlertCircle size={18} />

              <div>
                <strong>Unable to load website analytics</strong>
                <p>{analyticsError}</p>
              </div>

              <button
                type="button"
                onClick={() => void fetchAnalytics()}
              >
                Retry
              </button>
            </div>
          )}

          {/* PERIOD SELECTOR */}

          <div className="website-analytics-toolbar">
            <div>
              <span>Reporting period</span>
            </div>

            <div className="website-period-selector">
              <button
                className={
                  analyticsPeriod === "7d" ? "active" : ""
                }
                onClick={() => setAnalyticsPeriod("7d")}
                type="button"
                aria-pressed={analyticsPeriod === "7d"}
              >
                7 days
              </button>

              <button
                className={
                  analyticsPeriod === "30d" ? "active" : ""
                }
                onClick={() => setAnalyticsPeriod("30d")}
                type="button"
                aria-pressed={analyticsPeriod === "30d"}
              >
                30 days
              </button>
            </div>
          </div>

          {/* WEBSITE METRICS */}

          <div className="website-metrics-grid">

            <article className="website-metric-card">
              <div className="dashboard-stat-icon green">
                <Users size={20} />
              </div>

              <span>Unique visitors today</span>

              <strong>
                {analyticsLoading
                  ? "—"
                  : formatNumber(
                      analytics?.today.uniqueVisitors ?? 0
                    )}
              </strong>
            </article>

            <article className="website-metric-card">
              <div className="dashboard-stat-icon blue">
                <Eye size={20} />
              </div>

              <span>Page views today</span>

              <strong>
                {analyticsLoading
                  ? "—"
                  : formatNumber(
                      analytics?.today.pageViews ?? 0
                    )}
              </strong>
            </article>

            <article className="website-metric-card">
              <div className="dashboard-stat-icon purple">
                <TrendingUp size={20} />
              </div>

              <span>Visitors in selected period</span>

              <strong>
                {analyticsLoading
                  ? "—"
                  : formatNumber(
                      analytics?.selectedPeriod.uniqueVisitors ?? 0
                    )}
              </strong>
            </article>

            <article className="website-metric-card">
              <div className="dashboard-stat-icon gold">
                <BarChart3 size={20} />
              </div>

              <span>Page views in selected period</span>

              <strong>
                {analyticsLoading
                  ? "—"
                  : formatNumber(
                      analytics?.selectedPeriod.pageViews ?? 0
                    )}
              </strong>
            </article>
          </div>

          {/* TRAFFIC CHART AND VISITOR BREAKDOWN */}

          <div className="website-analytics-grid">

            {/* DAILY TRAFFIC CHART */}

            <article className="dashboard-panel website-chart-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="admin-section-kicker">
                    TRAFFIC OVER TIME
                  </span>

                  <h3>Daily page views</h3>
                </div>

                <Activity size={20} />
              </div>

              {analyticsLoading ? (
                <div className="dashboard-empty-state">
                  Loading traffic data...
                </div>
              ) : dailyTrend.length === 0 ? (
                <div className="dashboard-empty-state">
                  No website traffic data available yet.
                </div>
              ) : (
                <>
                  <div className="website-chart">
                    <svg
                      viewBox="0 0 100 110"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Daily page views chart"
                    >
                      {[15, 35, 55, 75, 95].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          y1={y}
                          x2="100"
                          y2={y}
                          className="website-chart-gridline"
                        />
                      ))}

                      <polyline
                        points={chartLine}
                        className="website-chart-line"
                      />
                    </svg>
                  </div>

                  <div className="website-chart-labels">
                    <span>
                      {formatChartDate(dailyTrend[0].date)}
                    </span>

                    {dailyTrend.length > 2 && (
                      <span>
                        {formatChartDate(
                          dailyTrend[
                            Math.floor(dailyTrend.length / 2)
                          ].date
                        )}
                      </span>
                    )}

                    <span>
                      {formatChartDate(
                        dailyTrend[dailyTrend.length - 1].date
                      )}
                    </span>
                  </div>

                  <p className="website-chart-caption">
                    Daily page views over the selected{" "}
                    {analyticsPeriod === "7d" ? "7" : "30"}-day
                    period.
                  </p>
                </>
              )}
            </article>

            {/* VISITOR BREAKDOWN */}

            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="admin-section-kicker">
                    AUDIENCE
                  </span>

                  <h3>Visitor breakdown</h3>
                </div>

                <Users size={20} />
              </div>

              <div className="website-audience-stat">
                <span>New visitors</span>

                <strong>
                  {analyticsLoading
                    ? "—"
                    : formatNumber(
                        analytics?.selectedPeriod.newVisitors ?? 0
                      )}
                </strong>
              </div>

              <div className="website-audience-stat">
                <span>Returning visitors</span>

                <strong>
                  {analyticsLoading
                    ? "—"
                    : formatNumber(
                        analytics?.selectedPeriod.returningVisitors ?? 0
                      )}
                </strong>
              </div>

              <div className="website-audience-note">
                <UserRoundPlus size={17} />

                <span>
                  Visitor counts are based on anonymous analytics
                  identifiers.
                </span>
              </div>
            </article>
          </div>

          {/* POPULAR PAGES AND TRAFFIC SOURCES */}

          <div className="website-analytics-grid">

            {/* POPULAR PAGES */}

            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="admin-section-kicker">
                    CONTENT PERFORMANCE
                  </span>

                  <h3>Popular pages</h3>
                </div>

                <Eye size={20} />
              </div>

              {analyticsLoading ? (
                <div className="dashboard-empty-state">
                  Loading popular pages...
                </div>
              ) : analytics?.popularPages.length ? (
                <div className="website-ranking-list">
                  {analytics.popularPages.map((page, index) => (
                    <div
                      className="website-ranking-item"
                      key={page.path}
                    >
                      <span className="website-ranking-number">
                        {index + 1}
                      </span>

                      <span className="website-ranking-path">
                        {page.path}
                      </span>

                      <strong>
                        {formatNumber(page.pageViews)}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-state">
                  No page views recorded yet.
                </div>
              )}
            </article>

            {/* TRAFFIC SOURCES */}

            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <span className="admin-section-kicker">
                    DISCOVERY
                  </span>

                  <h3>Traffic sources</h3>
                </div>

                <Globe2 size={20} />
              </div>

              {analyticsLoading ? (
                <div className="dashboard-empty-state">
                  Loading traffic sources...
                </div>
              ) : analytics?.trafficSources.length ? (
                <div className="website-ranking-list">
                  {analytics.trafficSources.map((source) => (
                    <div
                      className="website-ranking-item"
                      key={source.hostname}
                    >
                      <span className="website-ranking-path">
                        {source.hostname}
                      </span>

                      <strong>
                        {formatNumber(source.pageViews)}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-state">
                  No external traffic sources recorded yet.
                </div>
              )}
            </article>
          </div>
        </section>

        {/* =====================================================
            BUSINESS BREAKDOWN AND RECENT ACTIVITY
        ===================================================== */}

        <div className="dashboard-analytics-grid">

          {/* BUSINESS BREAKDOWN */}

          <article className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="admin-section-kicker">
                  DIRECTORY
                </span>

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
                      width: `${
                        (item.value / businessTotal) * 100
                      }%`,
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
                    {loading
                      ? "—"
                      : formatNumber(item.value)}
                  </strong>
                </div>
              ))}
            </div>
          </article>

          {/* RECENT ACTIVITY */}

          <article className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span className="admin-section-kicker">
                  ADMINISTRATION
                </span>

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
                  <div
                    className="dashboard-activity-item"
                    key={activity.id}
                  >
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
                        {activity.adminUser?.name || "Administrator"}{" "}
                        · {formatDate(activity.createdAt)}
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

        {/* LAST UPDATED */}

        {stats && (
          <p className="dashboard-last-updated">
            Last updated: {formatDate(stats.generatedAt)} (South
            African time)
          </p>
        )}
      </section>

      {/* =====================================================
          CONTENT MANAGEMENT INTRODUCTION
      ===================================================== */}

      <section className="admin-dashboard-intro">
        <div>
          <span className="admin-section-kicker">
            CONTENT MANAGEMENT
          </span>

          <h2>Manage your community.</h2>

          <p>
            Keep LourierPark informed and connected by managing the
            information published on the community website.
          </p>
        </div>
      </section>

      {/* =====================================================
          MANAGEMENT AREAS
      ===================================================== */}

      <section className="admin-management-section">
        <div className="admin-section-heading">
          <div>
            <h2>Management areas</h2>

            <p>Choose an area to manage.</p>
          </div>
        </div>

        <div className="admin-management-grid">

          {/* EXISTING MANAGEMENT AREAS */}

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

          {/* SUPER ADMINISTRATOR MANAGEMENT */}

          {administrator?.isSuperAdmin && (
            <Link
              to="/admin/administrators"
              className="admin-management-card"
            >
              <div className="admin-management-card-icon">
                <UserRoundPlus size={21} strokeWidth={1.8} />
              </div>

              <div className="admin-management-card-content">
                <h3>Administrator management</h3>

                <p>
                  Invite administrators, assign roles and permissions,
                  and manage administrator accounts.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="admin-management-card-arrow"
              />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
