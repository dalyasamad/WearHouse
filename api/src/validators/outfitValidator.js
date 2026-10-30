// Checks incoming data and returns validation messages for invalid input.


// Checks the submitted outfit data.
function validateOutfit(data) {
  if (!data.name || data.name.trim() === "") {
    return "Outfit name is required.";
  }

  if (
    !Array.isArray(data.item_ids) ||
    data.item_ids.length === 0
  ) {
    return "Select at least one clothing item.";
  }

  return null;
}

module.exports = {
  validateOutfit,
};