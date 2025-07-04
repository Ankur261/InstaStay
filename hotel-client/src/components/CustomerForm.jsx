// src/components/CustomerForm.jsx
import { useState } from "react";
import "../styles/customerform.css";

export default function CustomerForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ?? { fullName: "", phoneNumber: "", idProof: "" }
  );

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
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
          />
        </label>

        <label>
          Phone Number
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            maxLength={15}
          />
        </label>

        <label>
          ID Proof
          <input
            name="idProof"
            value={form.idProof}
            onChange={handleChange}
            maxLength={50}
            placeholder="Aadhaar, License…"
          />
        </label>

        <div className="modal-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
