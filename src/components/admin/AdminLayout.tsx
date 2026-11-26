
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Shield,
  ShieldCheck,
  Store,
  Users,
  UserCog,
  X,
  Inbox,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navigationGroups = [
  {
    label: "Workspace",
    items: [
      {
        label: "Overview",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "Content management",
    items: [
      {
        label: "Local businesses",
        path: "/admin/businesses",
        icon: Store,
      },
      {
        label: "News & announcements",
        path: "/admin/news",
        icon: Newspaper,
      },
      {
        label: "Events",
        path: "/admin/events",
        icon: CalendarDays,
      },
      {
        label: "Community organisations",
        path: "/admin/organisations",
        icon: Users,
      },
      {
        label: "Safety & security",
        path: "/admin/safety",
        icon: Shield,
      },
      {
        label: "Gallery & media",
        path: "/admin/gallery",
        icon: Images,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Contact submissions",
        path: "/admin/submissions",
        icon: Inbox,
      },
      {
        label: "Administrators",
        path: "/admin/administrators",
        icon: UserCog,
      },
      {
        label: "Audit logs",
        path: "/admin/audit-logs",
        icon: ClipboardList,
      },
    ],
  },
];

export default function AdminLayout() {
  const { administrator, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div
      className={`admin-shell ${collapsed ? "admin-shell-collapsed" : ""}`}
    >
      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-brand">
          <img
            src="/images/LourierPark-Neighbourhood-Logo.png"
            alt="LourierPark"
          />

          <div className="admin-sidebar-brand-copy">
            <strong>LourierPark</strong>
            <span>COMMUNITY ADMIN</span>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="admin-sidebar-divider" />

        <nav className="admin-navigation" aria-label="Administration">
          {navigationGroups.map((group) => (
            <section className="admin-nav-group" key={group.label}>
              <p className="admin-nav-group-label">
                {group.label}
              </p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={"end" in item ? item.end : false}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `admin-nav-link ${
                        isActive ? "admin-nav-link-active" : ""
                      }`
                    }
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </section>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-divider" />

          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {administrator?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>

            <div className="admin-user-details">
              <strong>{administrator?.name ?? "Administrator"}</strong>
              <span>
                {administrator?.isSuperAdmin
                  ? "Super Administrator"
                  : "Administrator"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={21} />
          </button>

          <div className="admin-topbar-context">
            <ShieldCheck size={17} />
            <span>Administration workspace</span>
          </div>

          <button
            type="button"
            className="admin-collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} LourierPark Community</span>
          <span>Our Neighbourhood, Our Home</span>
        </footer>
      </div>
    </div>
  );
}
