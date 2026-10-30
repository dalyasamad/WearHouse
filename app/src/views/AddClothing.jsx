// Renders a WearHouse application page and manages its user interactions.


import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomDropdown from "../components/CustomDropdown";
import useForm from "../hooks/useForm";

import {
  createClothingItem,
  uploadClothingImage,
} from "../services/clothingService";

import categories from "../data/categories";

// Checks the submitted clothing item fields.
function validateClothing(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.form = "Item name is required.";
    return errors;
  }

  if (!values.category) {
    errors.form = "Please select a category.";
  }

  return errors;
}

// Renders the AddClothing page and manages its related state and event handlers.
function AddClothing() {
  const navigate = useNavigate();

  const {
    values,
    errors,
    handleChange,
    setFieldValue,
    validateForm,
  } = useForm(
    {
      name: "",
      category: "",
      color: "",
      size: "",
      season: "",
      notes: "",
      is_favorite: false,
    },
    validateClothing
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const seasons = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "All Seasons",
  ];

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    const selectedCategory = categories.find(
      (category) =>
        category.name === values.category
    );

    if (!selectedCategory) {
      setServerError(
        "Please select a valid category."
      );
      return;
    }

    try {
      setLoading(true);

      let imageUrl = null;

      if (imageFile) {
        imageUrl =
          await uploadClothingImage(imageFile);
      }

      await createClothingItem({
        name: values.name,
        category_id:
          selectedCategory.category_id,
        color: values.color,
        size: values.size,
        season: values.season,
        notes: values.notes,
        is_favorite:
          values.is_favorite,
        image_url: imageUrl,
      });

      navigate("/wardrobe");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-clothing-page">
      <div className="page-header">
        <div>
          <h1>Add Clothing</h1>

          <p>
            Add a new item to your digital wardrobe.
          </p>
        </div>
      </div>

      <form
        className="clothing-form"
        onSubmit={handleSubmit}
      >
        {/* IMAGE */}
        <div className="image-upload-section">
          <div className="image-upload-box">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Clothing preview"
                className="image-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <span>Upload Image</span>

                <p>
                  JPG, PNG or WEBP
                </p>
              </div>
            )}
          </div>

          <label className="secondary-button upload-button">
            Choose Image

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>

        {/* FORM */}
        <div className="form-section">
          <div className="form-group">
            <label>
              Item Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. White T-Shirt"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Category
              </label>

              <CustomDropdown
                value={values.category}
                placeholder="Select category"
                options={categories.map(
                  (category) =>
                    category.name
                )}
                onChange={(value) =>
                  setFieldValue(
                    "category",
                    value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Season
              </label>

              <CustomDropdown
                value={values.season}
                placeholder="Select season"
                options={seasons}
                onChange={(value) =>
                  setFieldValue(
                    "season",
                    value
                  )
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Color
              </label>

              <input
                type="text"
                name="color"
                placeholder="e.g. White"
                value={values.color}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Size
              </label>

              <input
                type="text"
                name="size"
                placeholder="e.g. M"
                value={values.size}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Notes
            </label>

            <textarea
              name="notes"
              rows="5"
              placeholder="Add notes about this item..."
              value={values.notes}
              onChange={handleChange}
            />
          </div>

          <label className="favorite-checkbox">
            <input
              type="checkbox"
              name="is_favorite"
              checked={
                values.is_favorite
              }
              onChange={
                handleChange
              }
            />

            Add to Favorites
          </label>

          {(errors.form ||
            serverError) && (
            <p className="auth-error">
              {errors.form ||
                serverError}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/wardrobe")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Clothing"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddClothing;