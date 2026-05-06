// src/components/AboutPageHero.jsx
import React from "react";
import "./AboutPageHero.css";

function AboutPageHero({ about }) {
  return (
    <section className="ab-hero">
      <div className="ab-hero__bg-img" />
      <div className="ab-hero__overlay" />

      <div className="ab-hero__content">
        <p className="ab-hero__eyebrow">Our Story</p>

        <h1 className="ab-hero__title">
          {about?.pageTitle || "About Us"}
          <span className="ab-hero__title-line" />
        </h1>

        <p className="ab-hero__tagline">
          Luxury in every detail. Elegance in every moment.
        </p>
      </div>
    </section>
  );
}

export default AboutPageHero;
