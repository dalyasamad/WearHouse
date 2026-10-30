// Implements business logic between the API controllers and database repositories.

const clothingRepository =
  require("../repositories/clothingRepository");

// Retrieves all records associated with the current user.
async function getAll(userId) {
  return clothingRepository.findAllByUser(userId);
}

// Retrieves one record by its identifier and user ownership.
async function getById(itemId, userId) {
  const item =
    await clothingRepository.findById(itemId, userId);

  if (!item) {
    const error = new Error("Clothing item not found.");
    error.status = 404;
    throw error;
  }

  return item;
}

// Creates a new record using the supplied information.
async function create(userId, data) {
  return clothingRepository.createItem(userId, data);
}

// Updates an existing record using the supplied information.
async function update(itemId, userId, data) {
  const existingItem =
    await clothingRepository.findById(itemId, userId);

  if (!existingItem) {
    const error = new Error("Clothing item not found.");
    error.status = 404;
    throw error;
  }

  return clothingRepository.updateItem(
    itemId,
    userId,
    data
  );
}

// Removes the specified record.
async function remove(itemId, userId) {
  const deleted =
    await clothingRepository.deleteItem(
      itemId,
      userId
    );

  if (!deleted) {
    const error = new Error("Clothing item not found.");
    error.status = 404;
    throw error;
  }

  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};