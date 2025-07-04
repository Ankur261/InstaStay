// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const nav = useNavigate();

  /* ─── auth state ─── */
  const readToken = () => Boolean(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(readToken);

  /* keep in sync across tabs AND same‑tab auth events */
  useEffect(() => {
    const sync = () => setIsLoggedIn(readToken());
    window.addEventListener("storage", sync); // other tabs
    window.addEventListener("auth",    sync); // same tab
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth",    sync);
    };
  }, []);

  /* ─── logout handler ─── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");

    // 🔔 notify App.jsx in the same tab
    window.dispatchEvent(new Event("auth"));

    nav("/login"); // App now has logged‑out routes, so this exists
  };

  return (
    <nav>
      <h1 className="logo">
        <Link to="/">InstaStay&nbsp;Hotel</Link>
      </h1>

      <ul className="nav-links">
        <li><Link to="/rooms">Rooms</Link></li>
        <li><Link to="/bookings">Bookings</Link></li>
        <li><Link to="/customers">Customers</Link></li>

        {!isLoggedIn ? (
          <li><Link to="/login">Login</Link></li>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
