// Contains PostgreSQL queries for retrieving and modifying application records.


const pool = require("../config/db");

// Retrieves all outfit schedules belonging to a specific user.
// Includes outfit names and orders schedules by their scheduled dates.
// Queries all records belonging to the specified user.
async function findAllByUser(userId) {
  const result = await pool.query(
    `
    SELECT
      os.schedule_id,
      os.outfit_id,
      os.scheduled_date::text AS scheduled_date,
      o.name AS outfit_name
    FROM outfit_schedule os

    JOIN outfits o
      ON os.outfit_id = o.outfit_id

    WHERE os.user_id = $1

    ORDER BY os.scheduled_date
    `,
    [userId]
  );

  // Return the user's scheduled outfits.
  return result.rows;
}

// Finds an existing outfit schedule for a specific user and date.
// Returns the first matching schedule, if one exists.
// Looks up a saved schedule for a specified date.
async function findByDate(userId, scheduledDate) {
  const result = await pool.query(
    `
    SELECT *
    FROM outfit_schedule
    WHERE user_id = $1
      AND scheduled_date = $2
    LIMIT 1
    `,
    [userId, scheduledDate]
  );

  // Return the matching schedule.
  return result.rows[0];
}

// Retrieves a specific outfit schedule using its ID and the user's ID.
// Queries one record by identifier.
async function findById(scheduleId, userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM outfit_schedule
    WHERE schedule_id = $1
      AND user_id = $2
    `,
    [scheduleId, userId]
  );

  // Return the requested schedule.
  return result.rows[0];
}

// Creates a new outfit schedule for a specific date.
// Associates the selected outfit with the authenticated user.
// Creates a new record using the supplied information.
async function create(userId, outfitId, scheduledDate) {
  const result = await pool.query(
    `
    INSERT INTO outfit_schedule (
      user_id,
      outfit_id,
      scheduled_date
    )
    VALUES ($1, $2, $3)

    RETURNING
      schedule_id,
      user_id,
      outfit_id,
      scheduled_date::text AS scheduled_date
    `,
    [userId, outfitId, scheduledDate]
  );

  // Return the newly created schedule.
  return result.rows[0];
}

// Updates an existing outfit schedule.
// Allows changes to the selected outfit and scheduled date.
// Updates an existing record using the supplied information.
async function update(
  scheduleId,
  userId,
  outfitId,
  scheduledDate
) {
  const result = await pool.query(
    `
    UPDATE outfit_schedule
    SET
      outfit_id = $1,
      scheduled_date = $2
    WHERE schedule_id = $3
      AND user_id = $4

    RETURNING
      schedule_id,
      user_id,
      outfit_id,
      scheduled_date::text AS scheduled_date
    `,
    [
      outfitId,
      scheduledDate,
      scheduleId,
      userId,
    ]
  );

  // Return the updated schedule.
  return result.rows[0];
}
// Removes a specific outfit schedule belonging to the user.
// Removes the specified record.
async function remove(scheduleId, userId) {
  const result = await pool.query(
    `
    DELETE FROM outfit_schedule
    WHERE schedule_id = $1
      AND user_id = $2

    RETURNING schedule_id
    `,
    [scheduleId, userId]
  );

  // Return the removed schedule's ID.
  return result.rows[0];
}

// Export the schedule model functions for use in the schedule service.
module.exports = {
  findAllByUser,
  findByDate,
  findById,
  create,
  update,
  remove,
};
