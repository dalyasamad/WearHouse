// Implements business logic between the API controllers and database repositories.


const scheduleRepository =
  require("../repositories/scheduleRepository");

const outfitRepository =
  require("../repositories/outfitRepository");

// Retrieves all records associated with the current user.
async function getAll(userId) {
  return scheduleRepository.findAllByUser(userId);
}

// Saves an outfit schedule using the supplied date and outfit.
async function save(userId, data) {
  const outfit = await outfitRepository.findById(
    data.outfit_id,
    userId
  );

  if (!outfit) {
    const error = new Error("Outfit not found.");
    error.status = 404;
    throw error;
  }

  const existing =
    await scheduleRepository.findByDate(
      userId,
      data.scheduled_date
    );

  if (existing) {
    return scheduleRepository.update(
      existing.schedule_id,
      userId,
      data.outfit_id,
      data.scheduled_date
    );
  }

  return scheduleRepository.create(
    userId,
    data.outfit_id,
    data.scheduled_date
  );
}

// Updates an existing record using the supplied information.
async function update(scheduleId, userId, data) {
  const existing =
    await scheduleRepository.findById(
      scheduleId,
      userId
    );

  if (!existing) {
    const error = new Error("Schedule not found.");
    error.status = 404;
    throw error;
  }

  const outfit = await outfitRepository.findById(
    data.outfit_id,
    userId
  );

  if (!outfit) {
    const error = new Error("Outfit not found.");
    error.status = 404;
    throw error;
  }

  return scheduleRepository.update(
    scheduleId,
    userId,
    data.outfit_id,
    data.scheduled_date
  );
}

// Removes the specified record.
async function remove(scheduleId, userId) {
  const deleted =
    await scheduleRepository.remove(
      scheduleId,
      userId
    );

  if (!deleted) {
    const error = new Error("Schedule not found.");
    error.status = 404;
    throw error;
  }

  return deleted;
}

module.exports = {
  getAll,
  save,
  update,
  remove,
};