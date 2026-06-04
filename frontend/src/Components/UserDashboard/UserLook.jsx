import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, getUser, logout } from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile] = useState(getUser());

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getMyAppointments();
      if (data.success) setAppointments(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // STATS
  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter(
    (a) => a.status === "rejected" || a.status === "cancelled"
  ).length;

  const stats = [
    { label: "Total", value: total, icon: ClipboardList, color: "text-gray-600" },
    { label: "Pending", value: pending, icon: Clock, color: "text-yellow-600" },
    { label: "Approved", value: approved, icon: Calendar, color: "text-purple-600" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-green-600" },
    { label: "Cancelled", value: cancelled, icon: XCircle, color: "text-red-600" },
  ];

  const recentAppointments = appointments
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-semibold text-[#7C6A9B] mb-10">
          Saarthi
        </h2>

        <div className="flex flex-col gap-2 flex-1">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#7C6A9B] text-white text-sm"
          >
            <ClipboardList size={18} /> Dashboard
          </button>

          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-[#f3effa]"
          >
            <Calendar size={18} /> Appointments
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-[#f3effa]"
          >
            <User size={18} /> Profile
          </button>

          <button
            onClick={() => navigate("/chatbot")}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-[#f3effa]"
          >
            <MessageCircle size={18} /> Ask AI
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#5c4b7a]">
            Dashboard
          </h1>
          {profile && (
            <p className="text-sm text-gray-400 mt-1">
              Welcome back, {profile.name} 👋
            </p>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-gray-400">Loading dashboard...</div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                  <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => navigate("/booking")}
                className="bg-[#7C6A9B] text-white p-4 rounded-2xl hover:scale-105 transition"
              >
                + Book Appointment
              </button>

             

              <button
                onClick={() => navigate("/chatbot")}
                className="bg-white border p-4 rounded-2xl hover:bg-[#f3effa]"
              >
                Ask Saarthi AI
              </button>
            </div>

            {/* RECENT APPOINTMENTS */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-[#5c4b7a]">
                Recent Appointments
              </h2>

              {recentAppointments.length === 0 ? (
                <p className="text-gray-400">No appointments yet</p>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((a) => (
                    <div
                      key={a._id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {a.doctorId?.name || "Doctor"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(a.date).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                        {a.status}
                      </span>
                    </div>
                    
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}