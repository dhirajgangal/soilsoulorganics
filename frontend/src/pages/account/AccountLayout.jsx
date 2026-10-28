/** Side navigation shared by every account page. */
import { NavLink, Outlet } from "react-router-dom";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/account", label: "My account", icon: "home", end: true },
  { to: "/account/orders", label: "My orders", icon: "box" },
  { to: "/account/wishlist", label: "Wishlist", icon: "heart" },
  { to: "/account/addresses", label: "Addresses", icon: "pin" },
  { to: "/account/profile", label: "My profile", icon: "user" },
];

export default function AccountLayout() {
  const { logout } = useAuth();

  return (
    <section className="section account-section">
      <div className="wrap account-layout">
        <nav className="account-nav" aria-label="Account">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
          <button type="button" onClick={logout}>
            <Icon name="logout" />
            Log out
          </button>
        </nav>
        <div className="account-main">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
