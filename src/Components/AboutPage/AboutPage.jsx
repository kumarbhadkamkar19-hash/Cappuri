// src/pages/AboutPage.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaBullseye,
  FaEye,
  FaLeaf,
  FaGlobe,
  FaStar,
  FaShieldAlt,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaQuoteLeft,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import heroImg from "../../assets/images/Contact/Contact1.png";
import "./AboutPage.css";
import AboutPageHero from "./AboutPageHero";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const DOMAIN = import.meta.env.VITE_DOMAIN_NAME;

/* ── Inline skeleton block ──────────────────────────────── */
function Skeleton({ w = "100%", h = "16px", r = "6px" }) {
  return (
    <span
      className="ab-skeleton"
      style={{ width: w, height: h, borderRadius: r }}
    />
  );
}

/* ── Navigation Bar Component ──────────────────────────── */
function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "#story" },
    { label: "Mission & Vision", href: "#mission" },
    { label: "Values", href: "#values" },
    { label: "Contact", href: "/contact" },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="ab-navbar">
      <div className="ab-navbar__inner">
        {/* Logo */}
        <div className="ab-navbar__logo">
          <span className="ab-logo-text">CAPURRI</span>
        </div>

        {/* Desktop Menu */}
        <div className="ab-navbar__menu ab-navbar__menu--desktop">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="ab-navbar__link"
              onClick={(e) => {
                if (link.href.startsWith("#")) {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="ab-navbar__cta">
          <a href="/contact" className="ab-navbar__cta-btn">
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`ab-navbar__toggle ab-navbar__toggle--mobile ${
            mobileMenuOpen ? "ab-navbar__toggle--active" : ""
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="ab-navbar__menu ab-navbar__menu--mobile">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="ab-navbar__link ab-navbar__link--mobile"
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="ab-navbar__cta-btn ab-navbar__cta-btn--mobile"
            >
              Get in Touch
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

function AboutPage() {
  const [about, setAbout] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const storyRef = useRef(null);

  /* ── Fast fetch with AbortController ───────────────────── */
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE}/about?domainName=${DOMAIN}`, {
        signal: controller.signal,
      })
      .then((res) => setAbout(res.data.data))
      .catch((err) => {
        if (!axios.isCancel(err)) console.error("About fetch error:", err);
      });
    return () => controller.abort();
  }, []);

  /* ── Scroll-reveal for story section ───────────────────── */
  useEffect(() => {
    if (!storyRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ab-story--visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(storyRef.current);
    return () => obs.disconnect();
  }, [about]);

  const stats = [
    { icon: <FaUsers />, num: "10,000+", label: "Happy Clients" },
    { icon: <FaGlobe />, num: "50+", label: "Countries Served" },
    { icon: <FaAward />, num: "15+", label: "Years of Excellence" },
    { icon: <FaStar />, num: "4.9★", label: "Average Rating" },
  ];

  const values = [
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      desc: "Every product is crafted with mindful sourcing and eco-conscious practices at the forefront.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Assured",
      desc: "Rigorous quality checks at every stage ensure only the finest reaches your door.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      desc: "Seamless delivery to 50+ countries with white-glove logistics and care.",
    },
    {
      icon: <FaStar />,
      title: "Premium Standard",
      desc: "Luxury is in the details — from packaging to presentation, we exceed expectations.",
    },
  ];

  /* Backend image field — tries common names */
  const storyImage =
    about?.image ||
    about?.coverImage ||
    about?.bannerImage ||
    about?.photo ||
    about?.thumbnail ||
    null;

  return (
    <div className="ab-page">
      <AboutPageHero />

      {/* ══════════════════════════════════════════════════
          OUR STORY  —  IMAGE FROM BACKEND
      ══════════════════════════════════════════════════ */}
      <section className="ab-story" id="story" ref={storyRef}>
        <div className="ab-story__inner">
          <div className="ab-story__grid">
            {/* Image column */}
            <div className="ab-story__visual">
              <div className="ab-story__img-wrap">
                {/* Shimmer skeleton — visible until image loads */}

                {storyImage && (
                  <img
                    src={storyImage}
                    alt="Our Story"
                    className={`ab-story__img${imgLoaded ? " ab-story__img--loaded" : ""}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                      e.target
                        .closest(".ab-story__img-wrap")
                        .classList.add("ab-story__img-wrap--error");
                    }}
                  />
                )}

                <div className="ab-story__img-badge">
                  <FaAward className="ab-img-badge-icon" />
                  <span>Founder and Director</span>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="ab-story__text">
              <span className="ab-eyebrow">
                <span className="ab-dot-gold" />
                Who We Are
              </span>
              <h2 className="ab-section-title">Our Story</h2>
              <div className="ab-gold-bar" />

              <div className="ab-story__body">
                {about
                  ? about.description?.split("**").map((para, i) =>
                      para.trim() ? (
                        <p key={i} className="ab-story__para">
                          <span className="ab-para-bullet" />
                          {para}
                        </p>
                      ) : null,
                    )
                  : Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="ab-story__para">
                        <span
                          className="ab-para-bullet"
                          style={{ opacity: 0.25 }}
                        />
                        <Skeleton
                          w={["92%", "78%", "85%", "70%", "88%"][i]}
                          h="13px"
                          r="4px"
                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════════════
          ABOUT DESCRIPTION
      ══════════════════════════════════════════════════ */}
      <section className="ab-about-desc">
        <div className="ab-about-desc__inner">
          <p className="ab-about-desc__text text-center">
            At CAPURRI, we believe everyday essentials can be elevated into
            meaningful experiences. Born in India with a global vision, CAPURRI
            is a lifestyle brand offering a curated range of products including
            imitation jewelry, fine fragrances, and eco-friendly tableware. Our
            philosophy blends elegance, sustainability, and accessibility. From
            timeless jewelry that enhances personal style, to captivating
            fragrances that leave a lasting impression, and environmentally
            conscious dishes crafted from nature—every CAPURRI product reflects
            thoughtful design and quality. Driven by a passion for innovation
            and global standards, we partner with trusted manufacturers to
            deliver products that meet the expectations of modern consumers
            across international markets. CAPURRI is not just a brand—it is a
            promise of style, responsibility, and refined living.
          </p>
          {/* <div className="ab-about-desc__accent">
            <img
              src={storyImage}
              alt="Our Story"
              className={`ab-story__img${imgLoaded ? " ab-story__img--loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                e.target
                  .closest(".ab-story__img-wrap")
                  .classList.add("ab-story__img-wrap--error");
              }}
            />
          </div> */}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MISSION & VISION
      ══════════════════════════════════════════════════ */}
      <section className="ab-mv" id="mission">
        <div className="ab-mv__inner">
          <div className="ab-mv__grid">
            <div className="ab-mv__card">
              <div className="ab-mv__card-glow" />
              <div className="ab-mv__card-icon">
                <FaBullseye />
              </div>
              <div className="ab-mv__card-tag">Mission</div>
              <h3 className="ab-mv__card-title">Our Mission</h3>
              {about ? (
                <p className="ab-mv__card-body">{about.mission}</p>
              ) : (
                <div className="ab-mv__card-body ab-mv__card-body--skeleton">
                  <Skeleton w="100%" h="12px" r="3px" />
                  <Skeleton w="85%" h="12px" r="3px" />
                  <Skeleton w="68%" h="12px" r="3px" />
                </div>
              )}
              <div className="ab-mv__card-pill">
                <FaCheckCircle /> Purpose-Driven
              </div>
            </div>

            <div className="ab-mv__card">
              <div className="ab-mv__card-glow" />
              <div className="ab-mv__card-icon">
                <FaEye />
              </div>
              <div className="ab-mv__card-tag">Vision</div>
              <h3 className="ab-mv__card-title">Our Vision</h3>
              {about ? (
                <p className="ab-mv__card-body">{about.vision}</p>
              ) : (
                <div className="ab-mv__card-body ab-mv__card-body--skeleton">
                  <Skeleton w="100%" h="12px" r="3px" />
                  <Skeleton w="78%" h="12px" r="3px" />
                  <Skeleton w="60%" h="12px" r="3px" />
                </div>
              )}
              <div className="ab-mv__card-pill">
                <FaStar /> Future-Focused
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════════════ */}
      <section className="ab-values" id="values">
        <div className="ab-values__inner">
          <div className="ab-section-header">
            <span className="ab-eyebrow">
              <span className="ab-dot-gold" />
              Core Principles
            </span>
            <h2 className="ab-section-title">Our Values</h2>
            <div className="ab-gold-bar ab-gold-bar--center" />
          </div>

          <div className="ab-values__grid">
            {values.map((v, i) => (
              <div className="ab-value-card" key={i} style={{ "--i": i }}>
                <div className="ab-value-card__num">0{i + 1}</div>
                <div className="ab-value-card__icon">{v.icon}</div>
                <h4 className="ab-value-card__title">{v.title}</h4>
                <p className="ab-value-card__desc">{v.desc}</p>
                <div className="ab-value-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
