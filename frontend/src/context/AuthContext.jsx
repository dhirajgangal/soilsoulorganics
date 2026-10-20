/**
 * Remembers who is logged in.
 * The token lives in localStorage. The user record is loaded from the API.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginAccount, logoutAccount, registerAccount } from "../services/api";
import { clearToken, readToken, saveToken } from "../services/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!readToken()) {
      setReady(true);
      return undefined;
    }
    let ignore = false;
    getMe()
      .then((profile) => {
        if (!ignore) {
          setUser(profile);
        }
      })
      .catch(() => {
        clearToken();
        if (!ignore) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setReady(true);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function login(email, password) {
    const result = await loginAccount({ email, password });
    saveToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function register(body) {
    const result = await registerAccount(body);
    saveToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    try {
      await logoutAccount();
    } catch {
      // The local token is cleared either way.
    }
    clearToken();
    setUser(null);
  }

  function replaceUser(profile) {
    setUser(profile);
  }

  const value = useMemo(
    () => ({ user, ready, login, register, logout, replaceUser }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
