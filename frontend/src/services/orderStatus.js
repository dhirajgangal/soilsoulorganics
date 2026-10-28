/**
 * Words for the order status and payment values the API returns.
 * The steps match ORDER_STEPS in backend/app/models/order.py.
 */

export const ORDER_STEPS = [
  { key: "placed", label: "Order placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export function statusLabel(status) {
  if (status === "cancelled") {
    return "Cancelled";
  }
  const step = ORDER_STEPS.find((item) => item.key === status);
  return step ? step.label : "Order placed";
}

export function paymentLabel(order) {
  if (order.payment_method === "cod") {
    if (order.payment_status === "paid") {
      return "Cash on delivery · paid";
    }
    return order.status === "cancelled"
      ? "Cash on delivery · nothing to pay"
      : "Cash on delivery · pay when it arrives";
  }
  return order.payment_status === "paid" ? "Paid" : "Payment pending";
}

export function formatWhen(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
