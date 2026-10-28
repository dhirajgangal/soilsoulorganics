/** Contact details printed on the Soil Improvement Powder pack. */
import Icon from "../components/Icon";
import usePageTitle from "../hooks/usePageTitle";
import trowelImage from "../assets/photos/trowel.jpg";
import { company } from "../content/pack";

const WAYS = [
  {
    label: "WhatsApp",
    value: company.whatsapp,
    href: company.whatsappHref,
    icon: "whatsapp",
    external: true,
  },
  {
    label: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
    icon: "mail",
  },
  {
    label: "Instagram",
    value: company.instagram,
    href: company.instagramHref,
    icon: "instagram",
    external: true,
  },
];

export default function ContactPage() {
  usePageTitle("Contact · Soil Soul");

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero-grid">
          <div>
            <p className="eyebrow">Soil Soul</p>
            <h1>Contact us</h1>
            <p>
              {company.packedBy} packs and markets Soil Improvement Powder.
              Reach them on WhatsApp, email, or Instagram.
            </p>
            <ul className="contact-cards">
              {WAYS.map((way) => (
                <li key={way.label}>
                  <a
                    href={way.href}
                    target={way.external ? "_blank" : undefined}
                    rel={way.external ? "noreferrer" : undefined}
                  >
                    <span className="icon-badge">
                      <Icon name={way.icon} />
                    </span>
                    <span className="way-copy">
                      <span>{way.label}</span>
                      {way.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <img
            className="page-hero-photo"
            src={trowelImage}
            alt="A garden trowel beside a small plant with soil on its roots."
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap company-note">
          <p className="eyebrow">Company</p>
          <h2>{company.packedBy}</h2>
          <p>GSTIN {company.gstin}</p>
          <p>Product of India</p>
        </div>
      </section>
    </>
  );
}
