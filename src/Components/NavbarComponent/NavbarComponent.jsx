import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import "./NavbarComponent.css";
import venuLogo from "../../assets/images/Logo/Logo2.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const domainName = import.meta.env.VITE_DOMAIN_NAME;

const FALLBACK_WHATSAPP = "919673566533";

const toCleanSlug = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSlug = (item) =>
  item.slug ? toCleanSlug(item.slug) : toCleanSlug(item.name);

const NavbarComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);

  // ✅ Scroll State (from Navbar.jsx)
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);

  // ── SCROLL LISTENER ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`, {
        params: { domainName },
      });
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Navbar category error:", err);
    }
  };

  const loadSubCategories = async (categoryId) => {
    if (subCategories[categoryId]) return;
    try {
      const res = await axios.get(`${API_BASE}/sub-categories`, {
        params: { domainName, categoryId },
      });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setSubCategories((prev) => ({ ...prev, [categoryId]: data }));
    } catch (err) {
      console.error("Navbar sub-category error:", err);
    }
  };

  const loadContactInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/contact-page`, {
        params: { domainName },
      });
      setContactInfo(res.data?.data || res.data || null);
    } catch (err) {
      console.error("Navbar contact error:", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadContactInfo();
  }, []);

  // ── Close sidebar ──
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProductOpen(false);
    setOpenCategoryId(null);
  };

  // ── Outside click close (from Navbar.jsx) ──
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 50);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMenuOpen]);

  // ── Route change close (from Navbar.jsx) ──
  useEffect(() => {
    closeMenu();
  }, [window.location.pathname]);

  const whatsappNumber = (() => {
    const digitsOnly = (contactInfo?.phone || "").replace(/\D/g, "");
    return digitsOnly.length >= 10 ? digitsOnly : FALLBACK_WHATSAPP;
  })();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsProductOpen(false);
    setOpenCategoryId(null);
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 1024) closeMenu();
  };

  const handleMobileCategoryToggle = (e, cat) => {
    e.preventDefault();
    loadSubCategories(cat._id);
    setOpenCategoryId((prev) => (prev === cat._id ? null : cat._id));
  };

  const handleCategoryMouseEnter = (cat) => {
    loadSubCategories(cat._id);
    setHoveredCategoryId(cat._id);
  };

  const hoveredCategory = categories.find((c) => c._id === hoveredCategoryId);
  const hoveredSubs = hoveredCategoryId
    ? subCategories[hoveredCategoryId] || []
    : [];

  return (
    <div className="navbar-container" ref={navRef}>
 
      {/* MOBILE OVERLAY — tap outside to close sidebar */}
      {isMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}


      <nav className={`main-nav ${scrolled ? "navbar-scrolled" : ""}`}>
        {/* BRAND */}
        <div className="nav-brand">
          <NavLink to="/">
            <img src={venuLogo} alt="swaminaam" className="logo" />
          </NavLink>
          <span className="brand-text">CAPURRI</span>
        </div>

        {/* HAMBURGER */}
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAV LINKS */}
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={handleNavClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={handleNavClick}>
              About
            </Link>
          </li>
           
          {/* PRODUCTS MEGA DROPDOWN */}
          <li
            className={`dropdown ${isProductOpen ? "open" : ""}`}
            onMouseEnter={() => setIsDropdownHovered(true)}
            onMouseLeave={() => {
              setIsDropdownHovered(false);
              setHoveredCategoryId(null);
            }}
          > 
            <Link
              to="#"
              className="dropdown-trigger"
              onClick={(e) => {
                if (window.innerWidth <= 1024) {
                  e.preventDefault();
                  setIsProductOpen((p) => !p);
                  setOpenCategoryId(null);
                }
              }}
            > 
              Products
              <span className="products-arrow">&#8964;</span>
            </Link>

            <div
              className="mega-dropdown"
              style={
                isDropdownHovered && window.innerWidth > 1024
                  ? { display: "flex" }
                  : {}
              }
            >
              <div className="mega-left">
                <Link
                  to="/products"
                  className="mega-all-link"
                  onClick={handleNavClick}
                >
                  All Products
                </Link>
                <ul className="mega-cat-list">
                  {categories.map((cat) => {
                    const catSlug = getSlug(cat);
                    const isMobileOpen = openCategoryId === cat._id;
                    const catSubs = subCategories[cat._id] || [];
                    return (
                      <li
                        key={cat._id}
                        className={`mega-cat-item${hoveredCategoryId === cat._id ? " active" : ""}${isMobileOpen ? " mobile-open" : ""}`}
                        onMouseEnter={() => handleCategoryMouseEnter(cat)}
                        onMouseLeave={() => setHoveredCategoryId(null)}
                      >
                        <Link
                          to={`/products/${catSlug}`}
                          className="mega-cat-link"
                          onClick={(e) => {
                            if (window.innerWidth <= 1024)
                              handleMobileCategoryToggle(e, cat);
                            else handleNavClick();
                          }}
                        >
                          <span>{cat.name}</span>
                          <span className="mega-cat-arrow">&#8250;</span>
                        </Link>
                        {isMobileOpen && catSubs.length > 0 && (
                          <ul className="mobile-sub-list">
                            <li>
                              <Link
                                to={`/products/${catSlug}`}
                                className="mobile-sub-all"
                                onClick={handleNavClick}
                              >
                                {cat.name}
                              </Link>
                            </li>
                            {catSubs.map((sub) => (
                              <li key={sub._id}>
                                <Link
                                  to={`/products/${catSlug}/${getSlug(sub)}`}
                                  onClick={handleNavClick}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div> 
                
              {hoveredCategory && hoveredSubs.length > 0 && (
                <div
                  className="mega-right"
                  onMouseEnter={() => {
                    setIsDropdownHovered(true);
                    setHoveredCategoryId(hoveredCategoryId);
                  }}
                  onMouseLeave={() => {
                    setIsDropdownHovered(false);
                    setHoveredCategoryId(null);
                  }}
                >
                  <Link
                    to={`/products/${getSlug(hoveredCategory)}`}
                    className="mega-right-header"
                    onClick={handleNavClick}
                  >
                    {hoveredCategory.name}
                  </Link>
                  <ul className="mega-sub-list">
                    {hoveredSubs.map((sub) => (
                      <li key={sub._id}>
                        <Link
                          to={`/products/${getSlug(hoveredCategory)}/${getSlug(sub)}`}
                          onClick={handleNavClick}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>

          <li>
            <Link to="/contact" onClick={handleNavClick}>
              Contact
            </Link>
          </li>

          {/* MOBILE CONTACT */}
          <li className="mobile-contact">
            <div className="contact-item">
              <i className="ri-phone-line"></i>
              {contactInfo?.phone ? (
                <span>{contactInfo.phone}</span>
              ) : (
                <span>—</span>
              )}
            </div>
            <div className="contact-item">
              <i className="ri-mail-fill"></i>
              {contactInfo?.email ? (
                <a
                  href={`mailto:${contactInfo.email}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {contactInfo.email}
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mobile-whatsapp-link"
            >
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/color/48/whatsapp--v1.png"
                alt="WhatsApp"
              />
              <span>Chat on WhatsApp</span>
            </a>
          </li>
        </ul>

        {/* DESKTOP CONTACT */}
        <div className="nav-contact">
          <div className="contact-item">
            <i className="ri-phone-line"></i>
            {contactInfo?.phone ? (
              <span>{contactInfo.phone}</span>
            ) : (
              <span>—</span>
            )}
          </div>
          <div className="contact-item">
            <i className="ri-mail-fill"></i>
            {contactInfo?.email ? (
              <a
                href={`mailto:${contactInfo.email}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {contactInfo.email}
              </a>
            ) : (
              <span>—</span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarComponent;