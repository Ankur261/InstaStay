// src/pages/Customers.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import CustomerForm from "../components/CustomerForm";
import "../styles/customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const raw = localStorage.getItem("data");
  let role = null;

  try {
    role = raw ? JSON.parse(raw).role : null;

  } catch {
    console.log("err")
    // raw was "[object Object]" or something unparsable
    role = null;
  }

  const fetchCustomers = () =>
    axios.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = customer => {
    setEditing(customer);
    setShowForm(true);
  };

  const handleDelete = id => {
    console.log(id)
    if (!window.confirm("Delete this customer?")) return;
    axios.delete(`/customers/${id}`)
      .then(fetchCustomers)
      .catch(console.error);
  };

  const handleSubmit = data => {
    const call = editing
      ? axios.put(`/customers/${editing.customerId}`, { ...editing, ...data })
      : axios.post("/customers", data);

    call.then(() => {
      setShowForm(false);
      fetchCustomers();
    })
      .catch(console.error);
  };


  if (loading) return <p>Loading customers…</p>;

  return (
    <>
      <div className="customers-header">
        <h1>Customers</h1>
        <button onClick={handleAddClick}>Add Customer</button>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>ID Proof</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={c.customerId}>
              <td>{i + 1}</td>
              <td>{c.fullName}</td>
              <td>{c.phoneNumber}</td>
              <td>{c.idProof}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                {role == "Admin" && <button onClick={() => handleDelete(c.customerId)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <CustomerForm
          initial={editing}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
