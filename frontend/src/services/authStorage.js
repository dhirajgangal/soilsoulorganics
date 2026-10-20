/** The login token stays in this browser until the customer logs out. */

const TOKEN_KEY = "soilsoul-token";

export function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
