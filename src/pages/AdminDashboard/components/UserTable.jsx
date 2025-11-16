import React, { useEffect, useState } from "react";

export default function UserTable() {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [editedUsers, setEditedUsers] = useState({}); 

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users");
      const data = await res.json();
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle local field change
  const handleLocalChange = (id, field, value) => {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Save changes to backend
  const handleSave = async (id) => {
    const changes = editedUsers[id];
    if (!changes) return;

    setSaving(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!res.ok) throw new Error("Failed to update user");
      const data = await res.json();

      // update in table
      setUsersList((prev) =>
        prev.map((u) =>
          u.web_user_id === id ? { ...u, ...data.user } : u
        )
      );

      // clear temporary edits
      setEditedUsers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      alert("✅ Update successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed!");
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/users/${id}`, { method: "DELETE" });
      setUsersList(usersList.filter((u) => u.web_user_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filter by search
  const filteredUsers = usersList.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card p-4 mt-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0 text-dark">User management</h5>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm kiếm theo tên hoặc email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Full name</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Address</th>
              <th>Date of birth</th>
              <th>New password</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const edits = editedUsers[user.web_user_id] || {};
                return (
                  <tr key={user.web_user_id}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          edits.full_name ?? user.full_name ?? ""
                        }
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "full_name",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="form-control"
                        value={edits.email ?? user.email ?? ""}
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "email",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          edits.phone_number ?? user.phone_number ?? ""
                        }
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "phone_number",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={edits.address ?? user.address ?? ""}
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "address",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={
                          edits.date_of_birth ??
                          (user.date_of_birth
                            ? user.date_of_birth.slice(0, 10)
                            : "")
                        }
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "date_of_birth",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={edits.password ?? ""}
                        onChange={(e) =>
                          handleLocalChange(
                            user.web_user_id,
                            "password",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.web_user_id)}
                        >
                          Xóa
                        </button>
                        {editedUsers[user.web_user_id] && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSave(user.web_user_id)}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


