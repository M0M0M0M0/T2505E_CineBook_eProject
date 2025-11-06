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
    // Lưu thay đổi thông tin người dùng
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
      <h6 className="fw-bold mb-3">Chỉnh sửa thông tin người dùng</h6>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Họ tên</label>
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
          <label className="form-label">Điện thoại</label>
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
          Hủy
        </button>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-info"
            onClick={() => userSetChangingPassword(true)}
          >
            Đổi mật khẩu
          </button>
          <button className="btn btn-success" onClick={handleSaveChanges}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
