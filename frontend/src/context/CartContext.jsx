/**
 * Remembers the shopping cart in this browser.
 *
 * The cart is not stored in PostgreSQL. React keeps it in localStorage
 * until checkout. The API then prices the order from the product table.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { priceToPaise } from "../services/money";

const CART_KEY = "soilsoul-cart";
const CartContext = createContext(null);

function isCartItem(item) {
  return (
    item &&
    Number.isInteger(item.productId) &&
    typeof item.name === "string" &&
    typeof item.price === "string" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= 99
  );
}

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (!existing) {
        return [
          ...current,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, 99),
          },
        ];
      }
      return current.map((item) =>
        item.productId === product.id
          ? {
              ...item,
              price: product.price,
              quantity: Math.min(item.quantity + quantity, 99),
            }
          : item,
      );
    });
  }

  function updateQuantity(productId, quantity) {
    const nextQuantity = Math.max(1, Math.min(99, quantity));
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalPaise = items.reduce(
    (total, item) => total + priceToPaise(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalPaise,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return cart;
}
