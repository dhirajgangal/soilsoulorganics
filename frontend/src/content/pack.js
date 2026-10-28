/**
 * Facts taken from the Soil Soul pack artwork.
 * M.R.P., net weight, batch number, packing date, and expiry date
 * are blank on that artwork, so they are not listed here.
 * Product names must match the names in backend/app/db/seed.py.
 */
import powderAd from "../assets/products/soil-improvement-powder-ad.jpg";
import granulesAd from "../assets/products/soil-enhancer-granules-ad.jpg";

export const company = {
  packedBy: "Vayaora Organic Commodities",
  gstin: "24AQLPG9098F1ZH",
  whatsapp: "+91 88500 59500",
  whatsappHref: "https://wa.me/918850059500",
  email: "info@soilsoulorganics.shop",
  instagram: "@soilsoul.ind",
  instagramHref: "https://instagram.com/soilsoul.ind",
};

export const soilImprovementPowder = {
  name: "Soil Improvement Powder",
  headline: "100% organic and natural soil enhancer",
  summary:
    "100% organic and natural soil enhancer, suitable for all types of crops. Apply it to the soil and incorporate it uniformly during land preparation, or as recommended by an agricultural expert.",
  benefits: [
    "Helps improve soil NPK nutrient levels",
    "Helps increase organic carbon in soil",
    "Improves overall Soil fertility health and fertility",
    "Supports better nutrient availability and uptake",
    "Helps improve soil structure and biological activity",
    "Promotes healthy root development and crop growth",
    "Helps maintain long-term soil productivity",
    "100% organic and natural formulation",
    "Suitable for all types of crops",
  ],
  crops:
    "Recommended for all crops, including cereals, pulses, oilseeds, vegetables, fruits, flowers, plantation crops and other agricultural and horticultural crops.",
  application:
    "Apply to the soil and incorporate uniformly during land preparation or as recommended by an agricultural expert.",
  benefitIcons: ["drop", "layers", "leaf", "sun", "sprout", "roots", "wheat", "check", "wheat"],
  benefitsNote: "Printed on the back of the pack.",
  image: powderAd,
  imageAlt: "Soil Soul Soil Improvement Powder pack beside potted plants and soil.",
};

/** Only the marks printed on the granules pack and its poster are listed. */
export const soilEnhancerGranules = {
  name: "Soil Enhancer Granules",
  headline: "100% organic and natural soil enhancer",
  summary: "100% organic and natural soil enhancer granules, for all types of crops.",
  benefits: [
    "100% organic and natural soil enhancer",
    "Improves soil health",
    "Stronger roots",
    "Healthy growth",
    "For all types of crops",
  ],
  benefitIcons: ["leaf", "layers", "roots", "sprout", "wheat"],
  benefitsNote: "Marked on the pack.",
  crops: "For all types of crops.",
  image: granulesAd,
  imageAlt: "Soil Soul Soil Enhancer Granules pack beside potted plants and soil granules.",
};

export const packProducts = [soilImprovementPowder, soilEnhancerGranules];

export function findPackContent(productName) {
  return packProducts.find((item) => item.name === productName) || null;
}
