// Provides a reusable React hook for component state and behavior.


import { useState } from "react";

// Reads previously saved user information for client authentication.
function getStoredUser() {
  const storedUser =
    localStorage.getItem("wearhouse_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

// Manages reusable useAuth hook state and helper behavior.
function useAuth() {
  const [user, setUser] =
    useState(getStoredUser);

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        "wearhouse_token"
      )
    );

  function saveSession(data) {
    localStorage.setItem(
      "wearhouse_token",
      data.token
    );

    localStorage.setItem(
      "wearhouse_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  }

  function updateStoredUser(userData) {
    localStorage.setItem(
      "wearhouse_user",
      JSON.stringify(userData)
    );

    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(
      "wearhouse_token"
    );

    localStorage.removeItem(
      "wearhouse_user"
    );

    setToken(null);
    setUser(null);
  }

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    saveSession,
    updateStoredUser,
    logout,
  };
}

export default useAuth;