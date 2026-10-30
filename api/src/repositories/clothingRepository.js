// Contains PostgreSQL queries for retrieving and modifying application records.



const pool = require("../config/db");

// Retrieves all clothing items belonging to a specific user.
// Includes category names and orders items by their creation date.
// Queries all records belonging to the specified user.
async function findAllByUser(userId) {
  const result = await pool.query(
    `
    SELECT
      ci.item_id,
      ci.name,
      ci.category_id,
      c.name AS category,
      ci.image_url,
      ci.color,
      ci.size,
      ci.season,
      ci.is_favorite,
      ci.notes,
      ci.created_at,
      ci.updated_at
    FROM clothing_items ci
    LEFT JOIN categories c
      ON ci.category_id = c.category_id
    WHERE ci.user_id = $1
    ORDER BY ci.created_at DESC
    `,
    [userId]
  );

  // Return all clothing items found for the user.
  return result.rows;
}

// Retrieves a specific clothing item using its ID and the user's ID.
// Ensures that only items belonging to the specified user are returned.
// Queries one record by identifier.
async function findById(itemId, userId) {
  const result = await pool.query(
    `
    SELECT
      ci.item_id,
      ci.name,
      ci.category_id,
      c.name AS category,
      ci.image_url,
      ci.color,
      ci.size,
      ci.season,
      ci.is_favorite,
      ci.notes,
      ci.created_at,
      ci.updated_at
    FROM clothing_items ci
    LEFT JOIN categories c
      ON ci.category_id = c.category_id
    WHERE ci.item_id = $1
      AND ci.user_id = $2
    `,
    [itemId, userId]
  );

  // Return the matching clothing item.
  return result.rows[0];
}

// Creates a new clothing item in the user's wardrobe.
// Optional fields are assigned default values when not provided.
// Inserts a clothing item into the wardrobe.
async function createItem(userId, data) {
  const result = await pool.query(
    `
    INSERT INTO clothing_items (
      user_id,
      category_id,
      name,
      image_url,
      color,
      size,
      season,
      is_favorite,
      notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)

    RETURNING *
    `,
    [
      userId,
      data.category_id,
      data.name,
      data.image_url || null,
      data.color || null,
      data.size || null,
      data.season || null,
      data.is_favorite || false,
      data.notes || null,
    ]
  );

  // Return the newly created clothing item.
  return result.rows[0];
}

// Updates an existing clothing item's information.
// Uses the item ID and user ID to identify the correct record.
// Updates a clothing item belonging to the user.
async function updateItem(itemId, userId, data) {
  const result = await pool.query(
    `
    UPDATE clothing_items
    SET
      category_id = $1,
      name = $2,
      image_url = $3,
      color = $4,
      size = $5,
      season = $6,
      is_favorite = $7,
      notes = $8,
      updated_at = CURRENT_TIMESTAMP
    WHERE item_id = $9
      AND user_id = $10

    RETURNING *
    `,
    [
      data.category_id,
      data.name,
      data.image_url || null,
      data.color || null,
      data.size || null,
      data.season || null,
      data.is_favorite || false,
      data.notes || null,
      itemId,
      userId,
    ]
  );

  // Return the updated clothing item.
  return result.rows[0];
}

// Deletes a clothing item and handles its related outfit records.
// Uses a database transaction to keep related changes consistent.
// Deletes a clothing item and manages affected outfits in a transaction.
async function deleteItem(itemId, userId) {
  // Obtain a database client for the transaction.
  const client = await pool.connect();

  try {
    // Begin the database transaction.
    // Starts an atomic database transaction.
    await client.query("BEGIN");

    // Find outfits containing this clothing item
    // that belong to the current user
    const outfitResult = await client.query(
      `
      SELECT DISTINCT o.outfit_id
      FROM outfits o

      JOIN outfit_items oi
        ON o.outfit_id = oi.outfit_id

      WHERE oi.item_id = $1
        AND o.user_id = $2
      `,
      [itemId, userId]
    );

    // Store the IDs of outfits affected by the deletion.
    const affectedOutfitIds =
      outfitResult.rows.map(
        (row) => row.outfit_id
      );

    // Remove the clothing item from outfits
    await client.query(
      `
      DELETE FROM outfit_items
      WHERE item_id = $1
      `,
      [itemId]
    );

    // Delete the actual clothing item
    const result = await client.query(
      `
      DELETE FROM clothing_items
      WHERE item_id = $1
        AND user_id = $2

      RETURNING item_id
      `,
      [itemId, userId]
    );

    // Delete outfits that became empty
    for (const outfitId of affectedOutfitIds) {
      // Count the remaining clothing items in each affected outfit.
      const countResult =
        await client.query(
          `
          SELECT COUNT(*) AS item_count
          FROM outfit_items
          WHERE outfit_id = $1
          `,
          [outfitId]
        );

      // Convert the returned count into a number.
      const itemCount = Number(
        countResult.rows[0].item_count
      );

      // Delete the outfit if it no longer contains clothing items.
      if (itemCount === 0) {
        // Remove schedule/history references first
        await client.query(
          `
          DELETE FROM outfit_schedule
          WHERE outfit_id = $1
          `,
          [outfitId]
        );

        await client.query(
          `
          DELETE FROM wear_history
          WHERE outfit_id = $1
          `,
          [outfitId]
        );

        // Delete the empty outfit from the database.
        await client.query(
          `
          DELETE FROM outfits
          WHERE outfit_id = $1
            AND user_id = $2
          `,
          [outfitId, userId]
        );
      }
    }

    // Commit the transaction after all operations succeed.
    // Commits all successful database changes.
    await client.query("COMMIT");

    // Return the deleted clothing item's ID.
    return result.rows[0];
  } catch (error) {
    // Undo the transaction if any operation fails.
    // Undoes changes if an operation fails.
    await client.query("ROLLBACK");
    throw error;
  } finally {
    // Release the database client back to the connection pool.
    client.release();
  }
}

// Export the clothing model functions for use in the clothing service.
module.exports = {
  findAllByUser,
  findById,
  createItem,
  updateItem,
  deleteItem,
};
