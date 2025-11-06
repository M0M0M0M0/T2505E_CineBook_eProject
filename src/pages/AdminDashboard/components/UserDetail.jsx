import React from "react";

export default function UserDetail({
  userSelected,
  userSetEditing,
  userSetSelected,
}) {
  return (
    <div className="border rounded p-3 mt-4">
      <h6 className="fw-bold mb-3">Chi tiết người dùng</h6>
      <p>
        <strong>ID:</strong> {userSelected.web_user_id}
      </p>
      <p>
        <strong>Họ tên:</strong> {userSelected.full_name}
      </p>
      <p>
        <strong>Email:</strong> {userSelected.email}
      </p>
      <p>
        <strong>Điện thoại:</strong> {userSelected.phone_number}
      </p>
      <p>
        <strong>Địa chỉ:</strong> {userSelected.address}
      </p>
      <p>
        <strong>Ngày sinh:</strong> {userSelected.date_of_birth}
      </p>
      <p>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(userSelected.created_at).toLocaleDateString("vi-VN")}
      </p>
      <p>
        <strong>Trạng thái:</strong> {userSelected.status}
      </p>

      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => userSetEditing(true)}
        >
          Chỉnh sửa
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => userSetSelected(null)}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
