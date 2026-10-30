// Contains PostgreSQL queries for retrieving and modifying application records.



const pool = require("../config/db");

// Retrieves the wear history records belonging to a specific user.
// Includes outfit details and the clothing items associated with each outfit.
// Queries records associated with the specified user.
async function findByUser(userId) {
  const result = await pool.query(
    `
    SELECT
      wh.history_id,

      TO_CHAR(
        wh.worn_date,
        'YYYY-MM-DD'
      ) AS worn_date,

      o.outfit_id,
      o.name AS outfit_name,

      COALESCE(
        json_agg(
          json_build_object(
            'item_id', ci.item_id,
            'name', ci.name,
            'image_url', ci.image_url
          )
        ) FILTER (
          WHERE ci.item_id IS NOT NULL
        ),
        '[]'
      ) AS items

    FROM wear_history wh

    JOIN outfits o
      ON wh.outfit_id = o.outfit_id

    LEFT JOIN outfit_items oi
      ON o.outfit_id = oi.outfit_id

    LEFT JOIN clothing_items ci
      ON oi.item_id = ci.item_id

    WHERE wh.user_id = $1

    GROUP BY
      wh.history_id,
      wh.worn_date,
      o.outfit_id,
      o.name

    ORDER BY
      wh.worn_date DESC,
      wh.history_id DESC
    `,
    [userId]
  );

  // Return the user's wear history records, ordered by most recent date.
  return result.rows;
}

// Export the history model function for use in the history service.
module.exports = {
  findByUser,
};
