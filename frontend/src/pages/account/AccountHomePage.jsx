/** Short welcome and the main account links. */
import { Link } from "react-router-dom";
import plantGlow from "../../assets/photos/plant-glow.png";
import Icon from "../../components/Icon";
import usePageTitle from "../../hooks/usePageTitle";
import { useAuth } from "../../context/AuthContext";

const SHORTCUTS = [
  {
    to: "/account/orders",
    icon: "box",
    title: "My orders",
    text: "Orders you place while logged in.",
  },
  {
    to: "/account/wishlist",
    icon: "heart",
    title: "Wishlist",
    text: "Products you saved for later.",
  },
  {
    to: "/account/addresses",
    icon: "pin",
    title: "Addresses",
    text: "Delivery addresses for checkout.",
  },
  {
    to: "/account/profile",
    icon: "user",
    title: "My profile",
    text: "Name, phone, email, and password.",
  },
];

export default function AccountHomePage() {
  const { user } = useAuth();
  usePageTitle("My account · Soil Soul");
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <>
      <div className="account-hero">
        <span className="avatar" aria-hidden="true">
          {initial}
        </span>
        <div>
          <p className="eyebrow">My account</p>
          <h1>Hello, {user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <img className="account-hero-photo" src={plantGlow} alt="" />
      </div>
      <div className="account-shortcuts">
        {SHORTCUTS.map((item) => (
          <Link to={item.to} key={item.to}>
            <span className="shortcut-icon">
              <Icon name={item.icon} />
            </span>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
