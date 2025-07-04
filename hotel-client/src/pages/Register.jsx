import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    role: "Receptionist",
  });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
  e.preventDefault();
  setError("");

  const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/; //Alphanumeric + underscore, 4–15 chars
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; //At least 6 chars, 1 digit, 1 uppercase

  if (!usernameRegex.test(form.username)) {
    setError("Username must be 4–15 characters (letters, numbers, underscores).");
    return;
  }

  if (!passwordRegex.test(form.password)) {
    setError("Password must be at least 6 characters, include 1 uppercase letter and 1 number.");
    return;
  }

  if (form.password !== form.confirm) {
    setError("Passwords do not match.");
    return;
  }

  const payload = {
    username: form.username,
    password: form.password,
    role: form.role,
  };

  axios
    .post("/auth/register", payload)
    .then(() => nav("/")) 
    .catch(err => {
      setError(
        err.response?.data?.message ?? "Registration failed, please try again."
      );
    });
};

  return (
    <div className="register-wrapper">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Admin">Admin</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
