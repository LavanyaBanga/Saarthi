const API_URL = import.meta.env.VITE_API_URL;

export const patientSignup = async (data) => {
  const res = await fetch(`${API_URL}/auth/patient/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const patientLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/patient/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const doctorSignup = async (data) => {
  const res = await fetch(`${API_URL}/auth/doctor/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const doctorLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/doctor/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};