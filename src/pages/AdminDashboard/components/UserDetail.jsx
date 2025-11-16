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
        <strong>Phone:</strong> {userSelected.phone_number}
      </p>
      <p>
        <strong>Address:</strong> {userSelected.address}
      </p>
      <p>
        <strong>Date of birth:</strong> {userSelected.date_of_birth}
      </p>
      <p>
        <strong>Date created:</strong>{" "}
        {new Date(userSelected.created_at).toLocaleDateString("vi-VN")}
      </p>
      <p>
        <strong>Status:</strong> {userSelected.status}
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
