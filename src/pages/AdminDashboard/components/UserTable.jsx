import React from "react";

export default function UserTable({
  usersList,
  userSearch,
  userFilterStatus,
  userSetSearch,
  userSetFilterStatus,
  userSetSelected,
  userSetEditing,
  usersSetList,
}) {
  return (
    <div className="bg-white rounded shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Quản lý người dùng</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => userSetExporting(true)}
          >
            Xuất Excel
          </button>
        </div>
      </div>

      {/* --- SEARCH & FILTER --- */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 300 }}
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={userSearch}
          onChange={(e) => userSetSearch(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={userFilterStatus}
          onChange={(e) => userSetFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* --- BẢNG DANH SÁCH NGƯỜI DÙNG --- */}
      <table className="table table-bordered align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày sinh</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {usersList
            .filter(
              (u) =>
                (userFilterStatus === "all" || u.status === userFilterStatus) &&
                (u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
                  u.email.toLowerCase().includes(userSearch.toLowerCase()))
            )
            .map((u) => (
              <tr key={u.web_user_id}>
                <td>{u.web_user_id}</td>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.phone_number}</td>
                <td>{u.address}</td>
                <td>{u.date_of_birth}</td>
                <td>{new Date(u.created_at).toLocaleDateString("vi-VN")}</td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "active" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {u.status === "active" ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => userSetSelected(u)}
                  >
                    Xem
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning me-2"
                    onClick={() => {
                      userSetSelected(u);
                      userSetEditing(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className={`btn btn-sm ${
                      u.status === "active"
                        ? "btn-outline-danger"
                        : "btn-outline-success"
                    }`}
                    onClick={() => {
                      usersSetList(
                        usersList.map((usr) =>
                          usr.web_user_id === u.web_user_id
                            ? {
                                ...usr,
                                status:
                                  usr.status === "active" ? "locked" : "active",
                              }
                            : usr
                        )
                      );
                    }}
                  >
                    {u.status === "active" ? "Khóa" : "Mở khóa"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* --- CHI TIẾT NGƯỜI DÙNG --- */}
      {userSelected && !userEditing && (
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
      )}

      {/* --- CHỈNH SỬA THÔNG TIN --- */}
      {userSelected && userEditing && (
        <div className="border rounded p-3 mt-4">
          <h6 className="fw-bold mb-3">Chỉnh sửa thông tin người dùng</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                className="form-control"
                value={userSelected.fullname}
                onChange={(e) =>
                  userSetSelected({
                    ...userSelected,
                    fullname: e.target.value,
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
                value={userSelected.tel}
                onChange={(e) =>
                  userSetSelected({
                    ...userSelected,
                    tel: e.target.value,
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
              <button
                className="btn btn-success"
                onClick={() => {
                  usersSetList(
                    usersList.map((u) =>
                      u.id === userSelected.id ? userSelected : u
                    )
                  );
                  userSetEditing(false);
                  userSetSelected(null);
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
