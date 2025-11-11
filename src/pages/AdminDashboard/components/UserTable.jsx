import React, { useEffect, useState } from "react";

export default function UserTable({
  usersList,
  usersSetList,
  userSearch,
  userSetSearch,
  userFilterStatus,
  userSetFilterStatus,
  userSetSelected,
  userSetEditing,
}) {
  const [autoRefresh, setAutoRefresh] = useState(true);

  // --- Fetch users from backend ---
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users");
      const data = await res.json();
      usersSetList(data);
    } catch (err) {
      console.error("❌ Failed to load users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Optional: auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // --- Export CSV ---
  const handleExportExcel = () => {
    const headers = [
      "ID",
      "Họ tên",
      "Email",
      "Điện thoại",
      "Địa chỉ",
      "Ngày sinh",
      "Trạng thái",
      "Ngày tạo",
    ];
    const rows = usersList.map((u) => [
      u.web_user_id,
      u.full_name,
      u.email,
      u.phone_number,
      u.address,
      u.date_of_birth,
      u.status,
      new Date(u.created_at).toLocaleDateString("vi-VN"),
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "users_report.csv";
    link.click();
  };

  // --- Toggle user status ---
  const handleToggleStatus = async (user) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/users/${user.web_user_id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      usersSetList(
        usersList.map((u) =>
          u.web_user_id === user.web_user_id
            ? {
                ...u,
                status: u.status === "active" ? "locked" : "active",
              }
            : u
        )
      );
    } catch (err) {
      console.error("❌ Failed to toggle user status:", err);
      alert("Không thể cập nhật trạng thái người dùng.");
    }
  };

  // --- Delete user ---
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${user.full_name}?`)) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/${user.web_user_id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      usersSetList(usersList.filter((u) => u.web_user_id !== user.web_user_id));
      alert("✅ Xóa người dùng thành công!");
    } catch (err) {
      console.error("❌ Delete user failed:", err);
      alert("Không thể xóa người dùng.");
    }
  };

  // --- Filter + Search ---
  const filteredUsers = usersList.filter(
    (u) =>
      (userFilterStatus === "all" || u.status === userFilterStatus) &&
      (u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="bg-white rounded shadow-sm p-4">
      {/* --- HEADER --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Quản lý người dùng</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success btn-sm"
            onClick={handleExportExcel}
          >
            Xuất Excel
          </button>
          <button
            className={`btn btn-sm ${
              autoRefresh ? "btn-outline-danger" : "btn-outline-primary"
            }`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Tắt làm mới" : "Bật làm mới"}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchUsers}
          >
            Làm mới
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

      {/* --- TABLE --- */}
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
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
                    } me-2`}
                    onClick={() => handleToggleStatus(u)}
                  >
                    {u.status === "active" ? "Khóa" : "Mở khóa"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteUser(u)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-muted">
                Không tìm thấy người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

