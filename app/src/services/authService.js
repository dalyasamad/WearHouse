// Implements business logic between the API controllers and database repositories.

import { apiFetch } from "./apiFetch";
import { API_URL } from "../config/api";

// Registers a new user.
export async function registerUser(userData) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed."
    );
  }

  return data;
}

// Logs a user in.
export async function loginUser(credentials) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

  return data;
}

// Retrieves the authenticated user profile.
export async function getCurrentUser() {
  const response = await apiFetch(
    `${API_URL}/users/me`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load user."
    );
  }

  return data;
}

// Updates the authenticated user profile.
export async function updateCurrentUser(userData) {
  const response = await apiFetch(
    `${API_URL}/users/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update profile."
    );
  }

  return data;
}

// Deletes the authenticated user account and its associated data.
export async function deleteCurrentUser() {
  const response = await apiFetch(
    `${API_URL}/users/me`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete account."
    );
  }

  return data;
}