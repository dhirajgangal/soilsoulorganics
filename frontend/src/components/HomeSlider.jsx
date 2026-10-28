/**
 * Home page hero.
 * The tagline stays put; the photo and the short text below it change.
 * Buttons change the slide, and it also moves on its own unless the
 * visitor prefers less motion.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import moundImage from "../assets/photos/plant-mound.jpg";
import glowImage from "../assets/photos/plant-glow.png";
import trowelImage from "../assets/photos/trowel.jpg";
import { soilImprovementPowder } from "../content/pack";

const SLIDES = [
  {
    kicker: "Soil Soul",
    title: soilImprovementPowder.name,
    text: soilImprovementPowder.headline,
    image: moundImage,
    position: "center 60%",
    // White studio background, so it can blend into the sage page.
    blend: true,
    alt: "A young plant growing from a mound of dark soil.",
  },
  {
    kicker: "On the pack",
    title: "Stronger roots and healthy growth",
    text: "The pack marks stronger roots, healthy growth, 100% organic, and soil health.",
    image: glowImage,
    position: "center 45%",
    alt: "A leafy green seedling growing from soil.",
  },
  {
    kicker: "For the field",
    title: "For all types of crops",
    text: soilImprovementPowder.crops,
    image: trowelImage,
    position: "85% center",
    alt: "A garden trowel beside a small plant on dark soil.",
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
      className="hero"
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
      <div className="hero-photos">
        {SLIDES.map((slide, slideIndex) => {
          const active = slideIndex === index;
          const classes = ["hero-photo", active ? "is-active" : "", slide.blend ? "is-blend" : ""];
          return (
            <img
              key={slide.title}
              className={classes.join(" ").trim()}
              src={slide.image}
              alt={active ? slide.alt : ""}
              aria-hidden={!active}
              style={{ objectPosition: slide.position }}
            />
          );
        })}
      </div>

      <div className="wrap hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-caps">Let Soil Soul</span>
            <span className="hero-script">Nourish Nature</span>
          </h1>

          {SLIDES.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                className={active ? "hero-slide is-active" : "hero-slide"}
                key={slide.title}
                aria-hidden={!active}
              >
                <p className="eyebrow">{slide.kicker}</p>
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
              </div>
            );
          })}

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">
              View product
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-secondary" to="/about">
              About the pack
            </Link>
          </div>

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
      </div>
    </section>
  );
}
