/** Top bar with the brand logo and the main links. */
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <NavLink to="/" className="brand" aria-label="Soil Soul, home" end>
          <Logo size="header" alt="" />
        </NavLink>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart">
            Cart
            <span className="cart-count">{itemCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
