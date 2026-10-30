// Renders a reusable React interface component.


import { useNavigate } from "react-router-dom";

// Renders the reusable ClothingCard interface component.
function ClothingCard({ item, onToggleFavorite }) {
  const navigate = useNavigate();

  function handleFavorite(event) {
    event.stopPropagation();

    onToggleFavorite(item.item_id);
  }

  return (
    <div
      className="clothing-card"
      onClick={() =>
        navigate(`/clothing/${item.item_id}`)
      }
    >
      {/* IMAGE */}
      <div className="clothing-image">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
          />
        ) : (
          <div className="clothing-image-placeholder">
            <span>No Image</span>
          </div>
        )}

        <button
          type="button"
          className={`favorite-button ${
            item.is_favorite ? "active" : ""
          }`}
          onClick={handleFavorite}
          aria-label="Toggle favorite"
        >
          {item.is_favorite ? "♥" : "♡"}
        </button>
      </div>

      {/* INFORMATION */}
      <div className="clothing-card-content">
        <div>
          <h3>{item.name}</h3>
          <p>{item.category}</p>
        </div>

        <div className="clothing-card-details">
          {item.color && (
            <span>{item.color}</span>
          )}

          {item.size && (
            <span>{item.size}</span>
          )}

          {item.season && (
            <span>{item.season}</span>
          )}
        </div>

        <button
          type="button"
          className="secondary-button clothing-view-button"
          onClick={(event) => {
            event.stopPropagation();

            navigate(
              `/clothing/${item.item_id}`
            );
          }}
        >
          View Item
        </button>
      </div>
    </div>
  );
}

export default ClothingCard;