/** Orders placed while this customer was logged in. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import usePageTitle from "../../hooks/usePageTitle";
import { getMyOrders } from "../../services/api";
import { formatPrice } from "../../services/money";

function formatWhen(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  usePageTitle("My orders · Soil Soul");

  useEffect(() => {
    let ignore = false;
    getMyOrders()
      .then((data) => {
        if (!ignore) {
          setOrders(data);
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

  return (
    <>
      <div className="page-kicker">
        <span className="kicker-icon">
          <Icon name="box" />
        </span>
        <div>
          <h1>My orders</h1>
          <p className="muted">Orders you place while logged in. Payment stays pending until it is collected.</p>
        </div>
      </div>
      {loading ? <p className="status-text">Loading orders…</p> : null}
      {error ? <p className="banner banner-error">{error}</p> : null}
      {!loading && !error && orders.length === 0 ? (
        <div className="empty-panel">
          <span className="empty-icon">
            <Icon name="box" />
          </span>
          <h2>No orders yet</h2>
          <p>When you check out while logged in, the order will show up here.</p>
          <Link className="btn btn-primary" to="/products">
            View the product
          </Link>
        </div>
      ) : null}
      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-head">
              <h2>
                <span className="kicker-icon kicker-icon-sm">
                  <Icon name="box" />
                </span>
                Order {order.id}
              </h2>
              <span className="status-pill">Pending payment</span>
            </div>
            <p className="muted">{formatWhen(order.created_at)}</p>
            <ul>
              {order.items.map((item) => (
                <li key={`${order.id}-${item.product_id}`}>
                  {item.product_name} × {item.quantity}
                </li>
              ))}
            </ul>
            <p>
              Deliver to {order.address_line}, {order.city}, {order.state} {order.postal_code}
            </p>
            <p className="price">{formatPrice(order.total)}</p>
          </article>
        ))}
      </div>
    </>
  );
}
