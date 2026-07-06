import React, { useState } from "react";
import { User, Lock, Mail, Stethoscope, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, saveAuth } from "../services/api";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupGender, setSignupGender] = useState("female");
  const [signupSpec, setSignupSpec] = useState("");
  const [signupExp, setSignupExp] = useState("");

  const navigate = useNavigate();

  const resetError = () => setError("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fn = role === "doctor" ? api.doctorLogin : api.patientLogin;
      const data = await fn({ email: loginEmail, password: loginPassword });

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      const userObj = data.doctor || data.patient;
      saveAuth(data.token, userObj, role);
      navigate(role === "doctor" ? "/doctor" : "/UserDashboard");
    } catch {
      setError("Network error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      setError("Please fill all required fields");
      return;
    }

    if (role === "patient" && !signupAge) {
      setError("Age is required");
      return;
    }

    if (role === "doctor" && !signupSpec) {
      setError("Specialization is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload =
        role === "patient"
          ? {
              name: signupName,
              email: signupEmail,
              password: signupPassword,
              age: Number(signupAge),
              gender: signupGender,
            }
          : {
              name: signupName,
              email: signupEmail,
              password: signupPassword,
              specialization: signupSpec,
              experience: Number(signupExp) || 0,
            };

      const fn = role === "doctor" ? api.doctorSignup : api.patientSignup;
      const data = await fn(payload);

      if (!data.success) {
        setError(data.message || "Signup failed");
        return;
      }

      const userObj = data.doctor || data.patient;
      saveAuth(data.token, userObj, role);
      navigate(role === "doctor" ? "/doctor" : "/UserDashboard");
    } catch {
      setError("Network error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const RoleToggle = () => (
    <div className="grid grid-cols-2 gap-2 bg-[#f0ebfa] rounded-xl p-1">
      {["patient", "doctor"].map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => {
            setRole(r);
            resetError();
          }}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            role === r
              ? "bg-[#7C6A9B] text-white shadow"
              : "text-[#7C6A9B] hover:bg-white/60"
          }`}
        >
          {r === "doctor" ? "🩺 Doctor" : "🧑 Patient"}
        </button>
      ))}
    </div>
  );

  const ErrorBox = () =>
    error ? (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
        <AlertCircle size={16} />
        <span>{error}</span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#725B95] to-[#5E4A80] px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:block relative min-h-[680px]">
          <img
            src="https://blog.1password.com/posts/2019/mental-health-week/header.png"
            alt="health visual"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E6CCEC]/70 to-[#725B95]/70" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h1 className="text-4xl font-bold mb-3">Saarthi</h1>
            <p className="text-lg opacity-90">
              Your smart healthcare companion for appointments, doctors and care.
            </p>
          </div>
        </div>

        <div className="w-full px-5 py-8 sm:px-8 md:px-12 lg:px-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#5E4A80]">
                {isSignUp ? "Create Account" : "Sign In"}
              </h1>
              <p className="text-[#A89BB5] mt-2 text-sm sm:text-base">
                {isSignUp
                  ? "Join Saarthi and start your healthcare journey."
                  : "Welcome back, login to continue."}
              </p>
            </div>

            <div className="mb-5">
              <RoleToggle />
            </div>

            <div className="mb-4">
              <ErrorBox />
            </div>

            {!isSignUp ? (
              <div className="space-y-4">
                <div className="flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                  <Mail className="text-[#A89BB5] mr-3 shrink-0" size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                  <Lock className="text-[#A89BB5] mr-3 shrink-0" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#725B95] to-[#5E4A80] rounded-xl text-white font-semibold shadow-lg transition disabled:opacity-60 hover:opacity-95"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-[#A89BB5] text-sm">
                  New here?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      resetError();
                    }}
                    className="text-[#725B95] underline underline-offset-4"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                  <User className="text-[#A89BB5] mr-3 shrink-0" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                  <Mail className="text-[#A89BB5] mr-3 shrink-0" size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                  />
                </div>

                <div className="flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                  <Lock className="text-[#A89BB5] mr-3 shrink-0" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                  />
                </div>

                {role === "patient" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Age"
                      value={signupAge}
                      onChange={(e) => setSignupAge(e.target.value)}
                      className="bg-white border border-[#DCD0EB] rounded-xl px-4 py-3 text-sm text-[#5E4A80] outline-none placeholder-[#A89BB5]"
                    />

                    <select
                      value={signupGender}
                      onChange={(e) => setSignupGender(e.target.value)}
                      className="bg-white border border-[#DCD0EB] rounded-xl px-4 py-3 text-sm text-[#5E4A80] outline-none"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 flex items-center bg-white border border-[#DCD0EB] rounded-xl px-4 py-3">
                      <Stethoscope
                        className="text-[#A89BB5] mr-2 shrink-0"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Specialization"
                        value={signupSpec}
                        onChange={(e) => setSignupSpec(e.target.value)}
                        className="bg-transparent outline-none text-[#5E4A80] w-full placeholder-[#A89BB5] text-sm"
                      />
                    </div>

                    <input
                      type="number"
                      placeholder="Exp"
                      value={signupExp}
                      onChange={(e) => setSignupExp(e.target.value)}
                      className="bg-white border border-[#DCD0EB] rounded-xl px-4 py-3 text-sm text-[#5E4A80] outline-none placeholder-[#A89BB5]"
                    />
                  </div>
                )}

                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#725B95] to-[#A89BB5] rounded-xl text-white font-semibold shadow-lg transition disabled:opacity-60 hover:opacity-95"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="text-center text-[#A89BB5] text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      resetError();
                    }}
                    className="text-[#725B95] underline underline-offset-4"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
