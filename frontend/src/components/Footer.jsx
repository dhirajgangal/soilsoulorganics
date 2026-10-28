/** Shared bottom of every page. Company details come from the product pack. */
import { Link } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { company } from "../content/pack";
import { developer } from "../content/site";

const EXPLORE = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer>
      <div className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Soil Soul, home">
              <Logo size="footer" alt="" />
            </Link>
            <p>100% organic and natural soil enhancer.</p>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <p className="footer-label">Explore</p>
            {EXPLORE.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="footer-col">
            <p className="footer-label">Packed and marketed by</p>
            <p className="footer-company">{company.packedBy}</p>
            <p>GSTIN {company.gstin}</p>
            <p>Product of India</p>
          </div>

          <div className="footer-col">
            <p className="footer-label">Reach us</p>
            <a href={company.whatsappHref} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" />
              {company.whatsapp}
            </a>
            <a href={`mailto:${company.email}`}>
              <Icon name="mail" />
              {company.email}
            </a>
            <a href={company.instagramHref} target="_blank" rel="noreferrer">
              <Icon name="instagram" />
              {company.instagram}
            </a>
          </div>
        </div>
      </div>

      <div className="developer-bar">
        <p>
          Developed by {developer.name}
          <span aria-hidden="true"> · </span>
          <a href={developer.phoneHref}>
            <Icon name="phone" />
            {developer.phone}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${developer.email}`}>
            <Icon name="mail" />
            {developer.email}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={developer.whatsappHref} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" />
            WhatsApp
          </a>
        </p>
      </div>
    </footer>
  );
}
