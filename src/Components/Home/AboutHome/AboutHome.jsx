import React from "react";
import { Link } from "react-router-dom";
import "./AboutHome.css";

function AboutHome() {
  return (
    <section className="about-section">
      
      {/* ✨ Subtle Decorative Background Elements */}
      <div className="about-decor about-decor-1"></div>
      <div className="about-decor about-decor-2"></div>
      
      <div className="about-container">
        
        {/* Badge */}
        <span className="about-badge">About Company</span>

        {/* Title with Gold Accent */}
        <h2 className="about-title">
          CAPURRI
          <span className="title-accent"></span>
        </h2>

        {/* Description */}
        <p className="about-text">
          CAPURRI is a premium lifestyle brand from India, offering luxurious
          women's perfumes and finely crafted imitation jewelry. Inspired by
          elegance and modern femininity, we create long-lasting fragrances and
          sophisticated designs that bring affordable luxury to every moment.
        </p>

        {/* ✨ Shiny CTA Button */}
        <Link to="/about" className="about-btn">
          <span className="btn-text">Know More</span>
          <span className="btn-shine"></span>
          <span className="btn-arrow">→</span>
        </Link>
        
      </div>
    </section>
  );
}

export default AboutHome;