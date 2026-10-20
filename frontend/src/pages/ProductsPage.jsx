/** Product listing page. */
import ProductList from "../components/ProductList";
import usePageTitle from "../hooks/usePageTitle";

export default function ProductsPage() {
  usePageTitle("Products · Soil Soul");

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-heading">
          <h1>Products</h1>
          <p>Soil Improvement Powder, packed and marketed by Vayaora Organic Commodities.</p>
        </div>
        <ProductList />
      </div>
    </section>
  );
}
