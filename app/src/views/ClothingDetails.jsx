// Renders a WearHouse application page and manages its user interactions.


import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";

import {
  getClothingItem,
  deleteClothingItem,
} from "../services/clothingService";

// Renders the ClothingDetails page and manages its related state and event handlers.
function ClothingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getClothingItem(id);

      setItem(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      setError("");

      await deleteClothingItem(
        id
      );

      navigate("/wardrobe");
    } catch (error) {
      setError(error.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="clothing-details-page">
        <h2>
          Loading item...
        </h2>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="clothing-details-page">
        <p className="auth-error">
          {error}
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate(
              "/wardrobe"
            )
          }
        >
          Back to Wardrobe
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <h1>
        Item Not Found
      </h1>
    );
  }

  return (
    <>
      <div className="clothing-details-page">
        <div className="page-header">
          <div>
            <h1>
              {item.name}
            </h1>

            <p>
              View and manage this
              clothing item.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(
                "/wardrobe"
              )
            }
          >
            Back
          </button>
        </div>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <div className="clothing-details-card">
          <div className="details-image">
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
                No Image
              </span>
            )}
          </div>

          <div className="details-content">
            <div className="details-heading">
              <div>
                <h2>
                  {item.name}
                </h2>

                <p>
                  {item.category}
                </p>
              </div>

              <span className="details-heart">
                {item.is_favorite
                  ? "♥"
                  : "♡"}
              </span>
            </div>

            <div className="details-grid">
              <div>
                <span>
                  Color
                </span>

                <strong>
                  {item.color ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Size
                </span>

                <strong>
                  {item.size ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Season
                </span>

                <strong>
                  {item.season ||
                    "—"}
                </strong>
              </div>
            </div>

            <div className="details-notes">
              <span>
                Notes
              </span>

              <p>
                {item.notes ||
                  "No notes added."}
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    `/clothing/${item.item_id}/edit`
                  )
                }
              >
                Edit Item
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate(
                    "/outfits/create"
                  )
                }
              >
                Add to Outfit
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  setShowDeleteModal(
                    true
                  )
                }
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={
          showDeleteModal
        }
        title="Delete Clothing Item?"
        message={`Are you sure you want to delete "${item.name}"? It will also be removed from any outfits that use it.`}
        confirmText="Delete Item"
        onConfirm={
          confirmDelete
        }
        onCancel={() => {
          if (!deleting) {
            setShowDeleteModal(
              false
            );
          }
        }}
        loading={deleting}
      />
    </>
  );
}

export default ClothingDetails;