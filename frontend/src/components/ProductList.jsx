/**
 * Loads products from GET /api/products and renders a card for each one.
 * Home and the products page both use this component.
 */
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

export default function ProductList() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getProducts()
      .then((data) => {
        if (!ignore) {
          setProducts(data);
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

  if (loading) {
    return <p className="status-text">Loading products…</p>;
  }
  if (error) {
    return <p className="banner banner-error">{error}</p>;
  }
  if (products.length === 0) {
    return <p className="status-text">No products are listed yet.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={addItem} />
      ))}
    </div>
  );
}
