/** Benefit lines from the pack, each with a small icon. */
import { soilImprovementPowder } from "../content/pack";
import Icon from "./Icon";

const ICONS = ["drop", "layers", "leaf", "sun", "sprout", "roots", "wheat", "check", "wheat"];

export default function BenefitList() {
  return (
    <ul className="benefit-grid">
      {soilImprovementPowder.benefits.map((benefit, index) => (
        <li key={benefit}>
          <span className="icon-badge">
            <Icon name={ICONS[index]} />
          </span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
