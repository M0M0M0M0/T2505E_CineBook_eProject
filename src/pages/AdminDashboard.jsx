import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart as RelineChart, Line, PieChart, Pie, Cell } from "recharts";
import { User, Film, DollarSign, LayoutDashboard, Users, Settings, LineChart as LineChartIcon } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const salesData = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 500 },
    { name: "Thu", value: 700 },
    { name: "Fri", value: 600 },
    { name: "Sat", value: 800 },
    { name: "Sun", value: 550 },
  ];

  const revenueData = [
    { name: "Feb", revenue: 12000 },
    { name: "Mar", revenue: 17000 },
    { name: "Apr", revenue: 15000 },
    { name: "May", revenue: 20000 },
    { name: "Jun", revenue: 22000 },
  ];

  const topMovies = [
    { name: "Iron Man", value: 400 },
    { name: "Avatar", value: 300 },
    { name: "Black Widow", value: 300 },
  ];

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D"];

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, active: true },
    { name: "Movies", icon: <Film size={18} /> },
    { name: "Customers", icon: <Users size={18} /> },
    { name: "Analytics", icon: <LineChartIcon size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <h2 className="fw-bold text-danger mb-4">🎟️ FlickTickets</h2>
        <nav className="d-flex flex-column gap-2">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className={`d-flex align-items-center gap-2 p-2 rounded cursor-pointer ${
                item.active ? "bg-danger text-white" : "text-secondary hover-bg-light"
              }`}
              style={{ cursor: "pointer" }}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 overflow-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold fs-3 text-dark">🎬 Dashboard</h1>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary btn-sm">ENGLISH</button>
            <img
              src="https://via.placeholder.com/40"
              alt="avatar"
              className="rounded-circle"
              width="40"
              height="40"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-danger d-flex align-items-center gap-2">
                  <Film /> Total Bookings
                </h5>
                <h3 className="fw-semibold mt-2">2,345</h3>
                <p className="text-success small">+4.5% from last week</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-primary d-flex align-items-center gap-2">
                  <User /> User Registrations
                </h5>
                <h3 className="fw-semibold mt-2">1,230</h3>
                <p className="text-success small">+3.2% from last week</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="text-pink d-flex align-items-center gap-2">
                  <DollarSign /> Today's Bookings
                </h5>
                <h3 className="fw-semibold mt-2">234</h3>
                <p className="text-success small">+1.5% today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Sales Details</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <RelineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#FF6B6B" strokeWidth={3} />
                  </RelineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Total Revenue</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Top & Upcoming Movies */}
        <div className="row g-4 mt-4">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Top Selling Movies</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={topMovies} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {topMovies.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">Upcoming Movies</h5>
                <ul className="list-unstyled mt-3">
                  <li className="d-flex align-items-center gap-3 mb-3">
                    <img src="https://via.placeholder.com/60" alt="movie" className="rounded" />
                    <div>
                      <p className="fw-semibold mb-0">The Real Ghost</p>
                      <p className="text-muted small mb-0">Release: Oct 30</p>
                    </div>
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <img src="https://via.placeholder.com/60" alt="movie" className="rounded" />
                    <div>
                      <p className="fw-semibold mb-0">Black Widow</p>
                      <p className="text-muted small mb-0">Release: Nov 15</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
