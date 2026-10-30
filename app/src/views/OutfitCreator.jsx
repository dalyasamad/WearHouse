// Renders a WearHouse application page and manages its user interactions.


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getClothingItems } from "../services/clothingService";
import { createOutfit } from "../services/outfitService";

// Renders the OutfitCreator page and manages its related state and event handlers.
function OutfitCreator() {
  const navigate = useNavigate();

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
    loadWardrobe();
  }, []);

  async function loadWardrobe() {
    try {
      setLoading(true);
      setError("");

      const data = await getClothingItems();

      setWardrobeItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "All",
    ...new Set(
      wardrobeItems
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  const filteredItems = wardrobeItems.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return matchesSearch && matchesCategory;
  });

  function addItem(item) {
    const alreadySelected = selectedItems.some(
      (selected) =>
        selected.item_id === item.item_id
    );

    if (alreadySelected) {
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

  function clearCanvas() {
    setSelectedItems([]);
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

      await createOutfit({
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

  return (
    <div className="outfit-creator-page">
      <div className="page-header">
        <div>
          <h1>Outfit Creator</h1>

          <p>
            Build an outfit using items from your wardrobe.
          </p>
        </div>
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
            {categories.map((itemCategory) => (
              <button
                key={itemCategory}
                type="button"
                className={
                  category === itemCategory
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(itemCategory)
                }
              >
                {itemCategory}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="creator-empty">
              Loading wardrobe...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="creator-empty">
              <p>No clothing items found.</p>

              {wardrobeItems.length === 0 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    navigate("/clothing/add")
                  }
                >
                  Add Clothing
                </button>
              )}
            </div>
          ) : (
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
                    className={`creator-wardrobe-item ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => addItem(item)}
                  >
                    <div className="creator-item-image">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="creator-item-text">
                      <strong>{item.name}</strong>
                      <span>{item.category}</span>
                    </div>

                    <span className="creator-add-symbol">
                      {selected ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* CENTER — CANVAS */}
        <section className="outfit-canvas-section">
          <div className="creator-panel-header">
            <div>
              <h2>Outfit Canvas</h2>

              <span className="selected-count">
                {selectedItems.length} selected
              </span>
            </div>

            {selectedItems.length > 0 && (
              <button
                type="button"
                className="creator-clear"
                onClick={clearCanvas}
              >
                Clear
              </button>
            )}
          </div>

          <div className="outfit-canvas">
            {selectedItems.length === 0 ? (
              <div className="canvas-empty">
                <h3>Your outfit is empty</h3>

                <p>
                  Select clothing from your wardrobe to build an outfit.
                </p>
              </div>
            ) : (
              <div className="canvas-items">
                {selectedItems.map((item) => (
                  <div
                    className="canvas-item"
                    key={item.item_id}
                  >
                    <button
                      type="button"
                      className="canvas-remove"
                      onClick={() =>
                        removeItem(item.item_id)
                      }
                    >
                      ×
                    </button>

                    <div className="canvas-item-image">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT — DETAILS */}
        <aside className="outfit-details-panel">
          <h2>Outfit Details</h2>

          <div className="form-group">
            <label>Outfit Name</label>

            <input
              type="text"
              placeholder="e.g. University Day"
              value={outfitName}
              onChange={(event) =>
                setOutfitName(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Notes</label>

            <textarea
              rows="5"
              placeholder="Add notes..."
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
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
              ? "Saving Outfit..."
              : "Save Outfit"}
          </button>
        </aside>

      </div>
    </div>
  );
}

export default OutfitCreator;