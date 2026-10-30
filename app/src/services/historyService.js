// Implements business logic between the API controllers and database repositories.


import { apiFetch } from "./apiFetch";

const API_URL = "http://localhost:3000";

// Implements the getWearHistory operation for this module.
export async function getWearHistory() {
  const response = await apiFetch(
    `${API_URL}/wear-history`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load wear history."
    );
  }

  return data;
}