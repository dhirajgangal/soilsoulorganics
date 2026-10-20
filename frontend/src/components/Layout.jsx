/**
 * Wraps every page with the same header and footer.
 * <Outlet /> is where React Router renders the current page.
 */
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header />
      <main className="main" id="content">
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
    </div>
  );
}
