// Renders a WearHouse application page and manages its user interactions.


import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";

import {
  getOutfits,
  deleteOutfit,
  toggleOutfitFavorite,
  markOutfitAsWorn,
} from "../services/outfitService";

// Orders the outfits according to the requested sorting rule.
function sortOutfits(data) {
  return [...data].sort(
    (a, b) =>
      new Date(
        b.updated_at ||
        b.created_at ||
        0
      ) -
      new Date(
        a.updated_at ||
        a.created_at ||
        0
      )
  );
}

// Renders the SavedOutfits page and manages its related state and event handlers.
function SavedOutfits() {
  const navigate = useNavigate();

  const [outfits, setOutfits] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    outfitToDelete,
    setOutfitToDelete,
  ] = useState(null);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    favoriteLoadingId,
    setFavoriteLoadingId,
  ] = useState(null);

  const [
    wornLoadingId,
    setWornLoadingId,
  ] = useState(null);

  useEffect(() => {
    async function loadOutfits() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getOutfits();

        setOutfits(
          sortOutfits(data)
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadOutfits();
  }, []);

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  async function handleFavorite(
    outfitId
  ) {
    if (favoriteLoadingId) {
      return;
    }

    try {
      setError("");
      setFavoriteLoadingId(
        outfitId
      );

      await toggleOutfitFavorite(
        outfitId
      );

      setOutfits((current) =>
        current.map((outfit) =>
          outfit.outfit_id ===
            outfitId
            ? {
              ...outfit,
              is_favorite:
                !outfit.is_favorite,
            }
            : outfit
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setFavoriteLoadingId(
        null
      );
    }
  }

  async function handleMarkAsWorn(
    outfit
  ) {
    if (wornLoadingId) {
      return;
    }

    try {
      setError("");
      setMessage("");

      setWornLoadingId(
        outfit.outfit_id
      );

      await markOutfitAsWorn(
        outfit.outfit_id
      );

      showMessage(
        `"${outfit.name}" marked as worn.`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setWornLoadingId(null);
    }
  }

  function requestDelete(outfit) {
    setOutfitToDelete(outfit);
  }

  function cancelDelete() {
    if (deleting) {
      return;
    }

    setOutfitToDelete(null);
  }

  async function confirmDelete() {
    if (!outfitToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteOutfit(
        outfitToDelete.outfit_id
      );

      setOutfits((current) =>
        current.filter(
          (outfit) =>
            outfit.outfit_id !==
            outfitToDelete.outfit_id
        )
      );

      setOutfitToDelete(null);

      showMessage(
        "Outfit deleted."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="saved-outfits-page">
        <div className="page-header">
          <div>
            <h1>
              Saved Outfits
            </h1>

            <p>
              View and manage the
              outfits you've created.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate(
                "/outfits/create"
              )
            }
          >
            + Create Outfit
          </button>
        </div>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {message && (
          <div className="outfit-success-message">
            ✓ {message}
          </div>
        )}

        {loading ? (
          <div className="saved-outfits-empty">
            <h3>
              Loading outfits...
            </h3>
          </div>
        ) : outfits.length === 0 ? (
          <div className="saved-outfits-empty">
            <h2>
              No outfits yet
            </h2>

            <p>
              Create your first outfit
              using items from your
              wardrobe.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  "/outfits/create"
                )
              }
            >
              Create Outfit
            </button>
          </div>
        ) : (
          <div className="saved-outfits-grid">
            {outfits.map(
              (outfit) => (
                <article
                  className="saved-outfit-card"
                  key={
                    outfit.outfit_id
                  }
                >
                  <div className="saved-outfit-preview">
                    {outfit.items
                      ?.length > 0 ? (
                      outfit.items
                        .slice(0, 4)
                        .map(
                          (item) => (
                            <div
                              className="saved-outfit-image"
                              key={
                                item.item_id
                              }
                            >
                              {item.image_url ? (
                                <img
                                  src={
                                    item.image_url
                                  }
                                  alt={
                                    item.name
                                  }
                                />
                              ) : (
                                <span>
                                  {
                                    item.name
                                  }
                                </span>
                              )}
                            </div>
                          )
                        )
                    ) : (
                      <div className="saved-outfit-no-items">
                        No clothing
                        items
                      </div>
                    )}
                  </div>

                  <div className="saved-outfit-content">
                    <div className="saved-outfit-heading">
                      <div>
                        <h2>
                          {outfit.name}
                        </h2>

                        <p>
                          {outfit.items
                            ?.length ||
                            0}{" "}
                          {(outfit.items
                            ?.length ||
                            0) === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>

                      <button
                        type="button"
                        className={`outfit-favorite-button ${outfit.is_favorite
                            ? "active"
                            : ""
                          }`}
                        onClick={() =>
                          handleFavorite(
                            outfit.outfit_id
                          )
                        }
                        disabled={
                          favoriteLoadingId ===
                          outfit.outfit_id
                        }
                        aria-label="Toggle favorite"
                      >
                        {outfit.is_favorite
                          ? "♥"
                          : "♡"}
                      </button>
                    </div>

                    {outfit.notes && (
                      <p className="saved-outfit-notes">
                        {
                          outfit.notes
                        }
                      </p>
                    )}

                    <div className="saved-outfit-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          navigate(
                            `/outfits/${outfit.outfit_id}/edit`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={
                          wornLoadingId ===
                          outfit.outfit_id
                        }
                        onClick={() =>
                          handleMarkAsWorn(
                            outfit
                          )
                        }
                      >
                        {wornLoadingId ===
                          outfit.outfit_id
                          ? "Saving..."
                          : "Mark as Worn"}
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          requestDelete(
                            outfit
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={
          Boolean(
            outfitToDelete
          )
        }
        title="Delete Outfit?"
        message={
          outfitToDelete
            ? `Are you sure you want to delete "${outfitToDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmText="Delete Outfit"
        onConfirm={
          confirmDelete
        }
        onCancel={
          cancelDelete
        }
        loading={deleting}
      />
    </>
  );
}

export default SavedOutfits;