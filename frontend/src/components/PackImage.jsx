/** Pack photo for Soil Improvement Powder. Other products keep a plain placeholder. */
import packImage from "../assets/soil-improvement-powder.jpg";
import { soilImprovementPowder } from "../content/pack";

export default function PackImage({ productName }) {
  if (productName !== soilImprovementPowder.name) {
    return "Photo coming soon";
  }

  return (
    <img
      className="pack-photo"
      src={packImage}
      alt="Soil Soul Soil Improvement Powder pack, front and back."
    />
  );
}
