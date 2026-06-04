import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle } from "lucide-react";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-lg border p-5 sm:p-6 md:p-8"
      >
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-green-100 p-4 rounded-full mb-3"
          >
            <CheckCircle className="text-green-600" size={42} />
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#5c4b7a]">
            Appointment Confirmed
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Your booking has been successfully scheduled.
          </p>
        </div>

        {/* Appointment Details */}
        <div className="mb-5 p-4 rounded-xl border bg-[#f5f3fb]">
          <h3 className="font-medium text-[#5c4b7a] mb-3">
            Appointment Details
          </h3>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              {state.date || "N/A"}
            </p>

            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              {state.time || "N/A"}
            </p>
          </div>
        </div>

        {/* Doctor Details */}
        {state.doctor && (
          <div className="mb-6 p-4 rounded-xl border bg-[#f5f3fb]">
            <h3 className="font-medium text-[#5c4b7a] mb-3">
              Doctor Details
            </h3>

            <div className="space-y-1">
              <p className="font-semibold text-[#5c4b7a]">
                {state.doctor.name}
              </p>

              <p className="text-sm text-gray-500">
                {state.doctor.specialization}
              </p>

              {state.doctor.experience && (
                <p className="text-xs text-gray-400">
                  {state.doctor.experience} years experience
                </p>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/UserDashboard")}
            className="w-full sm:flex-1 py-3 rounded-xl text-sm font-medium border border-[#e5e0f0] text-[#7C6A9B] hover:bg-[#f7f4fc] transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/booking")}
            className="w-full sm:flex-1 py-3 rounded-xl text-sm font-medium bg-[#7C6A9B] text-white hover:opacity-90 transition"
          >
            Book Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}