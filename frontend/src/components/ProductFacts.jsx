/** Sections printed on the Soil Improvement Powder pack. */
import { soilImprovementPowder } from "../content/pack";

export default function ProductFacts() {
  return (
    <div className="product-facts">
      <h2>Product benefits</h2>
      <ul>
        {soilImprovementPowder.benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
      <h2>Recommended crops</h2>
      <p>{soilImprovementPowder.crops}</p>
      <h2>Application</h2>
      <p>{soilImprovementPowder.application}</p>
    </div>
  );
}
