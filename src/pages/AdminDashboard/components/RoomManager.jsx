import React from "react";

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
  return (
    <div
      className="card shadow-sm border-0 p-4"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <h4 className="mb-4 text-center text-info fw-semibold">
        🏢 Manage Rooms – {selectedTheaterForRooms.theater_name}
      </h4>

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
            onChange={(e) =>
              setNewRoom({ ...newRoom, room_name: e.target.value })
            }
            required
          />
        </div>
        <div className="flex-grow-1">
          <label className="form-label fw-semibold">Room Type</label>
          <select
            className="form-control"
            value={newRoom.room_type}
            onChange={(e) =>
              setNewRoom({ ...newRoom, room_type: e.target.value })
            }
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
            rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.room_name}</td>
                <td>{room.room_type}</td>
                <td>{room.seats?.length || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-info me-2"
                    onClick={() => handleViewSeats(room)}
                  >
                    View Seats
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteRoom(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Seat Management */}
      {selectedRoom && (
        <div className="mt-5">
          <h5 className="fw-semibold text-primary mb-3">
            🎟 Manage Seats – {selectedRoom.room_name}
          </h5>

          <form
            className="d-flex gap-2 align-items-end mb-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSeat();
            }}
          >
            <div>
              <label className="form-label">Row</label>
              <input
                className="form-control"
                placeholder="A"
                maxLength={1}
                value={newSeat.seat_row}
                onChange={(e) =>
                  setNewSeat({
                    ...newSeat,
                    seat_row: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="form-label">Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="1"
                value={newSeat.seat_number}
                onChange={(e) =>
                  setNewSeat({
                    ...newSeat,
                    seat_number: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="flex-grow-1">
              <label className="form-label">Seat Type</label>
              <select
                className="form-control"
                value={newSeat.seat_type_id}
                onChange={(e) =>
                  setNewSeat({
                    ...newSeat,
                    seat_type_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Select type</option>
                <option value="STD">Standard</option>
                <option value="VIP">VIP</option>
                <option value="DLX">Deluxe</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">
              ➕ Add Seat
            </button>
          </form>

          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Row</th>
                <th>Number</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {seats.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No seats yet.
                  </td>
                </tr>
              ) : (
                seats.map((seat, index) => (
                  <tr key={index}>
                    <td>{seat.seat_row}</td>
                    <td>{seat.seat_number}</td>
                    <td>{seat.seat_type_id}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteSeat(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Back */}
      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            setShowManageRooms(false);
            setSelectedTheaterForRooms(null);
            setSelectedRoom(null);
          }}
        >
          ✖ Back
        </button>
      </div>
    </div>
  );
}
