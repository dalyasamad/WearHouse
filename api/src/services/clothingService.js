// Implements business logic between the API controllers and database repositories.

const clothingRepository =
  require("../repositories/clothingRepository");

const {
  deleteUploadedFile,
} = require("../utils/fileUtils");

// Retrieves all records associated with the current user.
async function getAll(userId) {
  return clothingRepository.findAllByUser(
    userId
  );
}

// Retrieves one record by its identifier and user ownership.
async function getById(itemId, userId) {
  const item =
    await clothingRepository.findById(
      itemId,
      userId
    );

  if (!item) {
    const error = new Error(
      "Clothing item not found."
    );

    error.status = 404;
    throw error;
  }

  return item;
}

// Creates a new record using the supplied information.
async function create(userId, data) {
  return clothingRepository.createItem(
    userId,
    data
  );
}

// Updates an existing record using the supplied information.
async function update(
  itemId,
  userId,
  data
) {
  const existingItem =
    await clothingRepository.findById(
      itemId,
      userId
    );

  if (!existingItem) {
    const error = new Error(
      "Clothing item not found."
    );

    error.status = 404;
    throw error;
  }

  const updatedItem =
    await clothingRepository.updateItem(
      itemId,
      userId,
      data
    );

  // Delete the previous image when it was replaced or removed.
  if (
    existingItem.image_url &&
    existingItem.image_url !==
      updatedItem.image_url
  ) {
    await deleteUploadedFile(
      existingItem.image_url
    );
  }

  return updatedItem;
}

// Removes the specified record.
async function remove(itemId, userId) {
  const existingItem =
    await clothingRepository.findById(
      itemId,
      userId
    );

  if (!existingItem) {
    const error = new Error(
      "Clothing item not found."
    );

    error.status = 404;
    throw error;
  }

  const deleted =
    await clothingRepository.deleteItem(
      itemId,
      userId
    );

  if (!deleted) {
    const error = new Error(
      "Clothing item not found."
    );

    error.status = 404;
    throw error;
  }

  // Remove the physical uploaded image after
  // the database deletion succeeds.
  if (existingItem.image_url) {
    await deleteUploadedFile(
      existingItem.image_url
    );
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