// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const nav = useNavigate();

  /* ---------- auth & role state ---------- */
  const readAuth = () => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("data");
    let role = null;
    
    try {
      role = raw ? JSON.parse(raw).role : null;
      
    } catch {
      console.log("err")
      // raw was "[object Object]" or something unparsable
      role = null;
    }

    return { isLoggedIn: Boolean(token), role };
  };

  const [{ isLoggedIn, role }, setAuth] = useState(readAuth);

  /* ---------- sync across tabs ---------- */
  useEffect(() => {
    const handler = () => setAuth(readAuth());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /* ---------- logout ---------- */
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");

    // 🔔 tell App.jsx (same tab) the auth state changed
    window.dispatchEvent(new Event("auth"));

    setAuth({ isLoggedIn: false, role: null });

    // now App re‑renders using the logged‑out routes
    nav("/login");
  };

  /* ---------- UI ---------- */
  return (
    <aside>
      <h2 className="side-title">Menu</h2>

      <NavLink to="/" end>Dashboard</NavLink>
      <NavLink to="/rooms">Rooms</NavLink>
      <NavLink to="/bookings">Bookings</NavLink>
      <NavLink to="/customers">Customers</NavLink>

      {/* Register link only for Admins */}
      {isLoggedIn && role === "Admin" && (
        <NavLink to="/register">Register</NavLink>
      )}

      {/* Logout button for any logged‑in user */}
      {isLoggedIn && (
        <button className="logout-link" onClick={handleLogout}>
          Logout
        </button>
      )}
    </aside>
  );
}
