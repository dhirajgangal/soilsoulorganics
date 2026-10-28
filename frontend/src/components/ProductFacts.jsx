/** Sections printed on a Soil Soul pack. */
import BenefitList from "./BenefitList";
import Icon from "./Icon";

export default function ProductFacts({ content }) {
  return (
    <div className="product-facts">
      <h2>Product benefits</h2>
      <p className="muted">{content.benefitsNote}</p>
      <BenefitList content={content} />
      <h2 className="facts-heading">
        <Icon name="wheat" />
        Recommended crops
      </h2>
      <p>{content.crops}</p>
      {content.application ? (
        <>
          <h2 className="facts-heading">
            <Icon name="sprout" />
            Application
          </h2>
          <p>{content.application}</p>
        </>
      ) : null}
    </div>
  );
}
