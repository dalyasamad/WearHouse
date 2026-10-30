// Renders a WearHouse application page and manages its user interactions.


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useForm from "../hooks/useForm";
import useAuth from "../hooks/useAuth";

import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} from "../services/authService";

// Checks editable profile fields before submission.
function validateProfile(values) {
  const errors = {};

  if (
    !values.first_name ||
    !values.last_name ||
    !values.email
  ) {
    errors.form =
      "First name, last name, and email are required.";
  }

  return errors;
}

// Renders the Profile page and manages its related state and event handlers.
function Profile() {
  const navigate = useNavigate();

  const {
    logout,
    updateStoredUser,
  } = useAuth();

  const {
    values,
    setValues,
    errors,
    handleChange,
    validateForm,
  } = useForm(
    {
      first_name: "",
      last_name: "",
      email: "",
    },
    validateProfile
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [serverError, setServerError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setServerError("");

        const token =
          localStorage.getItem(
            "wearhouse_token"
          );

        const user =
          await getCurrentUser(token);

        setValues({
          first_name:
            user.first_name || "",
          last_name:
            user.last_name || "",
          email:
            user.email || "",
        });
      } catch (error) {
        setServerError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [setValues]);
  async function handleSave(event) {
    event.preventDefault();

    setServerError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updatedUser =
        await updateCurrentUser(
          values
        );

      updateStoredUser(
        updatedUser
      );

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();

    navigate("/login");
  }

  async function handleDeleteAccount() {
    try {
      setServerError("");

      await deleteCurrentUser();

      logout();

      navigate("/register");
    } catch (error) {
      setServerError(error.message);
    }
  }

  const initials =
    `${values.first_name?.[0] || ""}${values.last_name?.[0] || ""
      }`.toUpperCase();

  if (loading) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <h1>Profile & Settings</h1>
        </div>

        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1>
            Profile & Settings
          </h1>

          <p>
            Manage your WearHouse account.
          </p>
        </div>
      </div>

      {(errors.form ||
        serverError) && (
          <p className="auth-error">
            {errors.form ||
              serverError}
          </p>
        )}

      {success && (
        <div className="profile-success">
          ✓ {success}
        </div>
      )}

      <div className="profile-layout">
        <aside className="profile-summary">
          <div className="profile-avatar">
            {initials || "U"}
          </div>

          <h2>
            {values.first_name}{" "}
            {values.last_name}
          </h2>

          <p>
            {values.email}
          </p>

          <button
            type="button"
            className="secondary-button profile-logout"
            onClick={
              handleLogout
            }
          >
            Log Out
          </button>
        </aside>

        <div className="profile-settings-card">
          <h2>
            Account Information
          </h2>

          <form
            onSubmit={
              handleSave
            }
          >
            <div className="form-row">
              <div className="form-group">
                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={
                    values.first_name
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={
                    values.last_name
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  values.email
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="profile-save-area">
              <button
                type="submit"
                className="primary-button"
                disabled={
                  saving
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>

          <div className="profile-danger-zone">
            <div>
              <h3>
                Delete Account
              </h3>

              <p>
                Permanently delete your
                account, wardrobe,
                outfits, calendar,
                and wear history.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                className="danger-button"
                onClick={() =>
                  setShowDeleteConfirm(
                    true
                  )
                }
              >
                Delete Account
              </button>
            ) : (
              <div className="delete-confirmation">
                <p>
                  Are you sure?
                  This cannot be undone.
                </p>

                <div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setShowDeleteConfirm(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={
                      handleDeleteAccount
                    }
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;