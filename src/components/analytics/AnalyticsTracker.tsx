
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CONSENT_KEY = "lourierpark_analytics_consent";
const VISITOR_KEY = "lourierpark_visitor_id";

type Consent = "accepted" | "rejected" | null;

export default function AnalyticsTracker() {
  const location = useLocation();

  const [consent, setConsent] = useState<Consent>(() => {
    const saved = localStorage.getItem(CONSENT_KEY);

    return saved === "accepted" || saved === "rejected"
      ? saved
      : null;
  });

  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "accepted") {
      lastTrackedPath.current = null;
      return;
    }

    const path = location.pathname;

    // Never track administrator pages.
    if (path.startsWith("/admin")) return;

    // Avoid duplicate page views for the same route.
    if (lastTrackedPath.current === path) return;

    lastTrackedPath.current = path;

    let anonymousId = localStorage.getItem(VISITOR_KEY);

    if (!anonymousId) {
      anonymousId = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, anonymousId);
    }

    void fetch(`${API_URL}/analytics/page-view`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anonymousId,
        path,
        referrer: document.referrer || null,
      }),
    }).catch((error) => {
      console.error("Unable to send analytics:", error);
    });
  }, [consent, location.pathname]);

  function updateConsent(value: "accepted" | "rejected") {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  function reopenPrivacySettings() {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
  }

  return (
    <>
      <Outlet />

      {consent === null && (
        <aside
          className="analytics-consent"
          aria-label="Analytics privacy preferences"
        >
          <div>
            <strong>Help us improve LourierPark.</strong>
            <p>
              We use anonymous website analytics to understand
              which pages are useful to our community. You can
              choose whether to participate.
            </p>
          </div>

          <div className="analytics-consent-actions">
            <button
              type="button"
              onClick={() => updateConsent("rejected")}
            >
              Decline
            </button>

            <button
              type="button"
              onClick={() => updateConsent("accepted")}
            >
              Accept analytics
            </button>
          </div>
        </aside>
      )}

      {consent !== null && (
        <button
          type="button"
          className="analytics-privacy-settings"
          onClick={reopenPrivacySettings}
          aria-label="Change analytics privacy preferences"
        >
          Privacy settings
        </button>
      )}
    </>
  );
}
