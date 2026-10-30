// Renders a WearHouse application page and manages its user interactions.


import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import useForm from "../hooks/useForm";

import {
  registerUser,
} from "../services/authService";

// Checks required registration fields and their validity.
function validateRegister(values) {
  const errors = {};

  if (
    !values.first_name ||
    !values.last_name ||
    !values.email ||
    !values.password ||
    !values.confirmPassword
  ) {
    errors.form =
      "Please fill in all fields.";

    return errors;
  }

  if (
    values.password !==
    values.confirmPassword
  ) {
    errors.form =
      "Passwords do not match.";
  }

  if (values.password.length < 6) {
    errors.form =
      "Password must be at least 6 characters.";
  }

  return errors;
}

// Renders the Register page and manages its related state and event handlers.
function Register() {
  const navigate = useNavigate();

  const {
    values,
    errors,
    handleChange,
    validateForm,
  } = useForm(
    {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validateRegister
  );

  const [serverError, setServerError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });

      setSuccess(
        "Account created successfully! Redirecting you to sign in..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          WearHouse
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start building your digital wardrobe.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>

              <input
                type="text"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>

              <input
                type="text"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={
                values.confirmPassword
              }
              onChange={handleChange}
            />
          </div>

          {errors.form && (
            <p className="auth-error">
              {errors.form}
            </p>
          )}

          {serverError && (
            <p className="auth-error">
              {serverError}
            </p>
          )}

          {success && (
            <div className="auth-success">
              <span className="auth-success-icon">
                ✓
              </span>

              <div>
                <strong>
                  Account created
                </strong>

                <p>{success}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="primary-button auth-primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Link
          to="/login"
          className="auth-secondary-link"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}

export default Register;