// Contains PostgreSQL queries for retrieving and modifying application records.



const pool = require("../config/db");

// Retrieves all outfits belonging to a specific user.
// Includes outfit details and their associated clothing items.
// Queries all records belonging to the specified user.
async function findAllByUser(userId) {
  const result = await pool.query(
    `
    SELECT
      o.outfit_id,
      o.name,
      o.notes,
      o.is_favorite,
      o.created_at,
      o.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'item_id', ci.item_id,
            'name', ci.name,
            'image_url', ci.image_url,
            'category', c.name
          )
        ) FILTER (WHERE ci.item_id IS NOT NULL),
        '[]'
      ) AS items
    FROM outfits o

    LEFT JOIN outfit_items oi
      ON o.outfit_id = oi.outfit_id

    LEFT JOIN clothing_items ci
      ON oi.item_id = ci.item_id

    LEFT JOIN categories c
      ON ci.category_id = c.category_id

    WHERE o.user_id = $1

    GROUP BY o.outfit_id

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  // Return all outfits found for the user.
  return result.rows;
}

// Retrieves a specific outfit using its ID and the user's ID.
// Includes the clothing items and categories associated with the outfit.
// Queries one record by identifier.
async function findById(outfitId, userId) {
  const result = await pool.query(
    `
    SELECT
      o.outfit_id,
      o.name,
      o.notes,
      o.is_favorite,
      o.created_at,
      o.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'item_id', ci.item_id,
            'name', ci.name,
            'image_url', ci.image_url,
            'category', c.name
          )
        ) FILTER (WHERE ci.item_id IS NOT NULL),
        '[]'
      ) AS items
    FROM outfits o

    LEFT JOIN outfit_items oi
      ON o.outfit_id = oi.outfit_id

    LEFT JOIN clothing_items ci
      ON oi.item_id = ci.item_id

    LEFT JOIN categories c
      ON ci.category_id = c.category_id

    WHERE o.outfit_id = $1
      AND o.user_id = $2

    GROUP BY o.outfit_id
    `,
    [outfitId, userId]
  );

  // Return the matching outfit.
  return result.rows[0];
}

// Creates a new outfit and associates it with selected clothing items.
// Uses a transaction to ensure all related records are saved together.
// Creates an outfit and associates its selected clothing items.
async function createOutfit(userId, data) {
  // Obtain a database client for the transaction.
  const client = await pool.connect();

  try {
    // Begin the database transaction.
    // Starts an atomic database transaction.
    await client.query("BEGIN");

    // Insert the main outfit information into the outfits table.
    const outfitResult = await client.query(
      `
      INSERT INTO outfits (
        user_id,
        name,
        notes,
        is_favorite
      )
      VALUES ($1, $2, $3, $4)

      RETURNING *
      `,
      [
        userId,
        data.name,
        data.notes || null,
        data.is_favorite || false,
      ]
    );

    // Store the newly created outfit.
    const outfit = outfitResult.rows[0];

    // Associate each selected clothing item with the outfit.
    for (const itemId of data.item_ids) {
      await client.query(
        `
        INSERT INTO outfit_items (
          outfit_id,
          item_id
        )
        VALUES ($1, $2)
        `,
        [outfit.outfit_id, itemId]
      );
    }

    // Commit the transaction after all records are created.
    // Commits all successful database changes.
    await client.query("COMMIT");

    // Return the newly created outfit.
    return outfit;
  } catch (error) {
    // Roll back the transaction if any operation fails.
    // Undoes changes if an operation fails.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the database client back to the connection pool.
    client.release();
  }
}

// Deletes a specific outfit belonging to the user.
// Deletes the selected outfit.
async function deleteOutfit(outfitId, userId) {
  const result = await pool.query(
    `
    DELETE FROM outfits
    WHERE outfit_id = $1
      AND user_id = $2

    RETURNING outfit_id
    `,
    [outfitId, userId]
  );

  // Return the deleted outfit's ID.
  return result.rows[0];
}
// Toggles the favorite status of a specific outfit.
// Updates the modification timestamp when the favorite status changes.
// Switches an outfit between favorited and unfavorited.
async function toggleFavorite(outfitId, userId) {
  const result = await pool.query(
    `
    UPDATE outfits
    SET
      is_favorite = NOT is_favorite,
      updated_at = CURRENT_TIMESTAMP
    WHERE outfit_id = $1
      AND user_id = $2

    RETURNING *
    `,
    [outfitId, userId]
  );

  // Return the outfit with its updated favorite status.
  return result.rows[0];
}

// Records an outfit as worn by adding a new entry to the wear history.
// The current database date is used as the wear date.
// Adds an outfit wear entry to the history.
async function markAsWorn(outfitId, userId) {
  const result = await pool.query(
    `
    INSERT INTO wear_history (
      user_id,
      outfit_id,
      worn_date
    )
    VALUES ($1, $2, CURRENT_DATE)

    RETURNING *
    `,
    [userId, outfitId]
  );

  // Return the newly created wear history record.
  return result.rows[0];
}

// Updates an existing outfit and its associated clothing items.
// Uses a transaction to keep the outfit and item selections consistent.
// Updates outfit details and replaces its clothing selections.
async function updateOutfit(
  outfitId,
  userId,
  data
) {
  // Obtain a database client for the transaction.
  const client = await pool.connect();

  try {
    // Begin the database transaction.
    // Starts an atomic database transaction.
    await client.query("BEGIN");

    // Update the main outfit information
    const outfitResult = await client.query(
      `
      UPDATE outfits
      SET
        name = $1,
        notes = $2,
        is_favorite = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE outfit_id = $4
        AND user_id = $5

      RETURNING *
      `,
      [
        data.name,
        data.notes || null,
        data.is_favorite || false,
        outfitId,
        userId,
      ]
    );

    // Store the updated outfit information.
    const outfit = outfitResult.rows[0];

    // Stop the update if the specified outfit does not exist.
    if (!outfit) {
      // Undoes changes if an operation fails.
      await client.query("ROLLBACK");
      return null;
    }

    // Remove the old clothing selections
    await client.query(
      `
      DELETE FROM outfit_items
      WHERE outfit_id = $1
      `,
      [outfitId]
    );

    // Add the new clothing selections
    // Remove duplicate item IDs before inserting the new selections.
    const uniqueItemIds = [
      ...new Set(data.item_ids),
    ];

    // Associate each unique clothing item with the updated outfit.
    for (const itemId of uniqueItemIds) {
      await client.query(
        `
        INSERT INTO outfit_items (
          outfit_id,
          item_id
        )
        VALUES ($1, $2)
        `,
        [outfitId, itemId]
      );
    }

    // Commit the transaction after all updates succeed.
    // Commits all successful database changes.
    await client.query("COMMIT");

    // Return the updated outfit information.
    return outfit;
  } catch (error) {
    // Roll back the transaction if any operation fails.
    // Undoes changes if an operation fails.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the database client back to the connection pool.
    client.release();
  }
}

// Export the outfit model functions for use in the outfit service.
module.exports = {
  findAllByUser,
  findById,
  createOutfit,
  deleteOutfit,
  toggleFavorite,
  markAsWorn,
  updateOutfit
};
