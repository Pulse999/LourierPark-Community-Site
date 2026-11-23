import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";

const menus = {
  Discover: [
    {
      title: "About LourierPark",
      desc: "Get to know our neighbourhood",
      href: "/about",
    },
    {
      title: "Our neighbourhood",
      desc: "The places and character that shape us",
      href: "/neighbourhood",
    },
    {
      title: "Community map",
      desc: "Explore local places on the map",
      href: "/map",
    },
    {
      title: "Gallery",
      desc: "Moments from community life",
      href: "/gallery",
    },
  ],
  Explore: [
    {
      title: "Local businesses",
      desc: "Independent businesses and services",
      href: "/local-businesses",
    },
    {
      title: "Community facilities",
      desc: "Useful places and local institutions",
      href: "/explore",
    },
    {
      title: "Parks & recreation",
      desc: "Outdoor spaces and destinations",
      href: "/explore",
    },
  ],
  Community: [
    {
      title: "News & announcements",
      desc: "What’s happening in the neighbourhood",
      href: "/community",
    },
    {
      title: "Events",
      desc: "Gatherings, activities and more",
      href: "/community",
    },
    {
      title: "Community organisations",
      desc: "The groups that bring us together",
      href: "/community",
    },
    {
      title: "Safety & security",
      desc: "Community safety information",
      href: "/community",
    },
  ],
};

type MenuKey = keyof typeof menus;

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [isMegaClosing, setIsMegaClosing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const showMenu = (menu: MenuKey) => {
    clearCloseTimer();
    setIsMegaClosing(false);
    setOpenMenu(menu);
  };

  const hideMenu = () => {
    if (!openMenu || isMegaClosing) return;

    setIsMegaClosing(true);

    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setIsMegaClosing(false);
      closeTimer.current = null;
    }, 260);
  };

  const close = () => {
    hideMenu();
    setMobileOpen(false);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <header
      className="site-header"
      onMouseLeave={hideMenu}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          hideMenu();
          setMobileOpen(false);
        }
      }}
    >
      <div className="nav-shell">
        {/* BRAND */}
        <Link
          to="/"
          className="brand"
          onClick={close}
          aria-label="LourierPark home"
        >
          <img
            src="/images/LourierPark-Neighbourhood-Logo.png"
            alt="LourierPark - Our Neighbourhood, Our Home"
            className="brand-logo"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          {Object.entries(menus).map(([label]) => {
            const menuKey = label as MenuKey;
            const isOpen = openMenu === menuKey;

            return (
              <button
                key={label}
                type="button"
                className={`nav-link nav-menu-trigger ${
                  isOpen ? "active" : ""
                }`}
                onClick={() => (isOpen ? hideMenu() : showMenu(menuKey))}
                onMouseEnter={() => showMenu(menuKey)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls="desktop-mega-menu"
              >
                {label}
                <ChevronDown size={14} strokeWidth={1.8} />
              </button>
            );
          })}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* GET INVOLVED */}
        <Link to="/contact" className="nav-cta" onClick={close}>
          Get involved <ArrowUpRight size={15} />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((previous) => !previous)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* DESKTOP MEGA MENU */}
      {openMenu && (
        <div
          id="desktop-mega-menu"
          className={`mega-wrap ${isMegaClosing ? "is-closing" : ""}`}
          aria-label={`${openMenu} navigation`}
        >
          <div className="mega-menu">
            <div className="mega-intro">
              <span className="eyebrow">EXPLORE LOURIERPARK</span>

              <h3>
                {openMenu}
                <br />
                <em>starts here.</em>
              </h3>

              <p>
                Find your way around the people, places and stories that make
                this community home.
              </p>
            </div>

            <div className="mega-links">
              {menus[openMenu].map((item) => (
                <Link
                  to={item.href}
                  key={item.title}
                  onClick={close}
                  className="mega-link"
                >
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.desc}</small>
                  </span>

                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>

            <div className="mega-note">
              <img
                src="/images/LourierPark-Neighbourhood-Logo.png"
                alt="LourierPark - Our Neighbourhood, Our Home"
                className="mega-note-logo"
              />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={close}>
            Home
          </NavLink>

          {Object.entries(menus).map(([label, items]) => (
            <div className="mobile-group" key={label}>
              <p>{label}</p>

              {items.map((item) => (
                <Link key={item.title} to={item.href} onClick={close}>
                  {item.title}
                </Link>
              ))}
            </div>
          ))}

          <NavLink to="/contact" onClick={close}>
            Contact
          </NavLink>

          <Link to="/contact" className="mobile-cta" onClick={close}>
            Get involved <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
