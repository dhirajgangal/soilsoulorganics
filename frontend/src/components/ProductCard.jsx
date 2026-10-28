/** One product in a list: name, price, description, and actions. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import PackImage from "./PackImage";
import WishlistButton from "./WishlistButton";
import { formatPrice, hasSellingPrice } from "../services/money";

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return undefined;
    }
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  const priced = hasSellingPrice(product.price);

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card-art">
        <PackImage productName={product.name} />
      </Link>
      <div className="card-body">
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="price">{priced ? formatPrice(product.price) : "M.R.P. not listed yet"}</p>
        <p className="card-copy">{product.description}</p>
        <div className="card-actions">
          <Link className="btn btn-secondary" to={`/products/${product.id}`}>
            View details
          </Link>
          {priced ? (
            <Button type="button" onClick={() => { onAdd(product); setAdded(true); }}>
              {added ? "Added" : "Add to cart"}
            </Button>
          ) : null}
          <WishlistButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
