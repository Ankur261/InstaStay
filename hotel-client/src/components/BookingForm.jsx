// src/components/BookingForm.jsx
import { useEffect, useState } from "react";
import "../styles/bookingform.css";

export default function BookingForm({ rooms, customers, initial, onSubmit, onCancel }) {
  /* ─── regex helpers ─── */
  const idRx      = /^[1-9]\d*$/;             // positive integers
  const moneyRx   = /^\d+(\.\d{1,2})?$/;      // 0, 0.99, 10.5, 10.55
  const dateRx    = /^\d{4}-\d{2}-\d{2}$/;    // YYYY-MM-DD

  /* ─── form state ─── */
  const [form, setForm] = useState(
    initial
      ? { ...initial, roomId: String(initial.roomId), customerId: String(initial.customerId) }
      : { roomId: "", customerId: "", checkInDate: "", checkOutDate: "", totalAmount: "" }
  );
  const [error, setError] = useState("");

  /* ─── auto‑recalc total ─── */
  useEffect(() => {
    const room = rooms.find(r => r.roomId === Number(form.roomId));
    if (room && form.checkInDate && form.checkOutDate) {
      const nights =
        (new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86_400_000; // ms→days
      if (nights > 0) {
        setForm(f => ({ ...f, totalAmount: (nights * room.pricePerDay).toFixed(2) }));
      }
    }
  }, [form.roomId, form.checkInDate, form.checkOutDate, rooms]);

  /* ─── change & submit ─── */
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    /* ── client‑side validation ── */
    if (!idRx.test(form.roomId) || !idRx.test(form.customerId))
      return setError("Room and Customer must be valid IDs.");

    if (!dateRx.test(form.checkInDate) || !dateRx.test(form.checkOutDate))
      return setError("Please pick valid dates.");

    if (new Date(form.checkOutDate) <= new Date(form.checkInDate))
      return setError("Check‑out must be after Check‑in.");

    if (!moneyRx.test(form.totalAmount) || Number(form.totalAmount) <= 0)
      return setError("Total amount must be a positive number (max 2 decimals).");

    setError("");
    onSubmit(form); // pass to parent
  };

  /* ─── UI ─── */
  return (
    <div className="modal-backdrop">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3>{initial ? "Edit Booking" : "Add Booking"}</h3>

        {/* Room */}
        <label>
          Room
          <select name="roomId" value={form.roomId} onChange={handleChange} required>
            <option value="">— Select Room —</option>
            {rooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.roomNumber} ({r.type})
              </option>
            ))}
          </select>
        </label>

        {/* Customer */}
        <label>
          Customer
          <select name="customerId" value={form.customerId} onChange={handleChange} required>
            <option value="">— Select Customer —</option>
            {customers.map(c => (
              <option key={c.customerId} value={c.customerId}>
                {c.fullName}
              </option>
            ))}
          </select>
        </label>

        {/* Dates */}
        <label>
          Check‑in Date
          <input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} required />
        </label>

        <label>
          Check‑out Date
          <input type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} required />
        </label>

        {/* Total */}
        <label>
          Total (₹)
          <input type="number" name="totalAmount" step="0.01" value={form.totalAmount} onChange={handleChange} required />
        </label>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
