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
      .then(() => nav("/login"))
      .catch(err => {
        setError(
          err.response?.data ?? "Registration failed, please try again."
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

        <p className="alt-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
