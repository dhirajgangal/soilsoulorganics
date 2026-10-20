/**
 * Keeps the latest order confirmation in this browser tab.
 * sessionStorage is cleared when the tab closes. The API does not offer
 * a public "read order" route, because an order contains personal details.
 */

const ORDER_STORAGE_KEY = "soilsoul-latest-order";

export function saveOrder(order) {
  sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function readOrder(orderId) {
  try {
    const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const order = JSON.parse(raw);
    if (String(order.id) !== String(orderId)) {
      return null;
    }
    return order;
  } catch {
    return null;
  }
}
