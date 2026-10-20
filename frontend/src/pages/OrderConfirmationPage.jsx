/**
 * Shows the order returned by POST /api/orders.
 * The response is kept in this browser tab so a refresh still works.
 * It is not loaded again from the API, because the order contains private details.
 */
import { Link, useLocation, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../services/money";
import { readOrder } from "../services/orderStorage";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order || readOrder(orderId);

  usePageTitle(order ? `Order ${order.id} · Soil Soul` : "Order · Soil Soul");

  if (!order) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <h1>Order confirmation</h1>
          <p>
            This page can show an order just placed in this browser tab.
            The order itself is stored in the database.
          </p>
          <Link className="btn btn-primary" to="/products">
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  const placedOn = new Date(order.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <section className="section">
      <div className="wrap narrow">
        <p className="eyebrow">Order received</p>
        <h1>Thank you, {order.customer_name.split(" ")[0]}.</h1>
        <p>Your order is saved. No payment has been collected.</p>
        <article className="receipt">
          <div className="receipt-head">
            <div>
              <p className="muted">Order number</p>
              <strong>{order.id}</strong>
            </div>
            <span className="status-pill">Pending payment</span>
          </div>
          <p className="muted">Placed {placedOn}</p>
          <ul className="summary-items">
            {order.items.map((item) => (
              <li key={`${item.product_id}-${item.product_name}`}>
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(order.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
          <div className="receipt-address">
            <h2>Delivery</h2>
            <p>{order.customer_name}</p>
            <p>{order.address_line}</p>
            <p>
              {order.city}, {order.state} {order.postal_code}
            </p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            {order.notes ? <p>Note: {order.notes}</p> : null}
          </div>
        </article>
        <Link className="btn btn-secondary" to="/products">
          Continue browsing
        </Link>
      </div>
    </section>
  );
}
