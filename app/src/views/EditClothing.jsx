// Renders a WearHouse application page and manages its user interactions.


import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import CustomDropdown from "../components/CustomDropdown";
import useForm from "../hooks/useForm";

import {
  getClothingItem,
  updateClothingItem,
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

// Renders the EditClothing page and manages its related state and event handlers.
function EditClothing() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    values,
    setValues,
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
      image_url: null,
    },
    validateClothing
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const seasons = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
    "All Seasons",
  ];

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      setLoading(true);
      setServerError("");

      const item =
        await getClothingItem(id);

      setValues({
        name: item.name || "",
        category: item.category || "",
        color: item.color || "",
        size: item.size || "",
        season: item.season || "",
        notes: item.notes || "",
        is_favorite:
          item.is_favorite || false,
        image_url:
          item.image_url || null,
      });

      setImagePreview(
        item.image_url || ""
      );
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event) {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const reader =
      new FileReader();

    reader.onload = () => {
      setImagePreview(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview("");

    setFieldValue(
      "image_url",
      null
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    const selectedCategory =
      categories.find(
        (category) =>
          category.name ===
          values.category
      );

    if (!selectedCategory) {
      setServerError(
        "Please select a valid category."
      );

      return;
    }

    try {
      setSaving(true);

      let imageUrl =
        values.image_url;

      // Upload a new image only if
      // the user selected one.
      if (imageFile) {
        imageUrl =
          await uploadClothingImage(
            imageFile
          );
      }

      await updateClothingItem(
        id,
        {
          name: values.name,

          category_id:
            selectedCategory.category_id,

          color:
            values.color,

          size:
            values.size,

          season:
            values.season,

          notes:
            values.notes,

          is_favorite:
            values.is_favorite,

          image_url:
            imageUrl,
        }
      );

      navigate(
        `/clothing/${id}`
      );
    } catch (error) {
      setServerError(
        error.message
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="add-clothing-page">
        <div className="page-header">
          <h1>
            Edit Clothing
          </h1>
        </div>

        <p>
          Loading item...
        </p>
      </div>
    );
  }

  return (
    <div className="add-clothing-page">
      <div className="page-header">
        <div>
          <h1>
            Edit Clothing
          </h1>

          <p>
            Update your clothing item information.
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
                alt={
                  values.name ||
                  "Clothing item"
                }
                className="image-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <span>
                  No Image
                </span>

                <p>
                  Add a photo of this item
                </p>
              </div>
            )}
          </div>

          <div className="edit-image-actions">
            <label className="secondary-button upload-button">
              {imagePreview
                ? "Change Image"
                : "Choose Image"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleImageChange
                }
                hidden
              />
            </label>

            {imagePreview && (
              <button
                type="button"
                className="image-remove-button"
                onClick={
                  handleRemoveImage
                }
              >
                Remove Image
              </button>
            )}
          </div>
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
              value={values.name}
              onChange={
                handleChange
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Category
              </label>

              <CustomDropdown
                value={
                  values.category
                }
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
                value={
                  values.season
                }
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
                value={
                  values.color
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="form-group">
              <label>
                Size
              </label>

              <input
                type="text"
                name="size"
                value={
                  values.size
                }
                onChange={
                  handleChange
                }
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
              value={
                values.notes
              }
              onChange={
                handleChange
              }
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

            Favorite Item
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
                navigate(
                  `/clothing/${id}`
                )
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditClothing;