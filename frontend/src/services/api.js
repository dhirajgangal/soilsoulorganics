/**
 * Talks to the FastAPI backend.
 *
 * Each function sends one HTTP request and returns the JSON body.
 * The base address comes from frontend/.env (VITE_API_URL).
 */

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
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
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
