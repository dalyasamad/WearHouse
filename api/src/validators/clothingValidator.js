// Checks incoming data and returns validation messages for invalid input.


// Checks the submitted clothing item fields.
function validateClothing(data) {
  if (!data.name || data.name.trim() === "") {
    return "Item name is required.";
  }

  if (!data.category_id) {
    return "Category is required.";
  }

  return null;
}

module.exports = {
  validateClothing,
};