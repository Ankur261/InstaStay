// src/pages/Login.jsx
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    axios.post("/auth/login", form)
      .then(res => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "data",
          JSON.stringify({
            role:     res.data.role,
            username: res.data.username,
            userId:   res.data.userId,
          })
        );

        window.dispatchEvent(new Event("auth"));

        nav("/");
      })
      .catch(() => setError("Invalid credentials"));
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Staff Login</h2>

        <label>
          Username
          <input
            type="text"
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

        {error && <p className="error">{error}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
