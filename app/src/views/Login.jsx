// Renders a WearHouse application page and manages its user interactions.


import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import useForm from "../hooks/useForm";
import useAuth from "../hooks/useAuth";

import {
  loginUser,
} from "../services/authService";

// Checks submitted login credentials for valid input.
function validateLogin(values) {
  const errors = {};

  if (!values.email || !values.password) {
    errors.form =
      "Please enter your email and password.";
  }

  return errors;
}

// Renders the Login page and manages its related state and event handlers.
function Login() {
  const navigate = useNavigate();

  const { saveSession } = useAuth();

  const {
    values,
    errors,
    handleChange,
    validateForm,
  } = useForm(
    {
      email: "",
      password: "",
    },
    validateLogin
  );

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: values.email,
        password: values.password,
      });

      saveSession(data);

      navigate("/");
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

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to manage your wardrobe.
        </p>

        <form onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="primary-button auth-primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <Link
          to="/register"
          className="auth-secondary-link"
        >
          Create a New Account
        </Link>
      </div>
    </div>
  );
}

export default Login;