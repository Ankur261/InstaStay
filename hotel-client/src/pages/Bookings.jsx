import { useEffect, useState } from "react";
import axios from "../api/axios";
import BookingForm from "../components/BookingForm";
import "../styles/bookingtable.css";

export default function Bookings() {
  
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null → add

  
  const fetchRoomsAndCustomers = () =>
    Promise.all([axios.get("/rooms"), axios.get("/customers")]).then(
      ([r, c]) => {
        setRooms(r.data);
        setCustomers(c.data);
      }
    );

  const fetchBookings = () =>
    axios.get("/bookings").then(res => setBookings(res.data));

  
  useEffect(() => {
    Promise.all([fetchRoomsAndCustomers(), fetchBookings()])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  
  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = booking => {
    setEditing(booking);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this booking?")) return;
    axios.delete(`/bookings/${id}`).then(fetchBookings).catch(console.error);
  };

  /* build API‑shaped payload & POST/PUT */
  const handleSubmit = data => {
    const roomObj     = rooms.find(r => r.roomId === Number(data.roomId));
    const customerObj = customers.find(c => c.customerId === Number(data.customerId));

    const payload = {
      bookingId: editing ? editing.bookingId : 0,
      roomId: Number(data.roomId),
      room: roomObj ?? null,
      customerId: Number(data.customerId),
      customer: customerObj ?? null,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      totalAmount: Number(data.totalAmount),
    };

    const req = editing
      ? axios.put(`/bookings/${editing.bookingId}`, payload)
      : axios.post("/bookings", payload);

    req.then(() => {
        setShowForm(false);
        fetchBookings();
      })
      .catch(console.error);
  };

  /* ───── UI ───── */
  if (loading) return <p>Loading bookings…</p>;

  return (
    <>
      <div className="bookings-header">
        <h1>Bookings</h1>
        <button onClick={handleAddClick}>Add Booking</button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Room</th>
            <th>Customer</th>
            <th>Check‑in</th>
            <th>Check‑out</th>
            <th>Total (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.bookingId}>
              <td>{i + 1}</td>
              <td>{b.room?.roomNumber}</td>
              <td>{b.customer?.fullName}</td>
              <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
              <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
              <td>{Number(b.totalAmount).toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b.bookingId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <BookingForm
          rooms={rooms}
          customers={customers}
          initial={editing}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
