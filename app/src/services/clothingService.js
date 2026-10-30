// Implements business logic between the API controllers and database repositories.

import { apiFetch } from "./apiFetch";
import { API_URL } from "../config/api";

// Implements the getClothingItems operation for this module.
export async function getClothingItems() {
  const response = await apiFetch(
    `${API_URL}/clothing`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load clothing."
    );
  }

  return data;
}

// Implements the createClothingItem operation for this module.
export async function createClothingItem(itemData) {
  const response = await apiFetch(
    `${API_URL}/clothing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create clothing item."
    );
  }

  return data;
}

// Implements the getClothingItem operation for this module.
export async function getClothingItem(id) {
  const response = await apiFetch(
    `${API_URL}/clothing/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load clothing item."
    );
  }

  return data;
}

// Implements the updateClothingItem operation for this module.
export async function updateClothingItem(
  id,
  itemData
) {
  const response = await apiFetch(
    `${API_URL}/clothing/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update clothing item."
    );
  }

  return data;
}

// Implements the deleteClothingItem operation for this module.
export async function deleteClothingItem(id) {
  const response = await apiFetch(
    `${API_URL}/clothing/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete clothing item."
    );
  }

  return data;
}

// Implements the uploadClothingImage operation for this module.
export async function uploadClothingImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiFetch(
    `${API_URL}/clothing/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to upload image."
    );
  }

  return data.image_url;
}