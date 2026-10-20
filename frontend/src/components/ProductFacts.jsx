/** Sections printed on the Soil Improvement Powder pack. */
import { soilImprovementPowder } from "../content/pack";
import BenefitList from "./BenefitList";
import Icon from "./Icon";

export default function ProductFacts() {
  return (
    <div className="product-facts">
      <h2>Product benefits</h2>
      <BenefitList />
      <h2 className="facts-heading">
        <Icon name="wheat" />
        Recommended crops
      </h2>
      <p>{soilImprovementPowder.crops}</p>
      <h2 className="facts-heading">
        <Icon name="sprout" />
        Application
      </h2>
      <p>{soilImprovementPowder.application}</p>
    </div>
  );
}
