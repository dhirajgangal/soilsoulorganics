/** Benefit lines from a pack, each with a small icon. */
import { soilImprovementPowder } from "../content/pack";
import Icon from "./Icon";

export default function BenefitList({ content = soilImprovementPowder }) {
  return (
    <ul className="benefit-grid">
      {content.benefits.map((benefit, index) => (
        <li key={benefit}>
          <span className="icon-badge">
            <Icon name={content.benefitIcons[index] || "check"} />
          </span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
