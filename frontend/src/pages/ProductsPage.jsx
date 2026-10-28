/** Product listing page. */
import ProductList from "../components/ProductList";
import { soilEnhancerGranules, soilImprovementPowder } from "../content/pack";
import usePageTitle from "../hooks/usePageTitle";

export default function ProductsPage() {
	usePageTitle("Products · Soil Soul");

	return (
		<section className="section">
			<div className="wrap">
				<div className="section-heading">
					<h1>Products</h1>
					<p>
						{soilImprovementPowder.name} and {soilEnhancerGranules.name}, both 100% organic and
						natural soil enhancers.
					</p>
				</div>
				<ProductList />
			</div>
		</section>
	);
}
