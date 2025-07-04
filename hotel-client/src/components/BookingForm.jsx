import { useEffect, useState } from "react";
import "../styles/bookingform.css";

export default function BookingForm({ rooms, customers, initial, onSubmit, onCancel }) {
  /* form state */
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          roomId:     String(initial.roomId),
          customerId: String(initial.customerId),
        }
      : {
          roomId: "",
          customerId: "",
          checkInDate: "",
          checkOutDate: "",
          totalAmount: "",
        }
  );

  /* auto‑recalc total when room or dates change */
  useEffect(() => {
    const room = rooms.find(r => r.roomId === Number(form.roomId));
    if (room && form.checkInDate && form.checkOutDate) {
      const nights =
        (new Date(form.checkOutDate) - new Date(form.checkInDate)) /
        (1000 * 60 * 60 * 24);
      if (nights > 0) {
        setForm(f => ({
          ...f,
          totalAmount: (nights * room.pricePerDay).toFixed(2),
        }));
      }
    }
  }, [form.roomId, form.checkInDate, form.checkOutDate, rooms]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3>{initial ? "Edit Booking" : "Add Booking"}</h3>

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

        <label>
          Customer
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
          >
            <option value="">— Select Customer —</option>
            {customers.map(c => (
              <option key={c.customerId} value={c.customerId}>
                {c.fullName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Check‑in Date
          <input
            type="date"
            name="checkInDate"
            value={form.checkInDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Check‑out Date
          <input
            type="date"
            name="checkOutDate"
            value={form.checkOutDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Total (₹)
          <input
            type="number"
            name="totalAmount"
            step="0.01"
            value={form.totalAmount}
            onChange={handleChange}
            required
          />
        </label>

        <div className="modal-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
