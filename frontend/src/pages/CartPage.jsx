/** Shopping cart. Quantities and removal stay in the browser until checkout. */
import { Link } from "react-router-dom";
import Button from "../components/Button";
import usePageTitle from "../hooks/usePageTitle";
import { useCart } from "../context/CartContext";
import { formatPaise, formatPrice, priceToPaise } from "../services/money";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotalPaise } = useCart();
  usePageTitle("Cart · Soil Soul");

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-heading">
          <h1>Your cart</h1>
          <p>Review the items, then continue to checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link className="btn btn-primary" to="/products">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-item" key={item.productId}>
                  <div>
                    <h2>
                      <Link to={`/products/${item.productId}`}>{item.name}</Link>
                    </h2>
                    <p className="muted">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="qty" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= 99}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-line-end">
                    <p className="price">
                      {formatPaise(priceToPaise(item.price) * item.quantity)}
                    </p>
                    <Button
                      type="button"
                      variant="quiet"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="summary">
              <h2>Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatPaise(subtotalPaise)}</strong>
              </div>
              <div className="summary-row">
                <span>Total</span>
                <strong>{formatPaise(subtotalPaise)}</strong>
              </div>
              <p className="muted">Shipping is not calculated yet. The server confirms the total at checkout.</p>
              <Link className="btn btn-primary btn-block" to="/checkout">
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
