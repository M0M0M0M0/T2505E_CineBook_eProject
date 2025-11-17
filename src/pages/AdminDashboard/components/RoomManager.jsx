import React from "react";
import SeatLayoutManager from "./SeatLayoutManager";

export default function RoomManager({
  showManageRooms,
  selectedTheaterForRooms,
  rooms,
  newRoom,
  setNewRoom,
  handleAddRoom,
  handleDeleteRoom,
  handleViewSeats,
  selectedRoom,
  seats,
  newSeat,
  setNewSeat,
  handleAddSeat,
  handleDeleteSeat,
  setShowManageRooms,
  setSelectedTheaterForRooms,
  setSelectedRoom,
}) {
  if (!showManageRooms) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-white rounded shadow-lg p-4" style={{ width: "90%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" }}>
        <h4 className="mb-4 text-center text-info fw-semibold">
          🏢 Manage Rooms – {selectedTheaterForRooms.theater_name}
        </h4>
    <button
    type="button"
    className="btn btn-sm btn-light text-primary fw-bold"
    style={{
      lineHeight: "1",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
    }}
    onClick={() => {
      setShowManageRooms(false);
      setSelectedTheaterForRooms(null);
      setSelectedRoom(null);
    }}
  >
    ×
  </button>

        {/* Add Room Form */}
        <form
          className="d-flex gap-2 align-items-end mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddRoom();
          }}
        >
          <div className="flex-grow-1">
            <label className="form-label fw-semibold">Room Name</label>
            <input
              className="form-control"
              placeholder="Enter room name"
              value={newRoom.room_name}
              onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
              required
            />
          </div>
          <div className="flex-grow-1">
            <label className="form-label fw-semibold">Room Type</label>
            <select
              className="form-control"
              value={newRoom.room_type}
              onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
              required
            >
              <option value="">Select type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            ➕ Add Room
          </button>
        </form>

        {/* Room Table */}
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Room Name</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No rooms yet.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_name}</td>
                  <td>{room.room_type}</td>
                  <td>{room.seats?.length || 0}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleViewSeats(room)}>
                      View Seats
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(room.room_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Seat Management (visual layout) */}
        {selectedRoom && (
          <SeatLayoutManager
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        )}


        <div className="text-end mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setShowManageRooms(false);
              setSelectedTheaterForRooms(null);
              setSelectedRoom(null);
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}

