// Provides a shared API request helper for communication with the backend.


// Implements the apiFetch operation for this module.
export async function apiFetch(url, options = {}) {
  const token =
    localStorage.getItem("wearhouse_token");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("wearhouse_token");
    localStorage.removeItem("wearhouse_user");

    window.location.href = "/login";

    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return response;
}