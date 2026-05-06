import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import SliderImage1 from "../../../assets/images/Home/hero1.png";
import SliderImage2 from "../../../assets/images/Home/hero2.png";
import SliderImage3 from "../../../assets/images/Home/hero3.png";
import "./SectionSlider.css";
const slides = [
  {
    img: SliderImage1,
    tag: "Elegant Products",
    heading: ["Imitation Jewelry", "Fragrances"],
    sub: "Premium jewelry and fragrances that enhance your style.",
  },
  {
    img: SliderImage2,
    tag: "Eco Living",
    heading: ["Eco-Friendly", "Tableware"],
    sub: "Sustainable tableware designed for modern living.",
  },
  {
    img: SliderImage3,
    tag: "Our Vision",
    heading: ["Elegance", "Sustainability"],
    sub: "Blending style, quality, and eco-conscious living.",
  },
];

function SectionSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback(
    (index) => {
      if (animating || index === current) return;
      setAnimating(true);
      setPrev(current);
      setCurrent(index);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 900);
    },
    [animating, current],
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo],
  );
  const back = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo],
  );

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  return (
    <header className="ss-hero">
      {/* ── Slide Images ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`ss-slide
            ${i === current ? "ss-slide--active" : ""}
            ${i === prev ? "ss-slide--exit" : ""}
          `}
          style={{ backgroundImage: `url(${s.img})` }}
        />
      ))}

      {/* ── Overlays ── */}
      <div className="ss-overlay ss-overlay--dark" />
      <div className="ss-overlay ss-overlay--vignette" />
      <div className="ss-grain" />

      {/* ── Side decorative line ── */}
      <div className="ss-sideline" />

      {/* ── Content ── */}
      <div className={`ss-content ${mounted ? "ss-content--in" : ""}`}>
        {/* Tag pill */}
        <div className="ss-tag" key={`tag-${current}`}>
          <span className="ss-tag__dot" />
          {slides[current].tag}
        </div>

        {/* Heading */}
        <h1 className="ss-heading" key={`h-${current}`}>
          <span className="ss-heading__top">{slides[current].heading[0]}</span>
          <span className="ss-heading__bot">
            {slides[current].heading[1].split("").map((ch, i) => (
              <span
                key={i}
                className="ss-heading__char"
                style={{ animationDelay: `${0.55 + i * 0.04}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Sub */}
        <p className="ss-sub" key={`sub-${current}`}>
          {slides[current].sub}
        </p>

        {/* CTA */}
        <div className="ss-cta">
          <NavLink to="/products" className="ss-btn ss-btn--primary">
            Explore Products
          </NavLink>
          <NavLink to="/about" className="ss-btn ss-btn--ghost">
            Our Story
          </NavLink>
        </div>

        {/* Dots */}
        <div className="ss-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ss-dot ${i === current ? "ss-dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Slide counter ── */}
      <div className="ss-counter">
        <span className="ss-counter__cur">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="ss-counter__line" />
        <span className="ss-counter__tot">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Nav arrows ── */}
      <button
        className="ss-nav ss-nav--prev"
        onClick={back}
        aria-label="Previous"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button className="ss-nav ss-nav--next" onClick={next} aria-label="Next">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* ── Progress bar ── */}
      <div className="ss-progress" key={current}>
        <div className="ss-progress__bar" />
      </div>
    </header>
  );
}

export default SectionSlider;
