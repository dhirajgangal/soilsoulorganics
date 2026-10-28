/** About Soil Soul, using the details printed on the product pack. */
import { Link } from "react-router-dom";
import BenefitList from "../components/BenefitList";
import Icon from "../components/Icon";
import usePageTitle from "../hooks/usePageTitle";
import packImage from "../assets/soil-improvement-powder.jpg";
import glowImage from "../assets/photos/plant-glow.png";
import moundImage from "../assets/photos/plant-mound.jpg";
import dewImage from "../assets/photos/plant-dew.png";
import skyImage from "../assets/photos/plant-sky.png";
import { company, soilEnhancerGranules, soilImprovementPowder } from "../content/pack";

const MARKS = [
  {
    title: "Healthy growth",
    text: "Promotes healthy root development and crop growth.",
    image: dewImage,
    alt: "A green seedling growing from a small mound of soil.",
    icon: "sprout",
  },
  {
    title: "Soil health",
    text: "Improves overall soil health and fertility.",
    image: moundImage,
    alt: "A young plant standing on a pile of dark soil.",
    icon: "layers",
  },
  {
    title: "For all crops",
    text: "Suitable for all types of crops.",
    image: skyImage,
    alt: "A small green plant growing from a pile of soil.",
    icon: "wheat",
  },
];

export default function AboutPage() {
  usePageTitle("About · Soil Soul");

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero-grid">
          <div>
            <p className="eyebrow">Let Soil Soul Nourish Nature</p>
            <h1>About Soil Soul</h1>
            <p>
              Soil Soul makes {soilImprovementPowder.name} and {soilEnhancerGranules.name}, both
              100% organic and natural soil enhancers. {soilImprovementPowder.name} is packed and
              marketed by {company.packedBy}.
            </p>
            <div className="hero-actions about-actions">
              <Link className="btn btn-primary" to="/products">
                View the products
                <Icon name="arrow" />
              </Link>
              <Link className="btn btn-secondary" to="/contact">
                <Icon name="chat" />
                Contact us
              </Link>
            </div>
          </div>
          <img
            className="page-hero-photo"
            src={glowImage}
            alt="A leafy green plant growing from a mound of soil."
          />
        </div>
      </section>

      <section className="section about-marks-section">
        <div className="wrap">
          <div className="mark-grid">
            {MARKS.map((mark) => (
              <article className="mark-card" key={mark.title}>
                <img src={mark.image} alt={mark.alt} />
                <h2>
                  <span className="icon-badge">
                    <Icon name={mark.icon} />
                  </span>
                  {mark.title}
                </h2>
                <p>{mark.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-pack-section">
        <div className="wrap about-pack">
          <img src={packImage} alt="Soil Soul Soil Improvement Powder pack, front and back." />
          <div>
            <p className="eyebrow">On the pack</p>
            <h2>{soilImprovementPowder.name}</h2>
            <p>{soilImprovementPowder.summary}</p>
            <h3>Recommended crops</h3>
            <p>{soilImprovementPowder.crops}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <h2>{soilImprovementPowder.name} benefits</h2>
            <p>{soilImprovementPowder.benefitsNote}</p>
          </div>
          <BenefitList />
        </div>
      </section>

      <section className="section about-company-section">
        <div className="wrap company-band">
          <div>
            <p className="eyebrow">Packed and marketed by</p>
            <h2>{company.packedBy}</h2>
            <p>GSTIN {company.gstin}</p>
            <p>Product of India</p>
          </div>
          <ul className="contact-cards">
            <li>
              <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                <span className="icon-badge">
                  <Icon name="whatsapp" />
                </span>
                <span className="way-copy">
                  <span>WhatsApp</span>
                  {company.whatsapp}
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`}>
                <span className="icon-badge">
                  <Icon name="mail" />
                </span>
                <span className="way-copy">
                  <span>Email</span>
                  {company.email}
                </span>
              </a>
            </li>
            <li>
              <a href={company.instagramHref} target="_blank" rel="noreferrer">
                <span className="icon-badge">
                  <Icon name="instagram" />
                </span>
                <span className="way-copy">
                  <span>Instagram</span>
                  {company.instagram}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
