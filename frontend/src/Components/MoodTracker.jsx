import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Camera,
  Smile,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const SIDEBAR_EXPANDED_W = 256;
const SIDEBAR_COLLAPSED_W = 64;
const MIDDLE_FLEX = 2.6;
const RIGHT_FLEX = 1.0;
const CAMERA_CARD_H = 520;
const CAMERA_INNER_H = 380;
const EMOJI_GRID_COLS_SM = 6;

const colors = {
  bg: "#776982",
  card: "#C7B9D6",
  text: "#4B4155",
  highlight: "#9B6EB4",
  lightCard: "#F8F5FB",
  border: "#A597D4",
};

const initialHistory = [
  { day: "Mon", mood: 4.2, happy: 30, unsatisfied: 25 },
  { day: "Tue", mood: 3.8, happy: 35, unsatisfied: 30 },
  { day: "Wed", mood: 3.2, happy: 45, unsatisfied: 40 },
  { day: "Thu", mood: 4.5, happy: 25, unsatisfied: 20 },
  { day: "Fri", mood: 4.0, happy: 30, unsatisfied: 28 },
  { day: "Sat", mood: 4.6, happy: 22, unsatisfied: 18 },
  { day: "Sun", mood: 3.9, happy: 34, unsatisfied: 29 },
];

const emojis = [
  { mood: "Happy", emoji: "😊", values: { happy: 18, unsatisfied: 4.8, moodScore: 4.8 } },
  { mood: "Sad", emoji: "😔", values: { happy: 48, unsatisfied: 2.0, moodScore: 2.5 } },
  { mood: "Angry", emoji: "😡", values: { happy: 55, unsatisfied: 2.6, moodScore: 2.2 } },
  { mood: "Unsatisfied", emoji: "😟", values: { happy: 72, unsatisfied: 1.9, moodScore: 2.8 } },
  { mood: "Calm", emoji: "😌", values: { happy: 12, unsatisfied: 5.0, moodScore: 4.5 } },
  { mood: "Neutral", emoji: "😐", values: { happy: 32, unsatisfied: 3.5, moodScore: 3.5 } },
];

const menu = [
  { id: "mood", label: "Mood Tracker", icon: <Camera size={18} /> },
  { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
];

export default function MoodTracker() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState("mood");
  const [history, setHistory] = useState(initialHistory);
  const [selectedMood, setSelectedMood] = useState(null);

  const [anxiety, setAnxiety] = useState(35);
  const [depression, setDepression] = useState(30);
  const [moodScore, setMoodScore] = useState(3.9);

  const sidebarRef = useRef(null);

  function handleSelectEmoji(emo) {
    setSelectedMood(emo.mood);

    // ✅ FIXED STATE UPDATE
    setAnxiety(emo.values.happy);
    setDepression(emo.values.unsatisfied);
    setMoodScore(emo.values.moodScore);

    setHistory((prev) => {
      const copy = [...prev];
      const lastIndex = copy.length - 1;
      copy[lastIndex] = {
        ...copy[lastIndex],
        mood: emo.values.moodScore,
        happy: emo.values.happy,
        unsatisfied: emo.values.unsatisfied,
      };
      return copy;
    });
  }

  function handleReset() {
    setSelectedMood(null);
    setAnxiety(35);
    setDepression(30);
    setMoodScore(3.9);
    setHistory(initialHistory);
  }

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  return (
    <div
      className="flex h-screen text-black"
      style={{ backgroundColor: "#ffffff" }} // ✅ WHITE BG FIX
    >
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        className="hidden md:flex flex-col border-r"
        style={{ backgroundColor: colors.card }}
      >
        <div className="flex justify-between p-3">
          <span>MoodTracker</span>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="p-3 space-y-2">
          {menu.map((m) => (
            <button
              key={m.id}
              onClick={() => setPage(m.id)}
              className="flex gap-2 w-full p-2 rounded hover:bg-white/30"
            >
              {m.icon} {m.label}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between p-4 border-b">
          <h2>{page === "mood" ? "Mood Tracker" : "Reports"}</h2>

          <div className="flex gap-2">
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </header>

        <main className="p-6">
          {page === "mood" && (
            <div className="flex gap-6">
              {/* Emoji Section */}
              <div className="grid grid-cols-3 gap-4">
                {emojis.map((e) => (
                  <button
                    key={e.mood}
                    onClick={() => handleSelectEmoji(e)}
                    className="p-3 rounded bg-gray-100 hover:scale-105"
                  >
                    <div className="text-2xl">{e.emoji}</div>
                    <div>{e.mood}</div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent>
                    Happy: {anxiety}%
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    Unsatisfied: {depression}%
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {page === "reports" && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </main>
      </div>
    </div>
  );
}