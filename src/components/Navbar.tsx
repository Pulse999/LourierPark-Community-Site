
import { useState } from "react";
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
      href: "/about",
    },
    {
      title: "Community map",
      desc: "Explore local places on the map",
      href: "/explore",
    },
    {
      title: "Gallery",
      desc: "Moments from community life",
      href: "/community",
    },
  ],
  Explore: [
    {
      title: "Local businesses",
      desc: "Independent businesses and services",
      href: "/explore",
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header
      className="site-header"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="nav-shell">
        {/* BRAND */}
        <Link
          to="/"
          className="brand"
          onClick={close}
          aria-label="LourierPark home"
        >
          <span className="brand-mark">
            L<span>.</span>
          </span>

          <span className="brand-copy">
            <strong>OURIERPARK</strong>
            <small>OUR NEIGHBOURHOOD, OUR HOME.</small>
          </span>
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

          {Object.entries(menus).map(([label]) => (
            <button
              key={label}
              className={`nav-link nav-menu-trigger ${
                openMenu === label ? "active" : ""
              }`}
              onClick={() =>
                setOpenMenu(
                  openMenu === label ? null : (label as MenuKey)
                )
              }
              onMouseEnter={() => setOpenMenu(label as MenuKey)}
              aria-expanded={openMenu === label}
              aria-haspopup="true"
            >
              {label}
              <ChevronDown size={14} strokeWidth={1.8} />
            </button>
          ))}

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* GET INVOLVED BUTTON */}
        <Link to="/contact" className="nav-cta">
          Get involved <ArrowUpRight size={15} />
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* DESKTOP MEGA MENU */}
      {openMenu && (
        <div className="mega-wrap">
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
              <span className="mega-note-mark">L.</span>

              <p>
                Our Neighbourhood,
                <br />
                Our Home.
              </p>
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
                <Link
                  key={item.title}
                  to={item.href}
                  onClick={close}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ))}

          <NavLink to="/contact" onClick={close}>
            Contact
          </NavLink>
        </div>
      )}
    </header>
  );
}
