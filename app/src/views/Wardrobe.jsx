// Renders a WearHouse application page and manages its user interactions.


import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import ClothingCard from "../components/ClothingCard";
import CustomDropdown from "../components/CustomDropdown";

import categoryData from "../data/categories";

import {
  getClothingItems,
  updateClothingItem,
} from "../services/clothingService";

// Renders the Wardrobe page and manages its related state and event handlers.
function Wardrobe() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [items, setItems] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [season, setSeason] =
    useState("All");

  const [
    favoritesOnly,
    setFavoritesOnly,
  ] = useState(
    searchParams.get("favorites") ===
      "true"
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const categories = [
    "All",
    ...categoryData.map(
      (category) => category.name
    ),
  ];

  const seasons = [
    "All",
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "All Seasons",
  ];

  useEffect(() => {
    loadClothing();
  }, []);

  useEffect(() => {
    setFavoritesOnly(
      searchParams.get("favorites") ===
        "true"
    );
  }, [searchParams]);

  async function loadClothing() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getClothingItems();

      setItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite(
    itemId
  ) {
    const item = items.find(
      (clothing) =>
        clothing.item_id === itemId
    );

    if (!item) {
      return;
    }

    try {
      setError("");

      const updatedItem =
        await updateClothingItem(
          itemId,
          {
            name: item.name,
            category_id:
              item.category_id,
            image_url:
              item.image_url,
            color: item.color,
            size: item.size,
            season: item.season,
            notes: item.notes,
            is_favorite:
              !item.is_favorite,
          }
        );

      setItems((currentItems) =>
        currentItems.map(
          (clothing) =>
            clothing.item_id ===
            itemId
              ? {
                  ...clothing,
                  ...updatedItem,

                  // Keep the category name
                  // used by the frontend.
                  category:
                    item.category,
                }
              : clothing
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  function toggleFavoritesFilter() {
    const nextValue =
      !favoritesOnly;

    setFavoritesOnly(nextValue);

    const params =
      new URLSearchParams(
        searchParams
      );

    if (nextValue) {
      params.set(
        "favorites",
        "true"
      );
    } else {
      params.delete(
        "favorites"
      );
    }

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSeason("All");
    setFavoritesOnly(false);

    const params =
      new URLSearchParams(
        searchParams
      );

    params.delete("favorites");

    setSearchParams(
      params,
      {
        replace: true,
      }
    );
  }

  const filteredItems =
    items.filter((item) => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      const matchesSearch =
        !searchText ||
        item.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText) ||
        item.color
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesSeason =
        season === "All" ||
        item.season === season ||
        (
          season !== "All Seasons" &&
          item.season ===
            "All Seasons"
        );

      const matchesFavorite =
        !favoritesOnly ||
        item.is_favorite === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeason &&
        matchesFavorite
      );
    });

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    season !== "All" ||
    favoritesOnly;

  return (
    <div className="wardrobe-page">
      <div className="page-header">
        <div>
          <h1>
            My Wardrobe
          </h1>

          <p>
            Browse and organize your
            clothing collection.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              "/clothing/add"
            )
          }
        >
          + Add Clothing
        </button>
      </div>

      <div className="wardrobe-controls">
        <div className="wardrobe-search">
          <input
            type="text"
            placeholder="Search your wardrobe..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <CustomDropdown
          value={category}
          options={categories}
          onChange={setCategory}
        />

        <CustomDropdown
          value={season}
          options={seasons}
          onChange={setSeason}
        />

        <button
          type="button"
          className={`favorites-filter ${
            favoritesOnly
              ? "active"
              : ""
          }`}
          onClick={
            toggleFavoritesFilter
          }
        >
          ♥ Favorites
        </button>
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="wardrobe-empty">
          <h3>
            Loading wardrobe...
          </h3>
        </div>
      ) : (
        <>
          <div className="wardrobe-results">
            <p>
              {filteredItems.length}{" "}
              {filteredItems.length ===
              1
                ? "item"
                : "items"}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                className="wardrobe-clear-filters"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredItems.length >
          0 ? (
            <div className="clothing-grid">
              {filteredItems.map(
                (item) => (
                  <ClothingCard
                    key={
                      item.item_id
                    }
                    item={item}
                    onToggleFavorite={
                      handleToggleFavorite
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="wardrobe-empty">
              <h3>
                No clothing found
              </h3>

              <p>
                {items.length === 0
                  ? "Your wardrobe is empty. Add your first clothing item."
                  : "Nothing matches your current search and filters."}
              </p>

              {items.length === 0 ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      "/clothing/add"
                    )
                  }
                >
                  Add Clothing
                </button>
              ) : (
                hasActiveFilters && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Wardrobe;