// src/components/RoomForm.jsx
import { useState, useEffect } from "react";
import "../styles/roomform.css";

export default function RoomForm({ initial, onCancel, onSubmit }) {
  const blank = {
    roomNumber: "",
    type: "Single",
    pricePerDay: "",
    status: "Available",
  };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="overlay">
      <form className="room-form" onSubmit={handleSubmit}>
        <h2>{initial ? "Edit Room" : "Add Room"}</h2>

        <label>Room Number
          <input
            name="roomNumber"
            maxLength="10"
            required
            value={form.roomNumber}
            onChange={handleChange}
          />
        </label>

        <label>Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option>Single</option>
            <option>Double</option>
            <option>Deluxe</option>
          </select>
        </label>

        <label>Price Per Day (₹)
          <input
            type="number"
            name="pricePerDay"
            min="0"
            step="0.01"
            required
            value={form.pricePerDay}
            onChange={handleChange}
          />
        </label>

        <label>Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Available</option>
            <option>Booked</option>
            <option>Maintenance</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit">{initial ? "Save" : "Add"}</button>
          <button type="button" onClick={onCancel} className="secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
