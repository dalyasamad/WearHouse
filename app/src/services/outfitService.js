// Implements business logic between the API controllers and database repositories.

import { apiFetch } from "./apiFetch";
import { API_URL } from "../config/api";

// Implements the getOutfits operation for this module.
export async function getOutfits() {
  const response = await apiFetch(
    `${API_URL}/outfits`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load outfits."
    );
  }

  return data;
}

// Creates an outfit and associates its selected clothing items.
export async function createOutfit(outfitData) {
  const response = await apiFetch(
    `${API_URL}/outfits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(outfitData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create outfit."
    );
  }

  return data;
}

// Implements the getOutfit operation for this module.
export async function getOutfit(id) {
  const response = await apiFetch(
    `${API_URL}/outfits/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load outfit."
    );
  }

  return data;
}

// Updates outfit details and replaces its clothing selections.
export async function updateOutfit(
  id,
  outfitData
) {
  const response = await apiFetch(
    `${API_URL}/outfits/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(outfitData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update outfit."
    );
  }

  return data;
}

// Deletes the selected outfit.
export async function deleteOutfit(id) {
  const response = await apiFetch(
    `${API_URL}/outfits/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to delete outfit."
    );
  }

  return data;
}

// Implements the toggleOutfitFavorite operation for this module.
export async function toggleOutfitFavorite(id) {
  const response = await apiFetch(
    `${API_URL}/outfits/${id}/favorite`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update favorite."
    );
  }

  return data;
}

// Implements the markOutfitAsWorn operation for this module.
export async function markOutfitAsWorn(id) {
  const response = await apiFetch(
    `${API_URL}/outfits/${id}/wear`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to mark outfit as worn."
    );
  }

  return data;
}