// Renders a WearHouse application page and manages its user interactions.
import { getAssetUrl } from "../config/api";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getClothingItems } from "../services/clothingService";

import {
  getOutfit,
  updateOutfit,
} from "../services/outfitService";

// Renders the EditOutfit page and manages its related state and event handlers.
function EditOutfit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [outfitName, setOutfitName] = useState("");
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [wardrobeData, outfitData] =
          await Promise.all([
            getClothingItems(),
            getOutfit(id),
          ]);

        setWardrobeItems(wardrobeData);

        setOutfitName(outfitData.name || "");
        setNotes(outfitData.notes || "");
        setIsFavorite(
          outfitData.is_favorite || false
        );

        setSelectedItems(
          outfitData.items || []
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);


  const categories = [
    "All",
    ...new Set(
      wardrobeItems
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredItems = wardrobeItems.filter(
    (item) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return matchesSearch && matchesCategory;
    }
  );

  function toggleItem(item) {
    const alreadySelected =
      selectedItems.some(
        (selected) =>
          selected.item_id === item.item_id
      );

    if (alreadySelected) {
      setSelectedItems((current) =>
        current.filter(
          (selected) =>
            selected.item_id !== item.item_id
        )
      );

      return;
    }

    setSelectedItems((current) => [
      ...current,
      item,
    ]);
  }

  function removeItem(itemId) {
    setSelectedItems((current) =>
      current.filter(
        (item) => item.item_id !== itemId
      )
    );
  }

  async function handleSave() {
    setError("");

    if (!outfitName.trim()) {
      setError("Please enter an outfit name.");
      return;
    }

    if (selectedItems.length === 0) {
      setError(
        "Please select at least one clothing item."
      );
      return;
    }

    try {
      setSaving(true);

      await updateOutfit(id, {
        name: outfitName,
        notes,
        is_favorite: isFavorite,
        item_ids: selectedItems.map(
          (item) => item.item_id
        ),
      });

      navigate("/outfits");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-outfit-page">
        <div className="page-header">
          <h1>Edit Outfit</h1>
        </div>

        <p>Loading outfit...</p>
      </div>
    );
  }

  return (
    <div className="edit-outfit-page">
      <div className="page-header">
        <div>
          <h1>Edit Outfit</h1>

          <p>
            Update the clothing and details
            for this outfit.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate("/outfits")
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

      <div className="outfit-creator-layout">

        {/* LEFT — WARDROBE */}
        <aside className="creator-wardrobe">
          <div className="creator-panel-header">
            <h2>Your Wardrobe</h2>

            <span>
              {wardrobeItems.length} items
            </span>
          </div>

          <input
            type="text"
            className="creator-search"
            placeholder="Search clothing..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <div className="creator-categories">
            {categories.map(
              (itemCategory) => (
                <button
                  key={itemCategory}
                  type="button"
                  className={
                    category === itemCategory
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCategory(
                      itemCategory
                    )
                  }
                >
                  {itemCategory}
                </button>
              )
            )}
          </div>

          <div className="creator-item-list">
            {filteredItems.map((item) => {
              const selected =
                selectedItems.some(
                  (selectedItem) =>
                    selectedItem.item_id ===
                    item.item_id
                );

              return (
                <button
                  type="button"
                  key={item.item_id}
                  className={`creator-wardrobe-item ${selected
                      ? "selected"
                      : ""
                    }`}
                  onClick={() =>
                    toggleItem(item)
                  }
                >
                  <div className="creator-item-image">
                    {item.image_url ? (
                      <img
                        src={getAssetUrl(item.image_url)}
                        alt={item.name}
                      />
                    ) : (
                      <span>
                        No Image
                      </span>
                    )}
                  </div>

                  <div className="creator-item-text">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.category}
                    </span>
                  </div>

                  <span className="creator-add-symbol">
                    {selected
                      ? "✓"
                      : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CENTER — CURRENT OUTFIT */}
        <section className="outfit-canvas-section">
          <div className="creator-panel-header">
            <div>
              <h2>Outfit Canvas</h2>

              <span className="selected-count">
                {selectedItems.length} selected
              </span>
            </div>
          </div>

          <div className="outfit-canvas">
            {selectedItems.length === 0 ? (
              <div className="canvas-empty">
                <h3>
                  Your outfit is empty
                </h3>

                <p>
                  Choose at least one clothing
                  item for this outfit.
                </p>
              </div>
            ) : (
              <div className="canvas-items">
                {selectedItems.map(
                  (item) => (
                    <div
                      className="canvas-item"
                      key={item.item_id}
                    >
                      <button
                        type="button"
                        className="canvas-remove"
                        onClick={() =>
                          removeItem(
                            item.item_id
                          )
                        }
                      >
                        ×
                      </button>

                      <div className="canvas-item-image">
                        {item.image_url ? (
                          <img
                            src={getAssetUrl(item.image_url)}
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

                      <p>
                        {item.name}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT — DETAILS */}
        <aside className="outfit-details-panel">
          <h2>Outfit Details</h2>

          <div className="form-group">
            <label>
              Outfit Name
            </label>

            <input
              type="text"
              value={outfitName}
              onChange={(event) =>
                setOutfitName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea
              rows="5"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
            />
          </div>

          <label className="favorite-checkbox">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(event) =>
                setIsFavorite(
                  event.target.checked
                )
              }
            />

            Favorite Outfit
          </label>

          <div className="creator-summary">
            <span>Items</span>

            <strong>
              {selectedItems.length}
            </strong>
          </div>

          <button
            type="button"
            className="primary-button creator-save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            className="secondary-button edit-outfit-cancel"
            onClick={() =>
              navigate("/outfits")
            }
            disabled={saving}
          >
            Cancel
          </button>
        </aside>

      </div>
    </div>
  );
}

export default EditOutfit;