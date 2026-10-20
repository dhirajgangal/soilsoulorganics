/** Products the customer saved. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import usePageTitle from "../../hooks/usePageTitle";
import { getWishlist, removeWishlist } from "../../services/api";
import { formatPrice, hasSellingPrice } from "../../services/money";

export default function AccountWishlistPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  usePageTitle("Wishlist · Soil Soul");

  useEffect(() => {
    let ignore = false;
    getWishlist()
      .then((data) => {
        if (!ignore) {
          setItems(data);
        }
      })
      .catch((requestError) => {
        if (!ignore) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function remove(productId) {
    setError("");
    try {
      await removeWishlist(productId);
      setItems((current) => current.filter((item) => item.product_id !== productId));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-kicker">
        <span className="kicker-icon">
          <Icon name="heart" />
        </span>
        <div>
          <h1>Wishlist</h1>
          <p className="muted">Products you saved from the shop.</p>
        </div>
      </div>
      {loading ? <p className="status-text">Loading wishlist…</p> : null}
      {error ? <p className="banner banner-error">{error}</p> : null}
      {!loading && items.length === 0 ? (
        <div className="empty-panel">
          <span className="empty-icon">
            <Icon name="heart" />
          </span>
          <h2>Nothing saved yet</h2>
          <p>Tap Save on a product and it will wait for you here.</p>
          <Link className="btn btn-primary" to="/products">
            Browse products
          </Link>
        </div>
      ) : null}
      <div className="order-list">
        {items.map((item) => (
          <article className="order-card" key={item.product_id}>
            <h2>
              <span className="kicker-icon kicker-icon-sm">
                <Icon name="heart" />
              </span>
              <Link to={`/products/${item.product_id}`}>{item.name}</Link>
            </h2>
            <p className="price">
              {hasSellingPrice(item.price) ? formatPrice(item.price) : "M.R.P. not listed yet"}
            </p>
            <p>{item.description}</p>
            <Button type="button" variant="secondary" onClick={() => remove(item.product_id)}>
              Remove
            </Button>
          </article>
        ))}
      </div>
    </>
  );
}
