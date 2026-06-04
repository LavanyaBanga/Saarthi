import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const dummyAppointments = [
  {
    id: 1,
    patientName: "Muskan Sharma",
    problem: "Headache & Dizziness",
    time: "10:00 AM, 01 Apr 2026",
    status: "pending",
  },
  {
    id: 2,
    patientName: "Sparsh Gupta",
    problem: "Back Pain",
    time: "11:30 AM, 01 Apr 2026",
    status: "accepted",
  },
  {
    id: 3,
    patientName: "Lavanya Banga",
    problem: "Fever & Cold",
    time: "02:00 PM, 01 Apr 2026",
    status: "pending",
  },
];

const sidebarItems = [
  { name: "All", value: "all" },
  { name: "Pending", value: "pending" },
  { name: "Accepted", value: "accepted" },
  { name: "Rejected", value: "rejected" },
];

const DoctorsAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [appointments, setAppointments] = useState(dummyAppointments);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const filteredAppointments = appointments
    .filter((app) =>
      activeTab === "all" ? true : app.status === activeTab
    )
    .filter(
      (app) =>
        app.patientName.toLowerCase().includes(search.toLowerCase()) ||
        app.problem.toLowerCase().includes(search.toLowerCase())
    );

 return (
  <div className="min-h-screen bg-[#f9f7fd] flex flex-col md:flex-row">

    {/* Desktop Sidebar */}
    <div className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
      <h1 className="text-2xl font-semibold text-[#7C6A9B] mb-8">
        Saarthi
      </h1>

      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveTab(item.value)}
            className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === item.value
                ? "bg-[#7C6A9B] text-white shadow"
                : "text-gray-600 hover:bg-[#f3effa]"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="text-left px-4 py-2 rounded-xl text-sm hover:bg-[#f3effa]"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/doctor-schedule")}
          className="text-left px-4 py-2 rounded-xl text-sm hover:bg-[#f3effa]"
        >
          Schedule
        </button>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h2 className="text-xl sm:text-2xl font-semibold text-[#5c4b7a]">
          Appointments
        </h2>

        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl shadow-sm w-full md:w-80">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
        {sidebarItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveTab(item.value)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
              activeTab === item.value
                ? "bg-[#7C6A9B] text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex gap-3 mb-6">
        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="flex-1 bg-white border rounded-xl py-2 text-sm"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/doctor-schedule")}
          className="flex-1 bg-white border rounded-xl py-2 text-sm"
        >
          Schedule
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Showing {filteredAppointments.length} appointments
      </p>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredAppointments.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-[#5c4b7a]">
              {app.patientName}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {app.problem}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {app.time}
            </p>

            <div className="mt-4">
              {app.status === "pending" ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(app.id, "accepted")
                    }
                    className="flex-1 py-2 rounded-xl text-sm bg-[#7C6A9B] text-white"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(app.id, "rejected")
                    }
                    className="flex-1 py-2 rounded-xl text-sm border text-[#7C6A9B]"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status.toUpperCase()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

     
         
               

};

export default DoctorsAppointments;