import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, LayoutDashboard, ClipboardList, User, LogOut,
  AlertCircle, MessageCircle, CheckCircle, XCircle, Menu, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, getUser, logout } from "../../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [tab, setTab] = useState("Upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile] = useState(getUser());
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  const fetchAppointments = async () => {
    setLoading(true); setError("");
    try {
      const data = await api.getMyAppointments();
      if (data.success) setAppointments(data.data);
      else setError(data.message || "Failed to load appointments");
    } catch {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      const data = await api.cancelAppointment(id);
      if (data.success) fetchAppointments();
      else alert(data.message);
    } catch { alert("Failed to cancel"); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleNavClick = (name) => {
    setActivePage(name);
    setSidebarOpen(false); // close sidebar on mobile after click
  };

  const filteredMap = {
    Upcoming: ["pending", "approved"],
    Completed: ["completed"],
    Cancelled: ["cancelled", "rejected"],
  };
  const filtered = appointments.filter(a => filteredMap[tab]?.includes(a.status));

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-[#ede9f7] text-[#7C6A9B]",
      completed: "bg-blue-100 text-blue-600",
      rejected: "bg-red-100 text-red-600",
      cancelled: "bg-red-100 text-red-600",
    };
    const labels = {
      pending: "Pending", approved: "Approved",
      completed: "Completed", rejected: "Rejected", cancelled: "Cancelled",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || ""}`}>
        {labels[status] || status}
      </span>
    );
  };

  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Appointments", icon: <ClipboardList size={18} /> },
    { name: "Profile", icon: <User size={18} /> },
  ];

  const SidebarContent = () => (
    <>
      <h2 className="text-2xl font-semibold text-[#7C6A9B] mb-10">Saarthi</h2>
      <div className="flex flex-col gap-2 flex-1">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.name)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activePage === item.name
                ? "bg-[#7C6A9B] text-white shadow"
                : "text-gray-600 hover:bg-[#f3effa]"
            }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
        <button
          onClick={() => { navigate("/chatbot"); setSidebarOpen(false); }}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition text-gray-600 hover:bg-[#f3effa] mt-2"
        >
          <MessageCircle size={18} /> Ask Saarthi AI
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 mt-4"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#fafafa]">

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="w-64 bg-white border-r p-6 hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            {/* drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 flex flex-col shadow-xl md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-[#f3effa]"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#5c4b7a]">
                {activePage === "Profile" ? "My Profile" : activePage === "Dashboard" ? "Dashboard" : "My Appointments"}
              </h1>
              {profile && (
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  Welcome back, {profile.name} 👋
                </p>
              )}
            </div>
          </div>

          {activePage === "Appointments" && (
            <button
              onClick={() => navigate("/booking")}
              className="px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium bg-[#7C6A9B] text-white hover:scale-105 transition whitespace-nowrap"
            >
              + Book
            </button>
          )}
        </div>

        {/* DASHBOARD */}
        {activePage === "Dashboard" && (
          <DashboardPage appointments={appointments} loading={loading} navigate={navigate} />
        )}

        {/* PROFILE */}
        {activePage === "Profile" && <ProfilePage profile={profile} />}

        {/* APPOINTMENTS */}
        {activePage === "Appointments" && (
          <>
            {/* Tabs — scrollable on mobile */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
              {["Upcoming", "Completed", "Cancelled"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap shrink-0 ${
                    tab === t ? "bg-[#7C6A9B] text-white" : "bg-white border text-gray-600 hover:bg-[#f3effa]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {loading ? (
              <div className="text-center mt-20 text-gray-400">Loading appointments...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((appt, index) => (
                  <motion.div
                    key={appt._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <h2 className="text-base sm:text-lg font-semibold text-[#5c4b7a]">
                      {appt.doctorId?.name || "Doctor"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">{appt.doctorId?.specialization || ""}</p>
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} /> {new Date(appt.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock size={16} />
                      {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {statusBadge(appt.status)}

                    {appt.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleCancel(appt._id)}
                          className="flex-1 py-2 rounded-xl text-sm font-medium border text-red-500 hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => navigate("/booking", { state: { doctor: appt.doctorId } })}
                          className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#7C6A9B] text-white hover:scale-105 transition"
                        >
                          Reschedule
                        </button>
                      </div>
                    )}

                    {appt.prescription && (
                      <div className="mt-3 p-3 bg-[#f5f3fb] rounded-xl text-sm text-gray-600">
                        <p className="font-medium text-[#5c4b7a] mb-1">Prescription</p>
                        <p>{appt.prescription}</p>
                        {appt.notes && <p className="mt-1 text-gray-400 italic">{appt.notes}</p>}
                      </div>
                    )}
                  </motion.div>
                ))}

                {filtered.length === 0 && (
                  <div className="col-span-full text-center mt-10">
                    <p className="text-gray-400 mb-4">No {tab.toLowerCase()} appointments</p>
                    <button
                      onClick={() => navigate("/booking")}
                      className="px-5 py-2 rounded-xl bg-[#7C6A9B] text-white text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* FLOATING CHATBOT BUTTON */}
      <motion.button
        onClick={() => navigate("/chatbot")}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#7C6A9B] text-white px-4 py-3 rounded-full shadow-lg text-sm font-medium"
      >
        <MessageCircle size={18} />
        <span className="hidden sm:inline">Ask Saarthi AI</span>
      </motion.button>
    </div>
  );
}

// ── DASHBOARD PAGE ──
function DashboardPage({ appointments, loading, navigate }) {
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter(
    (a) => a.status === "rejected" || a.status === "cancelled"
  ).length;

  const stats = [
    { label: "Total",     value: total,     icon: ClipboardList, color: "text-gray-600"   },
    { label: "Pending",   value: pending,   icon: Clock,         color: "text-yellow-600" },
    { label: "Approved",  value: approved,  icon: Calendar,      color: "text-purple-600" },
    { label: "Completed", value: completed, icon: CheckCircle,   color: "text-green-600"  },
    { label: "Cancelled", value: cancelled, icon: XCircle,       color: "text-red-600"    },
  ];

  const recentAppointments = appointments
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;

  return (
    <>
      {/* STATS — 2 cols mobile, 3 cols tablet, 5 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="bg-white p-4 rounded-2xl border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <s.icon className={s.color} size={20} />
              <span className="text-xl font-semibold">{s.value}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* QUICK ACTIONS — stack on mobile, side by side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/booking")}
          className="bg-[#7C6A9B] text-white p-4 rounded-2xl hover:scale-105 transition text-sm font-medium"
        >
          + Book Appointment
        </button>
        <button
          onClick={() => navigate("/chatbot")}
          className="bg-white border p-4 rounded-2xl hover:bg-[#f3effa] transition text-sm font-medium text-gray-700"
        >
          Ask Saarthi AI
        </button>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#5c4b7a]">
          Recent Appointments
        </h2>
        {recentAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No appointments yet</p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">{a.doctorId?.name || "Doctor"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 shrink-0">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── PROFILE PAGE ──
function ProfilePage({ profile }) {
  if (!profile) return <p className="text-gray-400">No profile data</p>;
  return (
    <div className="max-w-md w-full bg-white rounded-2xl border p-5 sm:p-6 shadow-sm">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ede9f7] flex items-center justify-center text-2xl mb-4">
        {profile.name?.[0]?.toUpperCase() || "P"}
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-[#5c4b7a]">{profile.name}</h2>
      <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
      {profile.age    && <p className="text-sm text-gray-500 mt-1">Age: {profile.age}</p>}
      {profile.gender && <p className="text-sm text-gray-500 mt-1 capitalize">Gender: {profile.gender}</p>}
    </div>
  );
}