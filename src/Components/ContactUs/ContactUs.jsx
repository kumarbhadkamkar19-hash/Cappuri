import "./ContactUs.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaPaperPlane,
  FaGlobe,
} from "react-icons/fa";
import heroBg from "../../assets/images/Contact/Contact1.png";
import { FaInstagram } from "react-icons/fa";

export default function ContactUs() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    country: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!baseURL) {
      alert("API URL missing. Check .env file");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/contact`,
        { ...formData, domainName: domain },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          product: "",
          country: "",
          message: "",
        });
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (error) {
      console.error("SUBMIT ERROR:", error.response || error.message);
      alert(
        error.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!baseURL) return;
    const fetchContactPage = async () => {
      try {
        const res = await axios.get(`${baseURL}/contact-page`, {
          params: { domainName: domain },
        });
        setContactData(res.data);
      } catch (err) {
        console.error("Contact page fetch failed:", err.message);
      }
    };
    fetchContactPage();
  }, [baseURL, domain]);

  if (!contactData)
    return (
      <div className="contact-loading">
        <div className="contact-spinner" />
      </div>
    );

  const socialLinks = [
    {
      icon: <FaFacebookF />,
      href:
        contactData?.socialLinks?.facebook ||
        "https://www.facebook.com/profile.php?id=61584511239827",
      label: "Facebook",
    },
    {
      icon: <FaLinkedinIn />,
      href:
        contactData?.socialLinks?.linkedin ||
        "https://www.linkedin.com/company/meena-international11",
      label: "LinkedIn",
    },
    {
      icon: <FaInstagram />,
      href:
        contactData?.socialLinks?.instagram ||
        "https://www.instagram.com/your_username",
      label: "Instagram",
    },
  ];

  return (
    <section className="contact-page">
      {/* ── HERO ── */}
      <header
        className="contact-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">
            <span className="hero-badge">Get In Touch</span>
            <h1>{contactData.pageTitle || "Contact Us"}</h1>
            <p>
              Premium Quality. <span>Trusted Always.</span>
            </p>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="#F7F6F3"
            />
          </svg>
        </div>
      </header>

      {/* ── MAIN GRID ── */}
      <div className="contact-container">
        {/* INFO CARD */}
        <div className="contact-info-card">
          <div className="info-card-header">
            <h2>Contact Details</h2>
            <div className="info-header-line" />
          </div>

          <div className="info-items-list">
            <div className="info-item">
              <div className="info-icon-wrap">
                <FaBuilding />
              </div>
              <div>
                <span className="info-label">Company</span>
                <span className="info-value">{contactData.pageTitle}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-wrap">
                <FaPhoneAlt />
              </div>
              <div>
                <span className="info-label">Phone</span>
                <span className="info-value">{contactData.phone}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-wrap">
                <FaEnvelope />
              </div>
              <div>
                <span className="info-label">Email</span>
                <span className="info-value">{contactData.email}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-wrap">
                <FaMapMarkerAlt />
              </div>
              <div>
                <span className="info-label">Address</span>
                <span className="info-value">{contactData.address}</span>
              </div>
            </div>
          </div>

          <div className="extra-box">
            <FaGlobe className="extra-icon" />
            <p>{contactData.description}</p>
          </div>

          <div className="contact-icon-row">
            <p className="contact-icon-title">Follow Us</p>
            <nav className="contact-icons">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="contact-form-card">
          <div className="form-card-header">
            <h2>Send Us an Enquiry</h2>
            <div className="form-header-line" />
          </div>

          {success && (
            <div className="success-msg">
              <FaPaperPlane /> Enquiry submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="grid-2">
              <div className="field-wrap">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Your Name</label>
              </div>
              <div className="field-wrap">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Email Address</label>
              </div>
            </div>

            <div className="grid-2">
              <div className="field-wrap">
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label>Mobile / WhatsApp</label>
              </div>
              <div className="field-wrap">
                <input
                  type="text"
                  name="country"
                  placeholder=" "
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
                <label>Country</label>
              </div>
            </div>

            <div className="field-wrap">
              <textarea
                name="message"
                rows="5"
                placeholder=" "
                value={formData.message}
                onChange={handleChange}
                required
              />
              <label>Your Message</label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="btn-spinner" /> Submitting...
                </span>
              ) : (
                <>
                  <FaPaperPlane className="btn-icon" /> Submit Enquiry
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── MAP ── */}
      <div className="map-wrapper">
        <div className="map-section">
          <iframe
            title="Location"
            src="https://maps.google.com/maps?q=B-6,%2010/44,%20Artist%20Village,%20Sector-8,%20CBD%20Belapur,%20Navi%20Mumbai,%20Maharashtra,%20400614,%20India&z=17&output=embed"
            loading="lazy"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}