/**
 * Turns API price strings into text the shopper can read.
 * A price arrives as "349.00". Currency is Indian rupees for now.
 */

export function priceToPaise(price) {
  return Math.round(Number(price) * 100);
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(price));
}

export function formatPaise(paise) {
  return formatPrice(paise / 100);
}

/** A price of 0 means the pack artwork did not list an M.R.P. */
export function hasSellingPrice(price) {
  return Number(price) > 0;
}
