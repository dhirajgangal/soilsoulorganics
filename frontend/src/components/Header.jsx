/** Top bar with the brand logo and the main links. */
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Icon from "./Icon";
import Logo from "./Logo";

export default function Header() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="wrap header-inner">
        <NavLink to="/" className="brand" aria-label="Soil Soul, home" end>
          <Logo size="header" alt="" />
        </NavLink>
        <nav id="main-nav" className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="header-tools">
          <NavLink
            to={user ? "/account" : "/login"}
            className={({ isActive }) => `icon-link${user ? " is-signed-in" : ""}${isActive ? " active" : ""}`}
            aria-label={user ? "Account" : "Log in"}
          >
            <Icon name="user" />
          </NavLink>
          <NavLink to="/cart" className="icon-link" aria-label={`Cart, ${itemCount} items`}>
            <Icon name="bag" />
            <span className="cart-count">{itemCount}</span>
          </NavLink>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
