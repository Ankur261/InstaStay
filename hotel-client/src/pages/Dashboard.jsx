// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios.get("/dashboard/metrics")
      .then(res => setMetrics(res.data))
      .catch(err => {
        console.error("Failed to fetch metrics. Using static fallback.", err);
        setMetrics({
          totalRooms:3,
          occupiedRooms: 1,
          bookingsToday: 1,
          revenueToday: 100,
        });
      });
  }, []);

  if (!metrics) return <p>Loading metrics…</p>;

  const cards = [
    { label: "Total Rooms", value: metrics.totalRooms },
    { label: "Occupied", value: metrics.occupiedRooms },
    { label: "Today's Bookings", value: metrics.bookingsToday },
    { label: "Revenue (₹)", value: metrics.revenueToday },
  ];

  return (
    <section className="dashboard-grid">
      {cards.map(c => (
        <div key={c.label} className="dash-card">
          <h3>{c.value}</h3>
          <p>{c.label}</p>
        </div>
      ))}
    </section>
  );
}
