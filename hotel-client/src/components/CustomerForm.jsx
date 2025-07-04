// src/components/CustomerForm.jsx
import { useState } from "react";
import "../styles/customerform.css";

export default function CustomerForm({ initial, onSubmit, onCancel }) {
  /* regex helpers */
  const nameRx  = /^[A-Za-z\s]{2,100}$/;        // letters + spaces, 2‑100
  const phoneRx = /^\d{10,15}$/;                // 10‑15 digits
  const idRx    = /^[A-Za-z0-9\s-]{5,50}$/;     // letters/digits/space/hyphen

  const [form, setForm] = useState(
    initial ?? { fullName: "", phoneNumber: "", idProof: "" }
  );
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    /* client‑side validation */
    if (!nameRx.test(form.fullName))
      return setError("Full Name: 2‑100 letters & spaces only.");

    if (form.phoneNumber && !phoneRx.test(form.phoneNumber))
      return setError("Phone: 10‑15 digits required.");

    if (form.idProof && !idRx.test(form.idProof))
      return setError("ID Proof: 5‑50 letters, digits, spaces, or hyphens.");

    setError("");
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3>{initial ? "Edit Customer" : "Add Customer"}</h3>

        <label>
          Full Name
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            maxLength={100}
            pattern="[A-Za-z\s]{2,100}"
            title="Letters and spaces only (2‑100 chars)"
          />
        </label>

        <label>
          Phone Number
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            maxLength={15}
            pattern="\d{10,15}"
            title="10‑15 digits"
          />
        </label>

        <label>
          ID Proof
          <input
            name="idProof"
            value={form.idProof}
            onChange={handleChange}
            maxLength={50}
            pattern="[A-Za-z0-9\s-]{5,50}"
            placeholder="Aadhaar, License…"
            title="5‑50 letters, digits, spaces or hyphens"
          />
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
