/** Product photo for a Soil Soul pack. Unknown products keep a plain placeholder. */
import { findPackContent } from "../content/pack";

export default function PackImage({ productName }) {
  const content = findPackContent(productName);
  if (!content) {
    return "Photo coming soon";
  }

  return <img className="pack-photo" src={content.image} alt={content.imageAlt} />;
}
