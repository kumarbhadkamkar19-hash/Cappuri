// src/components/WhyChoose.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaGem, FaGlobe, FaCrown } from "react-icons/fa"; // ✅ icons
import "./WhyChoose.css";

const leftPanel = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const rightContainer = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, staggerChildren: 0.12 },
  },
};

const featureItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconAnim = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
};

const whyItems = [
  {
    id: 1,
    icon: <FaGem />, // 💎 replaced
    tag: "Premium Quality",
    title: "Premium Quality & Craftsmanship",
    desc: "We ensure exceptional quality in every product, combining fine craftsmanship with attention to detail for a truly luxurious experience.",
  },
  {
    id: 2,
    icon: <FaGlobe />, // 🌍 replaced
    tag: "Global Standards",
    title: "Global Standards, Indian Excellence",
    desc: "Proudly crafted in India, our products meet international quality standards and cater to global tastes.",
  },
  {
    id: 3,
    icon: <FaCrown />, // 👑 replaced
    tag: "Affordable Luxury",
    title: "Affordable Luxury",
    desc: "We bring you high-end designs and premium fragrances at accessible prices, making luxury a part of your everyday lifestyle.",
  },
];

const WhyChoose = () => {
  return (
    <section className="why-section">
      <div className="why-container">
        {/* LEFT PANEL */}
        <motion.div
          className="why-left"
          variants={leftPanel}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2 className="why-title">Why Choose Us?</h2>
          <p className="why-text">
            Four reasons that make our perfumes and jewellery your go-to choice
            for everyday luxury.
          </p>
          <span className="why-line"></span>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          className="why-right"
          variants={rightContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {whyItems.map((item) => (
            <motion.div
              className="feature-box"
              variants={featureItem}
              key={item.id}
            >
              <motion.div className="icon-circle" variants={iconAnim}>
                {item.icon}
              </motion.div>

              <div>
                <span className="feature-tag">{item.tag}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;