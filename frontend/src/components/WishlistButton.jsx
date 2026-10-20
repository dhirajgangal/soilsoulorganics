/** Saves or removes a product from the signed-in customer's wishlist. */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addWishlist, getWishlist, removeWishlist } from "../services/api";

export default function WishlistButton({ productId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return undefined;
    }
    let ignore = false;
    getWishlist()
      .then((items) => {
        if (!ignore) {
          setSaved(items.some((item) => item.product_id === Number(productId)));
        }
      })
      .catch(() => {
        if (!ignore) {
          setSaved(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [user, productId]);

  async function toggle() {
    if (!user) {
      navigate("/login", { state: { from: `/products/${productId}` } });
      return;
    }
    setBusy(true);
    try {
      if (saved) {
        await removeWishlist(productId);
        setSaved(false);
      } else {
        await addWishlist(productId);
        setSaved(true);
      }
    } catch {
      // Leave the button as it was. The account page shows the saved list.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="wish-button" onClick={toggle} disabled={busy}>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
