/**
 * Checkout collects delivery details and sends the cart to POST /api/orders.
 * Only product ids, quantities, and the payment method are sent.
 * The API calculates the price. Cash on delivery is the only method for now.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder, getAddresses } from "../services/api";
import { formatPaise, priceToPaise } from "../services/money";
import { saveOrder } from "../services/orderStorage";
import { validateCheckout } from "../services/validation";

const EMPTY_FORM = {
  customer_name: "",
  email: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  notes: "",
};

function Field({ label, name, error, children }) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      {children}
      {error ? (
        <span className="field-error" id={`${name}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default function CheckoutPage() {
  const { items, subtotalPaise, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [addresses, setAddresses] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  usePageTitle("Checkout · Soil Soul");

  useEffect(() => {
    if (!user) {
      return undefined;
    }
    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || user.name,
      email: current.email || user.email,
      phone: current.phone || user.phone,
    }));
    let ignore = false;
    getAddresses()
      .then((rows) => {
        if (ignore) {
          return;
        }
        setAddresses(rows);
        const chosen = rows.find((row) => row.is_default) || rows[0];
        if (chosen) {
          setForm((current) => ({
            ...current,
            customer_name: chosen.full_name,
            phone: chosen.phone,
            address_line: chosen.address_line,
            city: chosen.city,
            state: chosen.state,
            postal_code: chosen.postal_code,
          }));
        }
      })
      .catch(() => {
        if (!ignore) {
          setAddresses([]);
        }
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  function applyAddress(addressId) {
    const chosen = addresses.find((row) => String(row.id) === addressId);
    if (!chosen) {
      return;
    }
    setForm((current) => ({
      ...current,
      customer_name: chosen.full_name,
      phone: chosen.phone,
      address_line: chosen.address_line,
      city: chosen.city,
      state: chosen.state,
      postal_code: chosen.postal_code,
    }));
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateCheckout(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone,
        address_line: form.address_line,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        notes: form.notes,
        payment_method: "cod",
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });
      saveOrder(order);
      clearCart();
      navigate(`/orders/${order.id}`, { state: { order } });
    } catch (requestError) {
      setFormError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <h1>Checkout</h1>
          <p>Your cart is empty, so there is nothing to order.</p>
          <Link className="btn btn-primary" to="/products">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-heading">
          <h1>Checkout</h1>
          <p>Enter your delivery details. You pay in cash when the order arrives.</p>
        </div>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            {formError ? <p className="banner banner-error">{formError}</p> : null}
            {user ? null : (
              <p className="muted">
                <Link to="/login" state={{ from: "/checkout" }}>Log in</Link> to use a saved address.
              </p>
            )}
            {addresses.length > 0 ? (
              <label className="field" htmlFor="saved_address">
                <span>Saved address</span>
                <select
                  id="saved_address"
                  defaultValue=""
                  onChange={(event) => applyAddress(event.target.value)}
                >
                  <option value="">Choose an address</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.full_name}, {address.city}
                      {address.is_default ? " (default)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <Field label="Full name" name="customer_name" error={errors.customer_name}>
              <input
                id="customer_name"
                name="customer_name"
                autoComplete="name"
                value={form.customer_name}
                onChange={updateField}
                aria-invalid={Boolean(errors.customer_name)}
                aria-describedby={errors.customer_name ? "customer_name-error" : undefined}
              />
            </Field>
            <div className="field-row">
              <Field label="Email" name="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>
              <Field label="Phone" name="phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </Field>
            </div>
            <Field label="Address" name="address_line" error={errors.address_line}>
              <input
                id="address_line"
                name="address_line"
                autoComplete="street-address"
                value={form.address_line}
                onChange={updateField}
                aria-invalid={Boolean(errors.address_line)}
                aria-describedby={errors.address_line ? "address_line-error" : undefined}
              />
            </Field>
            <div className="field-row">
              <Field label="City" name="city" error={errors.city}>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.city)}
                />
              </Field>
              <Field label="State" name="state" error={errors.state}>
                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.state)}
                />
              </Field>
            </div>
            <Field label="Postal code" name="postal_code" error={errors.postal_code}>
              <input
                id="postal_code"
                name="postal_code"
                autoComplete="postal-code"
                value={form.postal_code}
                onChange={updateField}
                aria-invalid={Boolean(errors.postal_code)}
                aria-describedby={errors.postal_code ? "postal_code-error" : undefined}
              />
            </Field>
            <Field label="Delivery note (optional)" name="notes" error={errors.notes}>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={form.notes}
                onChange={updateField}
                aria-invalid={Boolean(errors.notes)}
              />
            </Field>
            <fieldset className="payment-options">
              <legend>Payment</legend>
              <label className="payment-option" htmlFor="payment_cod">
                <input id="payment_cod" type="radio" name="payment_method" value="cod" checked readOnly />
                <span>
                  <strong>Cash on delivery</strong>
                  <span className="muted">Pay the courier in cash when your order arrives.</span>
                </span>
              </label>
              <p className="muted">Online payment is coming soon.</p>
            </fieldset>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Placing order…" : "Place order"}
            </Button>
          </form>
          <aside className="summary">
            <h2>Your order</h2>
            <ul className="summary-items">
              {items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPaise(priceToPaise(item.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPaise(subtotalPaise)}</strong>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>{formatPaise(subtotalPaise)}</strong>
            </div>
            <div className="summary-row">
              <span>Payment</span>
              <span>Cash on delivery</span>
            </div>
            <p className="muted">
              You pay this amount in cash on delivery. Nothing is charged now.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
