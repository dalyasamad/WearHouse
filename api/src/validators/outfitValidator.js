// Checks incoming data and returns validation messages for invalid input.

// Checks the submitted outfit data.
function validateOutfit(data) {
  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim() === ""
  ) {
    return "Outfit name is required.";
  }

  if (
    !Array.isArray(data.item_ids) ||
    data.item_ids.length === 0
  ) {
    return "Select at least one clothing item.";
  }

  const normalizedIds =
    data.item_ids.map(Number);

  const hasInvalidId =
    normalizedIds.some(
      (id) =>
        !Number.isInteger(id) ||
        id <= 0
    );

  if (hasInvalidId) {
    return "One or more clothing item IDs are invalid.";
  }

  const uniqueIds =
    new Set(normalizedIds);

  if (
    uniqueIds.size !==
    normalizedIds.length
  ) {
    return "The same clothing item cannot be added more than once.";
  }

  return null;
}

module.exports = {
  validateOutfit,
};