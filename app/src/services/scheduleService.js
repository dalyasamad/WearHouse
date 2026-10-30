// Implements business logic between the API controllers and database repositories.

import { apiFetch } from "./apiFetch";
import { API_URL } from "../config/api";

// Implements the getSchedules operation for this module.
export async function getSchedules() {
  const response = await apiFetch(
    `${API_URL}/schedules`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load calendar."
    );
  }

  return data;
}

// Implements the saveSchedule operation for this module.
export async function saveSchedule(scheduleData) {
  const response = await apiFetch(
    `${API_URL}/schedules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to schedule outfit."
    );
  }

  return data;
}

// Implements the deleteSchedule operation for this module.
export async function deleteSchedule(id) {
  const response = await apiFetch(
    `${API_URL}/schedules/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to remove schedule."
    );
  }

  return data;
}