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
      <h2 className="mb-4">📊 Dashboard Overview</h2>

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
              <h5 className="card-title">
                👥 User Registrations (Last 30 days)
              </h5>
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
              <h5 className="card-title">🎬 Top 5 Movies</h5>
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
              <h5 className="card-title">🏢 Revenue by Theater</h5>
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
              <h5 className="card-title">
                ⏳ Active Bookings ({activeBookings.length})
              </h5>
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
