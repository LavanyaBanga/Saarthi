const BASE =
  import.meta.env.VITE_API_URL || "https://saarthi-3-4xfs.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const jsonHeaders = {
  "Content-Type": "application/json",
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res) => {
  let data = {};

  try {
    data = await res.json();
  } catch {
    data = { success: false, message: "Invalid server response" };
  }

  if (!res.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  // AUTH
  patientSignup: (data) =>
    fetch(`${BASE}/auth/patient/signup`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }).then(handleResponse),

  patientLogin: (data) =>
    fetch(`${BASE}/auth/patient/login`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }).then(handleResponse),

  doctorSignup: (data) =>
    fetch(`${BASE}/auth/doctor/signup`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }).then(handleResponse),

  doctorLogin: (data) =>
    fetch(`${BASE}/auth/doctor/login`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }).then(handleResponse),

  // DOCTORS
  getDoctors: () => fetch(`${BASE}/doctors`).then(handleResponse),

  getDoctorProfile: () =>
    fetch(`${BASE}/doctors/profile`, {
      headers: authHeaders(),
    }).then(handleResponse),

  getDoctorAppointments: (status) =>
    fetch(`${BASE}/doctors/appointments${status ? `?status=${status}` : ""}`, {
      headers: authHeaders(),
    }).then(handleResponse),

  updateAppointmentStatus: (id, status) =>
    fetch(`${BASE}/doctors/appointment/${id}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  addPrescription: (id, data) =>
    fetch(`${BASE}/doctors/appointment/${id}/prescription`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // PATIENT
  getMyProfile: () =>
    fetch(`${BASE}/patients/profile`, {
      headers: authHeaders(),
    }).then(handleResponse),

  updateMyProfile: (data) =>
    fetch(`${BASE}/patients/profile/update`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMyAppointments: (status) =>
    fetch(`${BASE}/patients/appointments${status ? `?status=${status}` : ""}`, {
      headers: authHeaders(),
    }).then(handleResponse),

  bookAppointment: (data) =>
    fetch(`${BASE}/patients/appointment`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  cancelAppointment: (id) =>
    fetch(`${BASE}/patients/appointment/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleResponse),
};

// HELPERS
export const saveAuth = (token, user, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", role);
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getRole = () => localStorage.getItem("role");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

export const isLoggedIn = () => Boolean(getToken());
