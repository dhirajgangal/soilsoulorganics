/** Shared bottom of every page. Company details come from the product pack. */
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { company } from "../content/pack";
import { developer } from "../content/site";

export default function Footer() {
  return (
    <footer>
      <div className="site-footer">
        <div className="wrap footer-inner">
          <Link to="/" aria-label="Soil Soul, home">
            <Logo size="footer" alt="" />
          </Link>
          <p>Packed and marketed by {company.packedBy}</p>
          <p className="muted">
            <a href={company.whatsappHref}>WhatsApp {company.whatsapp}</a>
            {" · "}
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </div>
      </div>
      <div className="developer-bar">
        <p>
          Developed by {developer.name}
          {" · "}
          <a href={developer.phoneHref}>{developer.phone}</a>
          {" · "}
          <a href={`mailto:${developer.email}`}>{developer.email}</a>
          {" · "}
          <a href={developer.whatsappHref}>WhatsApp</a>
        </p>
      </div>
    </footer>
  );
}
