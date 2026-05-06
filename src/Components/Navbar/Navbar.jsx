import logo from "../../assets/images/Logo/Logo2.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const domainName = import.meta.env.VITE_DOMAIN_NAME;
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Contact State
  const [contact, setContact] = useState({
    phone: "",
    email: "",
  });

  const navRef = useRef(null);
  const menuRef = useRef(null);

  const message = "Hello! I want to contact you.";

  // ── SCROLL ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── FETCH CONTACT ──
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(`${API_BASE}/contact-page`, {
          params: { domainName },
        });

        const data = res.data;

        setContact({
          phone: data?.phone || "7722009808",
          email: data?.email || "info@meenainternationalgroup.com",
        });
      } catch (err) {
        console.error("Contact fetch error:", err.message);
      }
    };

    fetchContact();
  }, [API_BASE, domainName]);

  // ── CLOSE MENU ──
  const closeMenu = () => {
    const menu = document.getElementById("mainNavbar");
    if (menu?.classList.contains("show")) menu.classList.remove("show");

    setMobileOpen(false);
  };

  // ── TOGGLE MOBILE ──
  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  // ── OUTSIDE CLICK ──
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    if (mobileOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 50);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [mobileOpen]);

  // ── ROUTE CHANGE ──
  useEffect(() => {
    closeMenu();
  }, [window.location.pathname]);

  return (
    <>
      {/* OVERLAY */}
      {mobileOpen && <div className="nav-overlay" onClick={closeMenu} />}

      {/* TOP BAR */}
      <div className={`top-bar ${scrolled ? "top-bar-hidden" : ""}`}>
        <div className="container d-flex justify-content-between flex-wrap">
          {/* CONTACT */}
          <div className="top-contact">
            <span>
              <FaPhoneAlt /> {contact.phone}
            </span>
            <span>
              <FaEnvelope /> {contact.email}
            </span>
          </div>

          {/* SOCIAL */}
          <div className="top-social-row">
            <nav className="top-social-icons">
              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/profile.php?id=61584511239827"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              {/* WHATSAPP (FIXED) */}
              <a
                href={`https://wa.me/${contact.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Hello! I want to contact you.",
                )}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              {/* LINKEDIN */}
              <a
                href="https://www.linkedin.com/company/meena-international11"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className={`navbar navbar-expand-lg main-navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container nav-container">
          {/* LOGO */}
          <Link className="navbar-brand" to="/" onClick={closeMenu}>
            <img src={logo} alt="Logo" />
          </Link>

          {/* HAMBURGER */}
          <button
            className={`navbar-toggler ${mobileOpen ? "open" : ""}`}
            type="button"
            onClick={toggleMobile}
          >
            <span className="tog-line tog-line1" />
            <span className="tog-line tog-line2" />
            <span className="tog-line tog-line3" />
          </button>

          {/* MENU */}
          <div
            ref={menuRef}
            className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}
            id="mainNavbar"
          >
            <ul className="navbar-nav nav-links-center">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/#about-company"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/#products-page"
                  onClick={closeMenu}
                >
                  Product
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/#certificates-page"
                  onClick={closeMenu}
                >
                  Certificates
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/manufacturing"
                  onClick={closeMenu}
                >
                  Manufacturing
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </ul>

            {/* CALL BUTTON */}
            <div className="nav-cta">
              <a
                href={`tel:+91${contact.phone}`}
                className="btn btn-accent"
                onClick={closeMenu}
              >
                <FaPhoneAlt />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
