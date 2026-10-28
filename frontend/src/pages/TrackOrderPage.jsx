/**
 * Anyone can check an order's delivery progress with the order number
 * and the email used at checkout. The API leaves out the street address and phone.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Field from "../components/Field";
import OrderTracker from "../components/OrderTracker";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import { trackOrder } from "../services/api";
import { formatPrice } from "../services/money";
import { formatWhen, paymentLabel, statusLabel } from "../services/orderStatus";

export default function TrackOrderPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState(location.state?.orderId ? String(location.state.orderId) : "");
  const [email, setEmail] = useState(location.state?.email || user?.email || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const autoLooked = useRef(false);

  usePageTitle("Track order · Soil Soul");

  async function lookUp(nextOrderId, nextEmail) {
    setError("");
    setOrder(null);
    if (!/^\d+$/.test(nextOrderId.trim()) || !nextEmail.trim()) {
      setError("Enter your order number and the email you used at checkout.");
      return;
    }
    setSubmitting(true);
    try {
      setOrder(await trackOrder(nextOrderId.trim(), nextEmail.trim()));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (autoLooked.current) {
      return;
    }
    autoLooked.current = true;
    if (location.state?.orderId && location.state?.email) {
      lookUp(String(location.state.orderId), location.state.email);
    }
  }, [location.state]);

  function handleSubmit(event) {
    event.preventDefault();
    lookUp(orderId, email);
  }

  return (
    <section className="section">
      <div className="wrap narrow">
        <div className="section-heading">
          <h1>Track your order</h1>
          <p>Enter the order number from your confirmation and the email you used at checkout.</p>
        </div>
        <form className="track-form" onSubmit={handleSubmit} noValidate>
          {error ? <p className="banner banner-error">{error}</p> : null}
          <div className="field-row">
            <Field label="Order number" name="order_id">
              <input
                id="order_id"
                name="order_id"
                inputMode="numeric"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
              />
            </Field>
            <Field label="Email" name="track_email">
              <input
                id="track_email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Checking…" : "Track order"}
          </Button>
        </form>
        {user ? (
          <p className="muted">
            Logged in? All your orders are also under <Link to="/account/orders">My orders</Link>.
          </p>
        ) : null}

        {order ? (
          <article className="receipt" aria-live="polite">
            <div className="receipt-head">
              <div>
                <p className="muted">Order number</p>
                <strong>{order.id}</strong>
              </div>
              <span className="status-pill">{statusLabel(order.status)}</span>
            </div>
            <p className="muted">
              Placed {formatWhen(order.created_at)} · Delivering to {order.city}, {order.state}
            </p>
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
              <span>Total</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>
            <div className="summary-row">
              <span>Payment</span>
              <span>{paymentLabel(order)}</span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
