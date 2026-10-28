/**
 * Shows the order returned by POST /api/orders.
 * The response is kept in this browser tab so a refresh still works.
 * Later progress is on the Track order page, which needs the order number and email.
 */
import { Link, useLocation, useParams } from "react-router-dom";
import OrderTracker from "../components/OrderTracker";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../services/money";
import { readOrder } from "../services/orderStorage";
import { formatWhen, paymentLabel, statusLabel } from "../services/orderStatus";

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
            To check an earlier order, use Track order with your order number and email.
          </p>
          <Link className="btn btn-primary" to="/track-order" state={{ orderId }}>
            Track an order
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap narrow">
        <p className="eyebrow">Order received</p>
        <h1>Thank you, {order.customer_name.split(" ")[0]}.</h1>
        <p>
          Your order is placed. Please keep {formatPrice(order.total)} ready in cash for the
          courier. Note your order number to track it.
        </p>
        <article className="receipt">
          <div className="receipt-head">
            <div>
              <p className="muted">Order number</p>
              <strong>{order.id}</strong>
            </div>
            <span className="status-pill">{statusLabel(order.status)}</span>
          </div>
          <p className="muted">Placed {formatWhen(order.created_at)}</p>
          <OrderTracker order={order} />
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
          <div className="summary-row">
            <span>Payment</span>
            <span>{paymentLabel(order)}</span>
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
        <div className="button-row">
          <Link
            className="btn btn-primary"
            to="/track-order"
            state={{ orderId: order.id, email: order.email }}
          >
            Track this order
          </Link>
          <Link className="btn btn-secondary" to="/products">
            Continue browsing
          </Link>
        </div>
      </div>
    </section>
  );
}
