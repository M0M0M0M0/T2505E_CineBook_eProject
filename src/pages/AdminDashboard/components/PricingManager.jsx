import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  RotateCw,
  RefreshCw,
  Pencil,
} from "lucide-react";

// --- API Helper Functions (Giữ nguyên) ---
const API_BASE = "http://127.0.0.1:8000/api";

const fetchModifiers = async (endpoint, setState, setLoading) => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    const data = await response.json();
    if (data.success) {
      setState(data.data);
    } else {
      console.error(`Failed to fetch ${endpoint}:`, data);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  } finally {
    setLoading(false);
  }
};

const handleSave = async (
  id,
  data,
  endpoint,
  isNew,
  updateState,
  reloadData
) => {
  const method = isNew ? "POST" : "PUT";

  // ✅ Map endpoint sang tên bảng/model đúng
  const endpointToTableMap = {
    "seat-types": "seat_type",
    "day-modifiers": "day_modifier",
    "time-slot-modifiers": "time_slot_modifier",
  };

  const tableName = endpointToTableMap[endpoint];
  const idKey = `${tableName}_id`;

  const url = isNew
    ? `${API_BASE}/${endpoint}`
    : `${API_BASE}/${endpoint}/${id}`;

  // Tạo bản copy và loại bỏ các field internal
  const dataToSend = { ...data };
  delete dataToSend.__isNew;
  // delete dataToSend.__tempKey; // Không cần thiết nếu bạn đã bỏ __tempKey

  // Ensure numeric fields are cast to float before sending
  for (const key in dataToSend) {
    if (key.includes("price") || key.includes("amount")) {
      dataToSend[key] = parseFloat(dataToSend[key]) || 0;
    }
  }

  // Nếu là bản ghi mới, kiểm tra ID. (Đây là logic đã sửa ở lần trước)
  if (isNew && !dataToSend[idKey]) {
    alert("Error: ID must be filled out!");
    return false;
  }

  // --- BỔ SUNG LOGIC GỌI API VÀ XỬ LÝ KẾT QUẢ ---
  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      alert(`Failed to save data: ${errorData.message || response.statusText}`);
      return false;
    }

    const result = await response.json();

    // Cập nhật State (Dữ liệu hiển thị trên bảng)
    updateState((prev) => {
      if (isNew) {
        // Thêm bản ghi mới vào đầu danh sách, loại bỏ ID tạm thời (nếu có)
        return [result.data, ...prev.filter((r) => r[idKey] !== id)];
      } else {
        // Thay thế bản ghi cũ bằng dữ liệu mới nhất từ API
        return prev.map((r) => (r[idKey] === id ? result.data : r));
      }
    });

    // Trả về true để handleSaveClick biết rằng đã lưu thành công và có thể tắt chế độ chỉnh sửa
    return true;
  } catch (error) {
    console.error("Network Error:", error);
    alert("API connection error.");
    return false;
  }
  // --- KẾT THÚC LOGIC BỔ SUNG ---
};

// --- ĐẦU FILE (NGOÀI COMPONENT) ---

// SỬA: Thay thế updateState bằng reloadData
const handleDelete = async (id, endpoint, reloadData) => {
  if (!window.confirm(`Are you sure you want to delete ID: ${id}?`)) return;

  try {
    const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
      method: "DELETE",
    });

    // Không cần const idKey = ... nữa vì chúng ta sẽ reload toàn bộ

    // Kiểm tra status 204 (No Content) hoặc response.ok
    if (response.status === 204 || response.ok) {
      // --- LOGIC RELOAD ĐƠN GIẢN ---
      reloadData(); // <--- GỌI HÀM RELOAD DỮ LIỆU TỪ SERVER

      alert("Deletion successful!");
    } else {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      console.error("API Error:", errorData);
      alert(
        `Failed to delete data: ${errorData.message || response.statusText}`
      );
    }
  } catch (error) {
    console.error("Network Error:", error);
    alert("API connection error.");
  }
};

// --- Custom Toggle Switch Component ---
const ToggleSwitch = ({ name, checked, onChange, disabled = false }) => (
  <label className={`custom-toggle-switch ${disabled ? "disabled" : ""}`}>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className="slider"></span>
  </label>
);

// --- General Pricing Table Component ---
const PricingTable = ({
  title,
  data,
  setData,
  endpoint,
  columns,
  newRowDefaults,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState({});

  const idColumn = columns.find((col) => col.isId);
  const idKey = idColumn ? idColumn.accessor : null;
  if (!idKey)
    throw new Error(
      `PricingTable requires a column with isId: true for endpoint ${endpoint}`
    );

  useEffect(() => {
    fetchModifiers(endpoint, setData, setLoading);
  }, [endpoint, setData]);
  const reloadData = () => {
    fetchModifiers(endpoint, setData, setLoading);
  };

  useEffect(() => {
    // Sử dụng hàm mới này để tải dữ liệu ban đầu
    reloadData();
  }, [endpoint, setData]);
  const handleAdd = () => {
    if (editingId) return;

    const newRow = {
      [idKey]: "", // ID rỗng để người dùng nhập
      ...newRowDefaults,
      __isNew: true,
    };
    setData([newRow, ...data]);
    setEditingId("__NEW__"); // Dùng một ID đặc biệt cho hàng mới
    setTempData(newRow);
  };

  const handleEditStart = (row) => {
    setEditingId(row[idKey]);
    setTempData(row);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = type === "checkbox" ? checked : value;

    setTempData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSaveClick = async () => {
    // 1. Kiểm tra xem có đang thêm mới không
    const isNew = editingId === "__NEW__";

    // 2. Lấy ID từ tempData
    const currentIdValue = tempData[idKey]
      ? String(tempData[idKey]).trim()
      : "";

    // 3. Kiểm tra ID không được rỗng
    if (currentIdValue === "") {
      alert("Please fill in the ID field.");
      return;
    }

    const success = await handleSave(
      currentIdValue,
      tempData,
      endpoint,
      isNew,
      setData,
      reloadData()
    );

    if (success) {
      setEditingId(null);
      setTempData({});
    }
  };

  const handleCancel = () => {
    if (editingId === "__NEW__") {
      setData(data.filter((r) => !r.__isNew));
    }
    setEditingId(null);
    setTempData({});
  };

  // Hàm render input/select/switch dựa trên tên cột
  const renderEditField = (col) => {
    const name = col.accessor;
    const value = tempData[name] !== undefined ? tempData[name] : "";

    // Render Toggle Switch cho is_active
    if (name === "is_active" && col.type === "boolean") {
      return (
        <ToggleSwitch
          name={name}
          checked={tempData[name] || false}
          onChange={handleInputChange}
        />
      );
    }

    // Render Select for Modifier Type
    if (name === "modifier_type") {
      return (
        <select
          name={name}
          value={value}
          onChange={handleInputChange}
          className="form-control form-control-sm"
        >
          <option value="fixed">Fixed Amount</option>
          <option value="percent">Percentage</option>
        </select>
      );
    }
    // Render Select for Operation
    if (name === "operation") {
      return (
        <select
          name={name}
          value={value}
          onChange={handleInputChange}
          className="form-control form-control-sm"
        >
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      );
    }

    // Render default Input (Text/Number)
    return (
      <input
        type={col.type === "number" ? "number" : "text"}
        name={name}
        value={value}
        onChange={handleInputChange}
        className={`form-control form-control-sm ${
          col.isId && editingId !== "__NEW__" ? "bg-light" : ""
        }`}
        disabled={col.isId && editingId !== "__NEW__"}
        placeholder={col.isId && editingId === "__NEW__" ? "Enter ID" : ""}
        min={col.type === "number" ? 0 : undefined}
        step={
          col.accessor.includes("price") || col.accessor.includes("amount")
            ? "0.01"
            : undefined
        }
      />
    );
  };

  const isRowEditing = (row) => {
    if (row.__isNew && editingId === "__NEW__") return true;
    return editingId === row[idKey];
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <div>
          <button
            className="btn btn-sm btn-outline-info me-2"
            onClick={() => fetchModifiers(endpoint, setData, setLoading)}
            disabled={loading || editingId !== null}
          >
            <RefreshCw size={16} /> Reload
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={handleAdd}
            disabled={editingId !== null}
          >
            <Plus size={16} className="me-1" /> Add New
          </button>
        </div>
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading data...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} style={{ width: col.width || "auto" }}>
                    {col.header}
                  </th>
                ))}
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.__isNew ? "__NEW__" : row[idKey]}>
                  {columns.map((col) => (
                    <td key={col.accessor}>
                      {
                        isRowEditing(row) ? (
                          renderEditField(col)
                        ) : col.render ? (
                          col.render(row[col.accessor])
                        ) : // Nếu là cột is_active ở chế độ xem, render Toggle Switch không tương tác
                        col.accessor === "is_active" &&
                          col.type === "boolean" ? (
                          <ToggleSwitch
                            name={col.accessor}
                            checked={row[col.accessor]}
                            onChange={() => {}}
                            disabled={true}
                          />
                        ) : // Render giá tiền
                        col.type === "number" &&
                          (col.accessor.includes("price") ||
                            col.accessor.includes("amount")) ? (
                          `$${(parseFloat(row[col.accessor]) || 0).toFixed(2)}`
                        ) : (
                          row[col.accessor]
                        ) // Render các trường còn lại
                      }
                    </td>
                  ))}
                  <td>
                    {isRowEditing(row) ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-1"
                          onClick={handleSaveClick}
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-sm me-1"
                          onClick={() => handleEditStart(row)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(row[idKey], endpoint, setData)
                          }
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Parent PricingManager Component ---

export default function PricingManager({
  seatTypes,
  setSeatTypes,
  dayModifiers,
  setDayModifiers,
  timeSlots,
  setTimeSlots,
}) {
  const [activeTab, setActiveTab] = useState("seats");

  const seatColumns = [
    { header: "ID", accessor: "seat_type_id", width: "100px", isId: true },
    { header: "Seat Type Name", accessor: "seat_type_name", width: "200px" },
    {
      header: "Base Price (USD)",
      accessor: "seat_type_price",
      type: "number",
      width: "150px",
    },
  ];

  const dayColumns = [
    { header: "ID", accessor: "day_modifier_id", width: "100px", isId: true },
    { header: "Day Type", accessor: "day_type", width: "150px" },
    { header: "Modifier Type", accessor: "modifier_type", width: "150px" },
    {
      header: "Amount/Percent",
      accessor: "modifier_amount",
      type: "number",
      width: "120px",
    },
    { header: "Operation", accessor: "operation", width: "100px" },
    { header: "Status", accessor: "is_active", type: "boolean" },
  ];

  const timeColumns = [
    {
      header: "ID",
      accessor: "time_slot_modifier_id",
      width: "100px",
      isId: true,
    },
    { header: "Time Slot Name", accessor: "time_slot_name", width: "150px" },
    { header: "Start Time", accessor: "ts_start_time", width: "100px" },
    { header: "End Time", accessor: "ts_end_time", width: "100px" },
    { header: "Modifier Type", accessor: "modifier_type", width: "100px" },
    {
      header: "Amount/Percent",
      accessor: "ts_amount",
      type: "number",
      width: "100px",
    },
    { header: "Operation", accessor: "operation", width: "100px" },
    { header: "Status", accessor: "is_active", type: "boolean" },
  ];

  return (
    <div className="container-fluid p-0">
      <h3 className="mb-4">💰 Pricing Rules Management</h3>

      {/* Tab Navigation (English) */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "seats" ? "active" : ""}`}
            onClick={() => setActiveTab("seats")}
          >
            Seat Types ({seatTypes.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "days" ? "active" : ""}`}
            onClick={() => setActiveTab("days")}
          >
            Day Modifiers ({dayModifiers.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "times" ? "active" : ""}`}
            onClick={() => setActiveTab("times")}
          >
            Time Slot Modifiers ({timeSlots.length})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "seats" && (
          <PricingTable
            title="Seat Types & Base Prices"
            data={seatTypes}
            setData={setSeatTypes}
            endpoint="seat-types"
            columns={seatColumns}
            newRowDefaults={{ seat_type_name: "New Type", seat_type_price: 0 }}
          />
        )}

        {activeTab === "days" && (
          <PricingTable
            title="Day-based Price Modifiers"
            data={dayModifiers}
            setData={setDayModifiers}
            endpoint="day-modifiers"
            columns={dayColumns}
            newRowDefaults={{
              day_type: "Weekend",
              modifier_type: "percent",
              modifier_amount: 0,
              operation: "increase",
              is_active: true,
            }}
          />
        )}

        {activeTab === "times" && (
          <PricingTable
            title="Time Slot Price Modifiers"
            data={timeSlots}
            setData={setTimeSlots}
            endpoint="time-slot-modifiers"
            columns={timeColumns}
            newRowDefaults={{
              time_slot_name: "Morning Slot",
              ts_start_time: "08:00:00",
              ts_end_time: "12:00:00",
              modifier_type: "percent",
              ts_amount: 0,
              operation: "increase",
              is_active: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
