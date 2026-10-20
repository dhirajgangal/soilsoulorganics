/** One product, loaded from GET /api/products/{id}. */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import PackImage from "../components/PackImage";
import ProductFacts from "../components/ProductFacts";
import usePageTitle from "../hooks/usePageTitle";
import { useCart } from "../context/CartContext";
import { soilImprovementPowder } from "../content/pack";
import { getProduct } from "../services/api";
import { formatPrice, hasSellingPrice } from "../services/money";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  usePageTitle(product ? `${product.name} · Soil Soul` : "Product · Soil Soul");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    setProduct(null);
    setQuantity(1);
    setAdded(false);

    getProduct(productId)
      .then((data) => {
        if (!ignore) {
          setProduct(data);
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
  }, [productId]);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
  }

  if (loading) {
    return (
      <section className="section">
        <div className="wrap">
          <p className="status-text">Loading product…</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <p className="banner banner-error">{error || "Product not found."}</p>
          <Link className="btn btn-secondary" to="/products">
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  const priced = hasSellingPrice(product.price);
  const isPowder = product.name === soilImprovementPowder.name;

  return (
    <section className="section">
      <div className="wrap detail">
        <div className="detail-art">
          <PackImage productName={product.name} />
        </div>
        <div>
          <p className="eyebrow">
            <Link to="/products">Products</Link>
          </p>
          <h1>{product.name}</h1>
          <p className="price price-large">
            {priced ? formatPrice(product.price) : "M.R.P. not listed yet"}
          </p>
          <p>{product.description}</p>
          {priced ? (
            <div className="detail-buy">
              <label className="field qty-field">
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isInteger(next)) {
                      setQuantity(Math.max(1, Math.min(99, next)));
                    }
                  }}
                />
              </label>
              <Button type="button" onClick={handleAdd}>
                {added ? "Added to cart" : "Add to cart"}
              </Button>
            </div>
          ) : (
            <p className="muted">The pack artwork leaves the M.R.P. blank, so this item is not for sale yet.</p>
          )}
        </div>
      </div>
      {isPowder ? (
        <div className="wrap product-facts-wrap">
          <ProductFacts />
        </div>
      ) : null}
    </section>
  );
}
