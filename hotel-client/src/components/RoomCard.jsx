// src/components/RoomCard.jsx
import "../styles/roomcard.css";

export default function RoomCard({ room, onEdit, onDelete }) {
  const statusClass = (room.status || "Unknown").toLowerCase();
  const raw = localStorage.getItem("data");
  let role = null;

  try {
    role = raw ? JSON.parse(raw).role : null;

  } catch {
    console.log("err")
    // raw was "[object Object]" or something unparsable
    role = null;
  }

  return (
    <div className="room-card">
      <div className="room-header">
        <span className={`status-dot ${statusClass}`} title={room.status} />
        <h3 className="room-number">Room&nbsp;{room.roomNumber}</h3>
      </div>

      <div className="room-info">
        {room.type && <p className="room-type">{room.type}</p>}
        <p className="room-price">
          ₹{Number(room.pricePerDay).toFixed(2)}&nbsp;/&nbsp;day
        </p>
      </div>

      {role == "Admin" && <div className="room-actions">
        <button onClick={() => onEdit(room)}>Edit</button>
        <button onClick={() => onDelete(room.roomId)} className="danger">
          Delete
        </button>
      </div>}
    </div>
  );
}
