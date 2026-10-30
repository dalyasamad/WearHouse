// Contains PostgreSQL queries for retrieving and modifying application records.



const pool = require("../config/db");

// Searches for a user account using an email address.
// Performs a case-insensitive comparison to find the matching user.
// Looks up an account by its email address.
async function findByEmail(email) {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE LOWER(email) = LOWER($1)
    `,
    [email]
  );

  // Return the matching user record.
  return result.rows[0];
}

// Retrieves a user's profile information using their ID.
// Returns the selected profile fields without the password hash.
// Queries one record by identifier.
async function findById(userId) {
  const result = await pool.query(
    `
    SELECT
      user_id,
      first_name,
      last_name,
      email,
      profile_picture,
      created_at
    FROM users
    WHERE user_id = $1
    `,
    [userId]
  );

  // Return the user's profile information.
  return result.rows[0];
}

// Creates a new user account with the provided registration information.
// Stores the email in lowercase and saves the supplied password hash.
// Inserts a new user record into the database.
async function createUser({
  first_name,
  last_name,
  email,
  password_hash,
}) {
  const result = await pool.query(
    `
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3, $4)

    RETURNING
      user_id,
      first_name,
      last_name,
      email,
      profile_picture,
      created_at
    `,
    [
      first_name,
      last_name,
      email.toLowerCase(),
      password_hash,
    ]
  );

  // Return the newly created user's profile information.
  return result.rows[0];
}
// Updates the profile information of an existing user.
// Allows changes to the user's first name, last name, and email.
// Updates a user record in the database.
async function updateUser(userId, data) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      first_name = $1,
      last_name = $2,
      email = LOWER($3)
    WHERE user_id = $4

    RETURNING
      user_id,
      first_name,
      last_name,
      email,
      profile_picture,
      created_at
    `,
    [
      data.first_name,
      data.last_name,
      data.email,
      userId,
    ]
  );

  // Return the updated user profile.
  return result.rows[0];
}

// Deletes a user account and its associated wardrobe data.
// Uses a database transaction to ensure related records are removed together.
// Deletes the user and related application records in one transaction.
async function deleteUser(userId) {
  // Obtain a database client for the transaction.
  const client = await pool.connect();

  try {
    // Begin the database transaction.
    // Starts an atomic database transaction.
    await client.query("BEGIN");

    // Remove all scheduled outfits belonging to the user.
    await client.query(
      `
      DELETE FROM outfit_schedule
      WHERE user_id = $1
      `,
      [userId]
    );

    // Remove the user's recorded outfit wear history.
    await client.query(
      `
      DELETE FROM wear_history
      WHERE user_id = $1
      `,
      [userId]
    );

    // Remove clothing associations from the user's outfits.
    await client.query(
      `
      DELETE FROM outfit_items
      WHERE outfit_id IN (
        SELECT outfit_id
        FROM outfits
        WHERE user_id = $1
      )
      `,
      [userId]
    );

    // Delete all outfits created by the user.
    await client.query(
      `
      DELETE FROM outfits
      WHERE user_id = $1
      `,
      [userId]
    );

    // Delete all clothing items belonging to the user.
    await client.query(
      `
      DELETE FROM clothing_items
      WHERE user_id = $1
      `,
      [userId]
    );

    // Delete the user account after removing its related records.
    const result = await client.query(
      `
      DELETE FROM users
      WHERE user_id = $1

      RETURNING user_id
      `,
      [userId]
    );

    // Commit the transaction after all deletions succeed.
    // Commits all successful database changes.
    await client.query("COMMIT");

    // Return the deleted user's ID.
    return result.rows[0];
  } catch (error) {
    // Roll back all changes if any deletion fails.
    // Undoes changes if an operation fails.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the database client back to the connection pool.
    client.release();
  }
}
// Export the user model functions for use in authentication and user services.
module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUser,
  deleteUser,
};
