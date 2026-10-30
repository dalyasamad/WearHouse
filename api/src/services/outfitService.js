// Implements business logic between the API controllers and database repositories.


const outfitRepository =
  require("../repositories/outfitRepository");

const clothingRepository =
  require("../repositories/clothingRepository");

// Retrieves all records associated with the current user.
async function getAll(userId) {
  return outfitRepository.findAllByUser(userId);
}

// Retrieves one record by its identifier and user ownership.
async function getById(outfitId, userId) {
  const outfit =
    await outfitRepository.findById(
      outfitId,
      userId
    );

  if (!outfit) {
    const error = new Error("Outfit not found.");
    error.status = 404;

    throw error;
  }

  return outfit;
}

// Creates a new record using the supplied information.
async function create(userId, data) {
  // Make sure every selected clothing item
  // belongs to the logged-in user
  for (const itemId of data.item_ids) {
    const item =
      await clothingRepository.findById(
        itemId,
        userId
      );

    if (!item) {
      const error = new Error(
        "One or more clothing items are invalid."
      );

      error.status = 400;

      throw error;
    }
  }

  return outfitRepository.createOutfit(
    userId,
    data
  );
}

// Removes the specified record.
async function remove(outfitId, userId) {
  const deleted =
    await outfitRepository.deleteOutfit(
      outfitId,
      userId
    );

  if (!deleted) {
    const error = new Error("Outfit not found.");
    error.status = 404;

    throw error;
  }

  return deleted;
}
// Switches an outfit between favorited and unfavorited.
async function toggleFavorite(outfitId, userId) {
  const outfit =
    await outfitRepository.toggleFavorite(
      outfitId,
      userId
    );

  if (!outfit) {
    const error = new Error("Outfit not found.");
    error.status = 404;
    throw error;
  }

  return outfit;
}

// Adds an outfit wear entry to the history.
async function markAsWorn(outfitId, userId) {
  const outfit =
    await outfitRepository.findById(
      outfitId,
      userId
    );

  if (!outfit) {
    const error = new Error("Outfit not found.");
    error.status = 404;
    throw error;
  }

  return outfitRepository.markAsWorn(
    outfitId,
    userId
  );
}
// Updates an existing record using the supplied information.
async function update(
  outfitId,
  userId,
  data
) {
  const existingOutfit =
    await outfitRepository.findById(
      outfitId,
      userId
    );

  if (!existingOutfit) {
    const error = new Error(
      "Outfit not found."
    );

    error.status = 404;
    throw error;
  }

  // Make sure every selected clothing item
  // actually belongs to this user
  for (const itemId of data.item_ids) {
    const item =
      await clothingRepository.findById(
        itemId,
        userId
      );

    if (!item) {
      const error = new Error(
        "One or more clothing items are invalid."
      );

      error.status = 400;
      throw error;
    }
  }

  await outfitRepository.updateOutfit(
    outfitId,
    userId,
    data
  );

  // Return the complete updated outfit
  // including its clothing items
  return outfitRepository.findById(
    outfitId,
    userId
  );
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleFavorite,
  markAsWorn,
};