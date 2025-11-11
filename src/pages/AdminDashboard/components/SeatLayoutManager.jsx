import React, { useEffect, useState } from "react";
import "../../TicketBooking/BookingSection.css";

export default function SeatLayoutManager({ room, onClose }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load seats from API
  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/rooms/${room.room_id}/seats`);
        const data = await res.json();

        // Ensure last row is BOX
        if (data.length > 0) {
          const maxRow = data.reduce((max, s) => (s.seat_row > max ? s.seat_row : max), "A");
          data.forEach((s) => {
            if (s.seat_row === maxRow && s.seat_type_id !== "BOX") {
              s.seat_type_id = "BOX";
            }
          });
        }

        const sorted = data.sort((a, b) => {
          if (a.seat_row === b.seat_row) return a.seat_number - b.seat_number;
          return a.seat_row.localeCompare(b.seat_row);
        });

        setSeats(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load seats:", err);
        setLoading(false);
      }
    };
    loadSeats();
  }, [room.room_id]);

  const seatTypeClasses = {
    STD: "standard",
    GLD: "gold",
    PLT: "platinum",
    BOX: "box",
  };
  const seatTypeCycle = ["STD", "GLD", "PLT", "BOX"];

  const handleSeatClick = async (seat) => {
    const nextType =
      seatTypeCycle[(seatTypeCycle.indexOf(seat.seat_type_id) + 1) % seatTypeCycle.length];
    const updatedSeat = { ...seat, seat_type_id: nextType };

    try {
      await fetch(`http://127.0.0.1:8000/api/seats/${seat.seat_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_row: seat.seat_row,
          seat_number: seat.seat_number,
          seat_type_id: nextType,
          room_id: seat.room_id,
        }),
      });
    } catch (err) {
      console.error("Failed to update seat:", err);
    }

    setSeats((prev) =>
      prev.map((s) => (s.seat_id === seat.seat_id ? updatedSeat : s))
    );
  };

  if (loading)
    return (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content bg-dark text-white p-5 text-center">
            Loading seats...
          </div>
        </div>
      </div>
    );

  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.seat_row]) rows[seat.seat_row] = [];
    rows[seat.seat_row].push(seat);
  });
  const sortedRows = Object.keys(rows).sort();

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        role="document"
        style={{ maxWidth: "1100px" }}
      >
        <div className="modal-content bg-dark text-white">
          <div className="modal-header border-0">
            <h5 className="modal-title text-warning">
              🎟 {room.room_name} Layout
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="screen mb-3">SCREEN</div>

            <div
              className="seat-map"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {sortedRows.map((row) => (
                <div key={row} className="d-flex align-items-center justify-content-center gap-3">
                  <div
                    className="fw-bold text-secondary"
                    style={{
                      width: "25px",
                      textAlign: "center",
                      transform: "translateY(-4px)",
                    }}
                  >
                    {row}
                  </div>
                  <div
                    className="d-grid"
                    style={{
                      gridTemplateColumns: "repeat(16, 40px)",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    {rows[row]
                      .sort((a, b) => a.seat_number - b.seat_number)
                      .map((seat) => (
                        <div
                          key={seat.seat_id}
                          className={`seat ${seatTypeClasses[seat.seat_type_id] || "standard"}`}
                          onClick={() => handleSeatClick(seat)}
                          title={`${seat.seat_row}${seat.seat_number} (${seat.seat_type_id})`}
                        >
                          {seat.seat_number}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="legend mt-4 text-center">
              <div className="d-inline-block mx-2">
                <span className="legend-box standard"></span> Standard
              </div>
              <div className="d-inline-block mx-2">
                <span className="legend-box gold"></span> Gold
              </div>
              <div className="d-inline-block mx-2">
                <span className="legend-box platinum"></span> Platinum
              </div>
              <div className="d-inline-block mx-2">
                <span className="legend-box box"></span> Box (Couple)
              </div>
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-outline-light" onClick={onClose}>
              ✖ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
