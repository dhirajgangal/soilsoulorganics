/**
 * Home page slider.
 * The slides use the Soil Improvement Powder pack. Buttons change the slide,
 * and it also moves on its own unless the visitor prefers less motion.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import handsImage from "../assets/photos/hands.jpg";
import sunImage from "../assets/photos/seedling-sun.jpg";
import fieldImage from "../assets/photos/seedling-field.jpg";
import { soilImprovementPowder } from "../content/pack";

const SLIDES = [
  {
    kicker: "Soil Soul",
    title: soilImprovementPowder.name,
    text: soilImprovementPowder.headline,
    image: handsImage,
    position: "center 42%",
    alt: "Hands holding soil around a small green plant.",
  },
  {
    kicker: "On the pack",
    title: "Stronger roots and healthy growth",
    text: "The pack marks stronger roots, healthy growth, 100% organic, and soil health.",
    image: sunImage,
    position: "center 40%",
    alt: "A young seedling growing in dark soil.",
  },
  {
    kicker: "For the field",
    title: "For all types of crops",
    text: soilImprovementPowder.crops,
    image: fieldImage,
    position: "68% 32%",
    alt: "A small plant growing from a mound of soil.",
  },
];

export default function HomeSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || paused) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  function showSlide(nextIndex) {
    const total = SLIDES.length;
    setIndex((nextIndex + total) % total);
  }

  return (
    <section
      className="slider"
      aria-roledescription="carousel"
      aria-label="Soil Soul highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="wrap slider-frame">
        {SLIDES.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const Title = active ? "h1" : "h2";
          return (
            <article
              className={active ? "slide is-active" : "slide"}
              key={slide.title}
              aria-hidden={!active}
            >
              <div className="slide-copy">
                <p className="eyebrow">{slide.kicker}</p>
                <Title>{slide.title}</Title>
                <p>{slide.text}</p>
                <div className="hero-actions">
                  <Link className="btn btn-primary" to="/products">
                    View product
                    <Icon name="arrow" />
                  </Link>
                  <Link className="btn btn-secondary" to="/about">
                    <Icon name="leaf" />
                    About the pack
                  </Link>
                </div>
              </div>
              <div className="slide-visual">
                <img
                  src={slide.image}
                  alt={active ? slide.alt : ""}
                  style={{ objectPosition: slide.position }}
                />
              </div>
            </article>
          );
        })}

        <div className="slider-controls">
          <button type="button" onClick={() => showSlide(index - 1)} aria-label="Previous slide">
            <Icon name="chevronLeft" />
          </button>
          <div className="slider-dots" role="tablist" aria-label="Slides">
            {SLIDES.map((slide, slideIndex) => (
              <button
                key={slide.title}
                type="button"
                role="tab"
                className={slideIndex === index ? "is-active" : undefined}
                aria-label={slide.title}
                aria-selected={slideIndex === index}
                onClick={() => showSlide(slideIndex)}
              />
            ))}
          </div>
          <button type="button" onClick={() => showSlide(index + 1)} aria-label="Next slide">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
    </section>
  );
}
