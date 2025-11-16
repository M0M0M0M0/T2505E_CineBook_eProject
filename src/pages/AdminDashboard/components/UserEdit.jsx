import React from "react";

export default function UserEdit({
  userSelected,
  userSetSelected,
  userSetEditing,
  userSetChangingPassword,
  usersSetList,
  usersList,
}) {
  const handleSaveChanges = () => {
    usersSetList(
      usersList.map((u) =>
        u.web_user_id === userSelected.web_user_id ? userSelected : u
      )
    );
    userSetEditing(false);
    userSetSelected(null);
  };

  return (
    <div className="border rounded p-3 mt-4">
      <h6 className="fw-bold mb-3">Edit user information</h6>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Full name</label>
          <input
            type="text"
            className="form-control"
            value={userSelected.full_name}
            onChange={(e) =>
              userSetSelected({
                ...userSelected,
                full_name: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={userSelected.email}
            onChange={(e) =>
              userSetSelected({
                ...userSelected,
                email: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            value={userSelected.phone_number}
            onChange={(e) =>
              userSetSelected({
                ...userSelected,
                phone_number: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            userSetEditing(false);
            userSetSelected(null);
          }}
        >
          Cancel
        </button>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-info"
            onClick={() => userSetChangingPassword(true)}
          >
            Change password
          </button>
          <button className="btn btn-success" onClick={handleSaveChanges}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
