/** Home page: slider, pack highlights, and the current product. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BenefitList from "../components/BenefitList";
import HomeSlider from "../components/HomeSlider";
import Icon from "../components/Icon";
import usePageTitle from "../hooks/usePageTitle";
import packImage from "../assets/soil-improvement-powder.jpg";
import handsImage from "../assets/photos/hands.jpg";
import growthImage from "../assets/photos/growth.png";
import sunImage from "../assets/photos/seedling-sun.jpg";
import soilImage from "../assets/photos/seedling-soil.jpg";
import fieldImage from "../assets/photos/seedling-field.jpg";
import { company, soilImprovementPowder } from "../content/pack";
import { getProducts } from "../services/api";
import { formatPrice, hasSellingPrice } from "../services/money";

const HIGHLIGHTS = [
  {
    title: "Stronger roots",
    text: "Promotes healthy root development and crop growth.",
    image: handsImage,
    alt: "Hands cupping soil around a small plant.",
    icon: "roots",
  },
  {
    title: "Healthy growth",
    text: "Helps maintain long-term soil productivity.",
    image: sunImage,
    alt: "A seedling standing in sunlit soil.",
    icon: "sprout",
  },
  {
    title: "100% organic",
    text: "100% organic and natural formulation.",
    image: soilImage,
    alt: "A young plant growing out of rich soil.",
    icon: "leaf",
  },
  {
    title: "Soil health",
    text: "Improves overall soil health and fertility.",
    image: fieldImage,
    alt: "A small plant on a ridge of dark soil.",
    icon: "layers",
  },
];

export default function HomePage() {
  const [product, setProduct] = useState(null);
  usePageTitle("Soil Soul");

  useEffect(() => {
    let ignore = false;
    getProducts()
      .then((data) => {
        if (!ignore) {
          setProduct(data[0] || null);
        }
      })
      .catch(() => {
        if (!ignore) {
          setProduct(null);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const productPath = product ? `/products/${product.id}` : "/products";
  const priced = product && hasSellingPrice(product.price);

  return (
    <>
      <HomeSlider />

      <section className="section home-highlights">
        <div className="wrap">
          <div className="section-heading">
            <h2>From the pack</h2>
            <p>Four marks printed on the Soil Improvement Powder label.</p>
          </div>
          <div className="highlight-grid">
            {HIGHLIGHTS.map((item) => (
              <article className="highlight-card" key={item.title}>
                <div className="highlight-photo">
                  <img src={item.image} alt={item.alt} />
                  <span className="icon-badge">
                    <Icon name={item.icon} />
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-feature-section">
        <div className="wrap feature">
          <img
            src={packImage}
            alt="Soil Soul Soil Improvement Powder pack, front and back."
          />
          <div className="feature-copy">
            <p className="eyebrow">The product</p>
            <h2>{soilImprovementPowder.name}</h2>
            <p className="price">{priced ? formatPrice(product.price) : "M.R.P. not listed yet"}</p>
            <p>{soilImprovementPowder.summary}</p>
            <Link className="btn btn-primary" to={productPath}>
              View details
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <h2>Product benefits</h2>
            <p>Printed on the back of the pack.</p>
          </div>
          <BenefitList />
        </div>
      </section>

      <section className="section home-growth-section">
        <div className="wrap growth-band">
          <img src={growthImage} alt="Four stages of a plant growing from a small sprout." />
          <div>
            <p className="eyebrow">Healthy growth</p>
            <h2>From a sprout to a full plant</h2>
            <p>
              The pack says this powder promotes healthy root development and crop growth,
              and helps maintain long-term soil productivity.
            </p>
          </div>
        </div>
      </section>

      <section className="section home-band-section">
        <div className="wrap crop-band">
          <div>
            <p className="eyebrow eyebrow-icon">
              <Icon name="wheat" />
              Recommended crops
            </p>
            <h2>For all types of crops</h2>
            <p>{soilImprovementPowder.crops}</p>
          </div>
          <div>
            <p className="eyebrow eyebrow-icon">
              <Icon name="sprout" />
              Application
            </p>
            <p>{soilImprovementPowder.application}</p>
            <a className="btn btn-secondary" href={company.whatsappHref}>
              <Icon name="chat" />
              WhatsApp {company.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
