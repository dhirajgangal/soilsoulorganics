/**
 * Talks to the FastAPI backend.
 *
 * Each function sends one HTTP request and returns the JSON body.
 * The base address comes from frontend/.env (VITE_API_URL).
 */

import { readToken } from "./authStorage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function errorMessage(body) {
  if (!body) {
    return "Something went wrong. Please try again.";
  }
  if (typeof body.detail === "string") {
    return body.detail;
  }
  if (Array.isArray(body.detail)) {
    const messages = body.detail
      .map((item) => item.msg)
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }
  return "Something went wrong. Please try again.";
}

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const token = readToken();
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    });
  } catch {
    throw new Error("Could not reach the shop API. Check that the backend is running.");
  }

  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new Error(errorMessage(body));
  }

  return response.json();
}

export function getProducts() {
  return request("/api/products");
}

export function getProduct(productId) {
  return request(`/api/products/${productId}`);
}

export function createOrder(order) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function registerAccount(body) {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
}

export function loginAccount(body) {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
}

export function logoutAccount() {
  return request("/api/auth/logout", { method: "POST" });
}

export function forgotPassword(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(body) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getMe() {
  return request("/api/account/me");
}

export function updateProfile(body) {
  return request("/api/account/me", { method: "PATCH", body: JSON.stringify(body) });
}

export function changePassword(body) {
  return request("/api/account/password", { method: "POST", body: JSON.stringify(body) });
}

export function getMyOrders() {
  return request("/api/account/orders");
}

export function getAddresses() {
  return request("/api/account/addresses");
}

export function createAddress(body) {
  return request("/api/account/addresses", { method: "POST", body: JSON.stringify(body) });
}

export function deleteAddress(addressId) {
  return request(`/api/account/addresses/${addressId}`, { method: "DELETE" });
}

export function makeDefaultAddress(addressId) {
  return request(`/api/account/addresses/${addressId}/default`, { method: "POST" });
}

export function getWishlist() {
  return request("/api/account/wishlist");
}

export function addWishlist(productId) {
  return request(`/api/account/wishlist/${productId}`, { method: "POST" });
}

export function removeWishlist(productId) {
  return request(`/api/account/wishlist/${productId}`, { method: "DELETE" });
}
