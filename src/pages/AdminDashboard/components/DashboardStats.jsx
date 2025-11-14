import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Film,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Building,
  Clock,
  Download,
  FileText,
} from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/dashboard";

export default function DashboardStats() {
  // ✅ State cho các thống kê
  const [overview, setOverview] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState("daily"); // daily, weekly, monthly
  const [salesData, setSalesData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [revenueByTheater, setRevenueByTheater] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#95E1D3", "#F38181"];

  // ✅ Fetch tất cả data khi component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ Fetch lại sales data khi đổi period
  useEffect(() => {
    fetchSalesData(salesPeriod);
  }, [salesPeriod]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchOverview(),
        fetchSalesData(salesPeriod),
        fetchTopMovies(),
        fetchRevenueByTheater(),
        fetchUserRegistrations(),
        fetchActiveBookings(),
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/overview`);
      const data = await res.json();
      setOverview(data);
    } catch (err) {
      console.error("Error fetching overview:", err);
    }
  };

  const fetchSalesData = async (period) => {
    try {
      const res = await fetch(`${API_BASE}/sales/${period}`);
      const data = await res.json();

      // Format data cho chart
      const formatted = data.map((item) => ({
        name: item.date || item.week_label || item.month_label,
        bookings: parseInt(item.bookings),
        revenue: parseFloat(item.revenue),
      }));

      setSalesData(formatted);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  };

  const fetchTopMovies = async () => {
    try {
      const res = await fetch(`${API_BASE}/top-movies?limit=5`);
      const data = await res.json();
      setTopMovies(data);
    } catch (err) {
      console.error("Error fetching top movies:", err);
    }
  };

  const fetchRevenueByTheater = async () => {
    try {
      const res = await fetch(`${API_BASE}/revenue-by-theater`);
      const data = await res.json();
      setRevenueByTheater(data);
    } catch (err) {
      console.error("Error fetching revenue by theater:", err);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch(`${API_BASE}/user-registrations?period=daily`);
      const data = await res.json();

      const formatted = data.map((item) => ({
        name: item.date || item.week || item.month,
        count: parseInt(item.count),
      }));

      setUserRegistrations(formatted);
    } catch (err) {
      console.error("Error fetching user registrations:", err);
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/active-bookings`);
      const data = await res.json();
      setActiveBookings(data);
    } catch (err) {
      console.error("Error fetching active bookings:", err);
    }
  };

  // ============================================
  // 📊 EXPORT FUNCTIONS
  // ============================================

  /**
   * Export Sales Report (Daily/Weekly/Monthly)
   */
  /**
   * Export Sales Report với dynamic columns
   */
  const exportSalesReport = async (period) => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/export/sales/${period}`);

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const data = await res.json();

      // Dynamic columns
      const columnMap = {
        daily: [
          { key: "date", label: "Date" },
          { key: "bookings", label: "Total Bookings" },
          { key: "revenue", label: "Total Revenue ($)" },
        ],
        weekly: [
          { key: "week_label", label: "Week" },
          { key: "week_start", label: "Start Date" },
          { key: "week_end", label: "End Date" },
          { key: "bookings", label: "Total Bookings" },
          { key: "revenue", label: "Total Revenue ($)" },
        ],
        monthly: [
          { key: "month_label", label: "Month" },
          { key: "bookings", label: "Total Bookings" },
          { key: "revenue", label: "Total Revenue ($)" },
        ],
      };

      const columns = columnMap[period] || columnMap.daily;
      const csv = convertToCSV(data, columns);
      downloadFile(
        csv,
        `sales_report_${period}_${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (err) {
      console.error("Error exporting sales:", err);
      alert("Failed to export sales report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  /**
   * Convert JSON to CSV với format đẹp
   */
  const convertToCSV = (data, columns) => {
    if (!data || data.length === 0) {
      return "No data available";
    }

    // Header
    const header = columns.map((col) => col.label).join(",");

    // Rows
    const rows = data.map((row) => {
      return columns
        .map((col) => {
          let value = row[col.key];

          // Handle nulls
          if (value === null || value === undefined) {
            return "";
          }

          // Format numbers
          if (typeof value === "number") {
            if (col.key.includes("revenue") || col.key.includes("price")) {
              return parseFloat(value).toFixed(2);
            }
            return value;
          }

          // Escape commas in strings
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }

          return value;
        })
        .join(",");
    });

    return [header, ...rows].join("\n");
  };
  const exportRevenueByTheater = async () => {
    setExporting(true);
    try {
      const csv = convertToCSV(revenueByTheater, [
        { key: "theater_name", label: "Theater Name" },
        { key: "theater_address", label: "Address" },
        { key: "total_bookings", label: "Total Bookings" },
        { key: "total_revenue", label: "Total Revenue ($)" },
      ]);

      downloadFile(
        csv,
        `revenue_by_theater_${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (err) {
      console.error("Error exporting theater revenue:", err);
      alert("Failed to export theater revenue");
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export Top Movies
   */
  const exportTopMovies = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_BASE}/top-movies?limit=100`); // Get more for export
      const data = await res.json();

      const csv = convertToCSV(data, [
        { key: "movie_id", label: "Movie ID" },
        { key: "title", label: "Movie Title" },
        { key: "total_bookings", label: "Total Bookings" },
        { key: "total_revenue", label: "Total Revenue ($)" },
        { key: "avg_rating", label: "Average Rating" },
      ]);

      downloadFile(
        csv,
        `top_movies_${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (err) {
      console.error("Error exporting top movies:", err);
      alert("Failed to export top movies");
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export User Registrations
   */
  const exportUserRegistrations = async () => {
    setExporting(true);
    try {
      const res = await fetch(
        `${API_BASE}/user-registrations?period=daily&days=90`
      );
      const data = await res.json();

      const csv = convertToCSV(data, [
        { key: "date", label: "Date" },
        { key: "count", label: "New Users" },
      ]);

      downloadFile(
        csv,
        `user_registrations_${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (err) {
      console.error("Error exporting user registrations:", err);
      alert("Failed to export user registrations");
    } finally {
      setExporting(false);
    }
  };

  /**
   * Export Active Bookings
   */
  const exportActiveBookings = async () => {
    setExporting(true);
    try {
      const csv = convertToCSV(activeBookings, [
        { key: "booking_id", label: "Booking ID" },
        { key: "user_name", label: "User Name" },
        { key: "movie_title", label: "Movie Title" },
        { key: "grand_total", label: "Amount ($)" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Created At" },
        { key: "expires_at", label: "Expires At" },
      ]);

      downloadFile(
        csv,
        `active_bookings_${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (err) {
      console.error("Error exporting active bookings:", err);
      alert("Failed to export active bookings");
    } finally {
      setExporting(false);
    }
  };

  /**
   * Convert JSON to CSV
   */

  /**
   * Download file
   */
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {/* ✅ HEADER WITH EXPORT BUTTONS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 text-muted">📊 Dashboard Overview</h2>

        {/* Export Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-danger dropdown-toggle"
            type="button"
            id="exportDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} className="me-2" />
                Export Reports
              </>
            )}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="exportDropdown"
          >
            <li>
              <h6 className="dropdown-header">📈 Sales Reports</h6>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => exportSalesReport("daily")}
              >
                <FileText size={16} className="me-2" />
                Daily Sales
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => exportSalesReport("weekly")}
              >
                <FileText size={16} className="me-2" />
                Weekly Sales
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => exportSalesReport("monthly")}
              >
                <FileText size={16} className="me-2" />
                Monthly Sales
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <h6 className="dropdown-header">🎬 Other Reports</h6>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={exportRevenueByTheater}
              >
                <Building size={16} className="me-2" />
                Revenue by Theater
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={exportTopMovies}>
                <Film size={16} className="me-2" />
                Most Popular Movies
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={exportUserRegistrations}
              >
                <Users size={16} className="me-2" />
                User Registrations
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={exportActiveBookings}>
                <Clock size={16} className="me-2" />
                Active Bookings
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ 1. STATS CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Total Bookings</p>
                  <h3 className="fw-bold mb-0">
                    {overview?.total_bookings?.toLocaleString()}
                  </h3>
                  <small
                    className={`${
                      overview?.bookings_change_percent >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {overview?.bookings_change_percent >= 0 ? "+" : ""}
                    {overview?.bookings_change_percent}% from last week
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <Film size={28} className="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Today's Bookings</p>
                  <h3 className="fw-bold mb-0">
                    {overview?.today_bookings?.toLocaleString()}
                  </h3>
                  <small className="text-muted">
                    Week: {overview?.week_bookings}
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Calendar size={28} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Total Revenue</p>
                  <h3 className="fw-bold mb-0">
                    ${overview?.total_revenue?.toLocaleString()}
                  </h3>
                  <small className="text-muted">
                    Today: ${overview?.today_revenue?.toLocaleString()}
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <DollarSign size={28} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1 small">Registered Users</p>
                  <h3 className="fw-bold mb-0">
                    {overview?.total_users?.toLocaleString()}
                  </h3>
                  <small className="text-muted">
                    This week: +{overview?.week_users}
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <Users size={28} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 2. SALES CHART với Period Selector */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">📈 Sales Analytics</h5>
                <div className="d-flex gap-2">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        salesPeriod === "daily"
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => setSalesPeriod("daily")}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        salesPeriod === "weekly"
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => setSalesPeriod("weekly")}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        salesPeriod === "monthly"
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => setSalesPeriod("monthly")}
                    >
                      Monthly
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => exportSalesReport(salesPeriod)}
                    disabled={exporting}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    name="Bookings"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4ECDC4"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ✅ 3. USER REGISTRATIONS */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  👥 User Registrations (Last 30 days)
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={exportUserRegistrations}
                  disabled={exporting}
                >
                  <Download size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userRegistrations.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FFD93D" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 4. TOP MOVIES & REVENUE BY THEATER */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">🎬 Top 5 Movies</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={exportTopMovies}
                  disabled={exporting}
                >
                  <Download size={16} />
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Movie</th>
                      <th>Bookings</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMovies.map((movie, index) => (
                      <tr key={movie.movie_id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={movie.poster_path}
                              alt={movie.title}
                              style={{
                                width: "40px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {movie.title}
                            </span>
                          </div>
                        </td>
                        <td>{movie.total_bookings}</td>
                        <td className="text-success fw-bold">
                          ${movie.total_revenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">🏢 Revenue by Theater</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={exportRevenueByTheater}
                  disabled={exporting}
                >
                  <Download size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByTheater} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="theater_name" width={150} />
                  <Tooltip />
                  <Bar
                    dataKey="total_revenue"
                    fill="#4ECDC4"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 5. ACTIVE BOOKINGS */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  ⏳ Active Bookings ({activeBookings.length})
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={exportActiveBookings}
                  disabled={exporting}
                >
                  <Download size={16} />
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User</th>
                      <th>Movie</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBookings.slice(0, 10).map((booking) => (
                      <tr key={booking.booking_id}>
                        <td>#{booking.booking_id}</td>
                        <td>{booking.user_name}</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                        >
                          {booking.movie_title}
                        </td>
                        <td>${booking.grand_total?.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              booking.status === "pending"
                                ? "bg-warning"
                                : "bg-info"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>{new Date(booking.created_at).toLocaleString()}</td>
                        <td className="text-danger">
                          {booking.expires_at
                            ? new Date(booking.expires_at).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
