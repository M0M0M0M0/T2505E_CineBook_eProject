import React from "react";

export default function UserDetail({
  userSelected,
  userSetEditing,
  userSetSelected,
}) {
  return (
    <div className="border rounded p-3 mt-4">
      <h6 className="fw-bold mb-3">User details</h6>
      <p>
        <strong>ID:</strong> {userSelected.web_user_id}
      </p>
      <p>
        <strong>Full name:</strong> {userSelected.full_name}
      </p>
      <p>
        <strong>Email:</strong> {userSelected.email}
      </p>
      <p>
        <strong>Phone number:</strong> {userSelected.phone_number}
      </p>
      <p>
        <strong>Address:</strong> {userSelected.address}
        <strong>Address:</strong> {userSelected.address}
      </p>
      <p>
        <strong>Dob:</strong> {userSelected.date_of_birth}
      </p>
      <p>
        <strong>Created at:</strong>{" "}
        {new Date(userSelected.created_at).toLocaleDateString("vi-VN")}
      </p>

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => userSetEditing(true)}
        >
          Edit
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => userSetSelected(null)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
