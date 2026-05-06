import React from "react";
import { Link } from "react-router-dom";
import "./Feature.css";
import logo from "../../../assets/images/Logo/Logo.png";
import featureImg from "../../../assets/images/Feature/Feature.png";

const Feature = () => {
  const brandFeatures = [
    {
      icon: "✨",
      title: "Perfumes & Jewelry",
      desc: "Elegant imitation jewelry & signature fragrances for the modern woman.",
    },
    {
      icon: "💎",
      title: "International Craftsmanship",
      desc: "Every piece crafted with precision, quality & global standards.",
    },
    {
      icon: "🌿",
      title: "Affordable Luxury",
      desc: "Premium elegance that doesn't compromise on your budget.",
    },
    {
      icon: "🌟",
      title: "Timeless Elegance",
      desc: "Styles that transcend trends — made for every occasion.",
    },
  ];

  return (
    <section className="feature">
      {/* 🌌 Background Image (fixed) */}
      <div className="feature-bg"></div>
      <div className="feature-overlay"></div>

      {/* 📦 Centered Content */}
      <div className="feature-container">
        {/* LEFT SIDE - Brand Info */}
        <div className="feature-left">
          {/* Brand Name */}
          <h1 className="feature-title">
            CAPURRI <span className="feature-badge">Premium</span>
          </h1>

          {/* Tagline */}
          <p className="feature-tagline">Premium Indian Brand</p>

          {/* Description */}
          <p className="feature-desc">
            Blending modern femininity with style — where every detail tells a
            story of grace.
          </p>

          {/* CTA Button */}
          <Link to="/products" className="feature-btn">
            Explore Products →
          </Link>
        </div>

        {/* RIGHT SIDE - Feature Cards */}
        <div className="feature-right">
          {brandFeatures.map((item, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon">
                <span className="icon-emoji">{item.icon}</span>
              </div>
              <div className="feature-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
