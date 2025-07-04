// src/components/BookingTable.jsx
import "../styles/bookingtable.css";

export default function BookingTable({ bookings }) {
  if (!bookings.length) return <p>No bookings yet.</p>;

  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Room</th>
          <th>Customer</th>
          <th>Check‑in</th>
          <th>Check‑out</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b, i) => (
          <tr key={b.id}>
            <td>{i + 1}</td>
            <td>{b.roomName}</td>
            <td>{b.customerName}</td>
            <td>{new Date(b.checkIn).toLocaleDateString()}</td>
            <td>{new Date(b.checkOut).toLocaleDateString()}</td>
            <td className={`status ${b.status.toLowerCase()}`}>{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
