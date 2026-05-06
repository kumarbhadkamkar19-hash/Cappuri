import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Footer.css";

import logo from "../../assets/images/Logo/Logo2.png";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaClock,
  FaPaperPlane,
  FaStar,
} from "react-icons/fa";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
];

const Footer = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const [contactData, setContactData] = useState(null);
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  useEffect(() => {
    if (!baseURL) return;
    axios
      .get(`${baseURL}/contact-page`, { params: { domainName: domain } })
      .then((r) => setContactData(r.data))
      .catch((e) => console.error("Contact fetch failed:", e.message));
  }, [baseURL, domain]);

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!subEmail || subLoading) return;
    setSubLoading(true);
    try {
      const r = await axios.post(
        `${baseURL}/contact`,
        {
          name: "Newsletter Subscriber",
          email: subEmail,
          phone: "-",
          product: "-",
          country: "-",
          message: `New newsletter subscription from: ${subEmail}`,
          domainName: domain,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      if (r.status === 200 || r.status === 201) {
        setSubSuccess(true);
        setSubEmail("");
        setTimeout(() => setSubSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed. Try again.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="cf-footer">
      {/* ✨ Background decorative layers */}
      <div className="cf-footer__bg-gradient" aria-hidden="true" />
      <div className="cf-footer__spice-accent" aria-hidden="true" />
      <div className="cf-footer__particles" aria-hidden="true" />

      <div className="cf-footer__container">
        {/* ── 🌟 BRAND SECTION ── */}
        <div className="cf-footer__col cf-footer__col--brand">
          <div className="cf-brand__logo-wrapper">
            <div className="cf-brand__glow-effect" />
            <div className="cf-brand__pulse-ring" />
            <img
              src={logo}
              alt="Capurri Logo"
              className="cf-brand__logo-image"
              loading="lazy"
            />
          </div>
          {/* 
          <div className="cf-brand__name-container">
            <FaStar className="cf-brand__star-icon cf-brand__star--left" />
            <h2 className="cf-brand__title">CAPURRI</h2>
            <FaStar className="cf-brand__star-icon cf-brand__star--right" />
          </div> */}

          <p className="cf-brand__description">
            “Fragrance & Jewelry That Define You.” <br />
            “Wear Your Confidence, Feel the Luxury.”
            <br />
            “Luxury Scents, Elegant Shine.”
          </p>

          <div className="cf-brand__social-links">
            <a
              href={
                contactData?.socialLinks?.facebook || "https://www.facebook.com"
              }
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Facebook"
              className="cf-social__link cf-social__link--facebook"
            >
              <FaFacebookF />
              <span className="cf-social__tooltip">Facebook</span>
            </a>
            <a
              href={
                contactData?.socialLinks?.instagram ||
                "https://www.instagram.com"
              }
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Instagram"
              className="cf-social__link cf-social__link--instagram"
            >
              <FaInstagram />
              <span className="cf-social__tooltip">Instagram</span>
            </a>
            <a
              href={
                contactData?.socialLinks?.linkedin || "https://www.linkedin.com"
              }
              target="_blank"
              rel="noreferrer"
              aria-label="Connect on LinkedIn"
              className="cf-social__link cf-social__link--linkedin"
            >
              <FaLinkedinIn />
              <span className="cf-social__tooltip">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* ── 🔗 QUICK LINKS SECTION ── */}
        <div className="cf-footer__col cf-footer__col--links">
          <h3 className="cf-col__heading">
            <span className="cf-col__heading-underline" />
            Quick Links
          </h3>
          <ul className="cf-links__list">
            {links.map((link, index) => (
              <li key={index} className="cf-links__item">
                <Link to={link.path} className="cf-links__anchor">
                  <span className="cf-links__bullet" />
                  <span className="cf-links__text">{link.name}</span>
                  <FaArrowRight className="cf-links__arrow" />
                  <span className="cf-links__hover-bg" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── 📞 CONTACT & SUBSCRIBE SECTION ── */}
        <div className="cf-footer__col cf-footer__col--contact">
          <h3 className="cf-col__heading">
            <span className="cf-col__heading-underline" />
            Contact Us
          </h3>

          <ul className="cf-contact__list">
            <li className="cf-contact__item">
              <span className="cf-contact__icon-wrapper cf-contact__icon--email">
                <FaEnvelope />
              </span>
              <span className="cf-contact__text">
                {contactData?.email || "info@capurri.com"}
              </span>
            </li>
            <li className="cf-contact__item">
              <span className="cf-contact__icon-wrapper cf-contact__icon--phone">
                <FaPhoneAlt />
              </span>
              <span className="cf-contact__text">
                {contactData?.phone || "+91 XXXXXXXXXX"}
              </span>
            </li>
            <li className="cf-contact__item">
              <span className="cf-contact__icon-wrapper cf-contact__icon--location">
                <FaMapMarkerAlt />
              </span>
              <span className="cf-contact__text">
                {contactData?.address || "India"}
              </span>
            </li>
            <li className="cf-contact__item">
              <span className="cf-contact__icon-wrapper cf-contact__icon--time">
                <FaClock />
              </span>
              <span className="cf-contact__text">
                {contactData?.businessHours || "Mon – Sun · 24/7 Support"}
              </span>
            </li>
          </ul>

          {/* ── 📬 NEWSLETTER SUBSCRIBE ── */}
         
        </div>
        <div className="cf-footer__col cf-footer__col--contact">
          
          {/* ── 📬 NEWSLETTER SUBSCRIBE ── */}
          <div className="cf-subscribe__container">
            <p className="cf-subscribe__label">
              <FaPaperPlane className="cf-subscribe__icon" />
              <span>Stay Connected</span>
            </p>
            <p className="cf-subscribe__hint">
              Get exclusive offers & spice tips in your inbox 🌶️
            </p>

            <form onSubmit={handleSubSubmit} className="cf-subscribe__form">
              <div className="cf-subscribe__input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  required
                  className="cf-subscribe__input"
                  disabled={subLoading}
                />
                <span className="cf-subscribe__input-focus" />
              </div>
              <button
                type="submit"
                disabled={subLoading}
                aria-label="Subscribe to newsletter"
                className="cf-subscribe__button"
              >
                {subLoading ? (
                  <span className="cf-subscribe__loader" />
                ) : (
                  <>
                    <FaPaperPlane className="cf-subscribe__btn-icon" />
                    <span>Subscribe</span>
                  </>
                )}
                <span className="cf-subscribe__btn-shine" />
              </button>
            </form>
            {subSuccess && (
              <p className="cf-subscribe__success">
                ✨ Thank you! You're subscribed.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── ⬇️ BOTTOM BAR ── */}
      <div className="cf-footer__bottom">
        <div className="cf-footer__bottom-inner">
          <span className="cf-copyright__text">
            © {new Date().getFullYear()} CAPURRI · All Rights Reserved.
          </span>
          <span className="cf-footer__separator" />
          <span className="cf-copyright__tag">
            Crafted with <FaStar className="cf-copyright__heart" /> for pure
            flavors
          </span>
        </div>
      </div>

      {/* ✨ Floating spice particles animation */}
      <div className="cf-footer__floating-spices" aria-hidden="true">
        <span className="cf-spice__particle cf-spice__particle--1">🌿</span>
        <span className="cf-spice__particle cf-spice__particle--2">🌶️</span>
        <span className="cf-spice__particle cf-spice__particle--3">✨</span>
        <span className="cf-spice__particle cf-spice__particle--4">🌿</span>
      </div>
    </footer>
  );
};

export default Footer;
