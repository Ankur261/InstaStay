// src/pages/Rooms.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import RoomCard from "../components/RoomCard";
import RoomForm from "../components/RoomForm";
import "../styles/rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null → add

  const raw = localStorage.getItem("data");
  let role = null;

  try {
    role = raw ? JSON.parse(raw).role : null;

  } catch {
    console.log("err")
    // raw was "[object Object]" or something unparsable
    role = null;
  }

  const fetchRooms = () =>
    axios.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));


  useEffect(() => {
    fetchRooms();     

  }, []);
 
  const handleAddClick = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = room => {
    setEditing(room);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (!window.confirm("Delete this room?")) return;
    axios.delete(`/rooms/${id}`)
      .then(fetchRooms)
      .catch(console.error);
  };

  const handleSubmit = data => {
    const call = editing
      ? axios.put(`/rooms/${editing.roomId}`, { ...editing, ...data })
      : axios.post("/rooms", data);

    call.then(() => {
        setShowForm(false);
        fetchRooms();
      })
      .catch(console.error);
  };


  if (loading) return <p>Loading rooms…</p>;

  return (
    <>
      <div className="rooms-header">
        <h1>Rooms</h1>
        {role == "Admin" && <button onClick={handleAddClick}>Add Room</button>}
      </div>

      <section className="rooms-grid">
        {rooms.map(r => (
          <RoomCard
            key={r.roomId}
            room={r}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </section>

      {showForm && (
        <RoomForm
          initial={editing}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
