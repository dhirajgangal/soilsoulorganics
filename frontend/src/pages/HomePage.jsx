/** Home page: slider, pack highlights, and the product list. */
import BenefitList from "../components/BenefitList";
import HomeSlider from "../components/HomeSlider";
import Icon from "../components/Icon";
import ProductList from "../components/ProductList";
import usePageTitle from "../hooks/usePageTitle";
import handsImage from "../assets/photos/hands.jpg";
import growthImage from "../assets/photos/growth.png";
import sunImage from "../assets/photos/seedling-sun.jpg";
import soilImage from "../assets/photos/seedling-soil.jpg";
import fieldImage from "../assets/photos/seedling-field.jpg";
import { company, soilEnhancerGranules, soilImprovementPowder } from "../content/pack";

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
    usePageTitle("Soil Soul");

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
                <div className="wrap">
                    <div className="section-heading">
                        <p className="eyebrow">Our products</p>
                        <h2>Two ways to feed your soil</h2>
                        <p>{soilImprovementPowder.name} and {soilEnhancerGranules.name}.</p>
                    </div>
                    <ProductList />
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
                        <a className="btn btn-secondary" href={company.whatsappHref} target="_blank" rel="noreferrer">
                            <Icon name="whatsapp" />
                            {company.whatsapp}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
