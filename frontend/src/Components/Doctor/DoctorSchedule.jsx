import React, { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorSchedule() {
  const [selected, setSelected] = useState([]);
  const [slots, setSlots] = useState({});

  const toggle = (day) => {
    setSelected((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const addSlot = (day) => {
    const time = prompt("Enter slot (10AM-12PM)");
    if (!time) return;

    setSlots((prev) => ({
      ...prev,
      [day]: prev[day] ? [...prev[day], time] : [time],
    }));
  };

  return (
    <div>

     
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {days.map((d) => (
        <button
  key={d}
  onClick={() => toggle(d)}
  className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base transition ${
              selected.includes(d)
                ? "bg-[#7C6A9B] text-white"
                : "bg-gray-100"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

    
      {selected.map((day) => (
      <div
  key={day}
  className="mb-4 bg-white p-4 sm:p-5 rounded-xl border shadow-sm"
>
       <h3 className="font-semibold text-[#5c4b7a] mb-2">
  {day}
</h3>

          {(slots[day] || []).map((s, i) => (
           <p
  key={i}
  className="text-sm text-gray-600 bg-[#f5f3fb] px-3 py-2 rounded-lg mb-2"
>
  {s}
</p>
          ))}

        <button
  onClick={() => addSlot(day)}
  className="mt-2 px-4 py-2 bg-[#7C6A9B] text-white rounded-xl text-sm hover:bg-[#5c4b7a] transition"
></button>
        </div>
      ))}
    </div>
  );
}