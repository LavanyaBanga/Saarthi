# 🌿 Saarthi

**Saarthi** is a digital healthcare and wellness platform designed to connect users with doctors, provide emotional well-being support, simplify appointment booking, and offer personalised health-related assistance through an interactive dashboard.

The platform brings healthcare services, mood tracking, wellness resources, AI-powered assistance, and doctor consultation features together in one place.

🌐 **Live Application:** https://saarthi-5.onrender.com

---

## 📌 Overview

Accessing healthcare support often involves managing appointments, finding suitable doctors, tracking personal well-being, and searching for reliable health information across different platforms.

Saarthi solves this problem by providing a unified and user-friendly platform where users can:

* Find and book doctors.
* Track their daily mood and emotional wellness.
* Interact with an AI-powered health assistant.
* Read health and wellness blogs.
* Manage appointments from a personalised dashboard.
* Explore wellness products.
* Access separate dashboards based on their role.

---

## ✨ Features

### 👤 Role-Based User Experience

Saarthi provides separate onboarding and dashboard experiences for different users:

* Patient
* Doctor
* Organiser

Each role receives access to relevant features and personalised functionality.

---

### 🩺 Doctor Discovery

* Browse available doctors.
* View doctor profiles and specialisations.
* Check consultation details.
* Select an appropriate doctor according to healthcare needs.
* Book appointments through the platform.

---

### 📅 Appointment Booking

* Select a doctor.
* Choose an available date and time.
* Submit appointment details.
* View booking confirmation.
* Track appointment status from the dashboard.

Appointment statuses may include:

* Pending
* Accepted
* Rejected
* Completed

---

### 👨‍⚕️ Doctor Dashboard

Doctors can manage patient appointments using a dedicated dashboard.

Key functionalities include:

* View upcoming appointments.
* Access patient information.
* Accept or reject appointment requests.
* Update appointment status.
* Add prescriptions or consultation notes.
* Organise appointments using status-based tabs.

---

### 🧑‍💻 Patient Dashboard

The patient dashboard provides a central place to manage healthcare activities.

Users can:

* View upcoming appointments.
* Track previous consultations.
* Manage profile information.
* Access health and wellness resources.
* Monitor mood history.
* Interact with the AI assistant.

---

### 😊 Mood Tracker

The mood tracker helps users record and understand their emotional well-being.

Users can:

* Select their current mood.
* Add notes about their feelings.
* Maintain daily mood records.
* Observe emotional patterns over time.
* Reflect on their overall mental wellness.

---

### 🤖 AI Health Assistant

Saarthi includes an interactive chatbot that provides general health and wellness assistance.

The chatbot can help users:

* Ask general wellness-related questions.
* Receive self-care suggestions.
* Explore mental well-being guidance.
* Get basic information before consulting a professional.
* Continue previous chatbot conversations.

> The AI assistant is intended for general guidance and does not replace professional medical diagnosis or treatment.

---

### 📝 Health and Wellness Blogs

* Read informative health articles.
* Explore content related to mental wellness.
* Learn about self-care and healthy habits.
* Access lifestyle and healthcare awareness resources.

---

### 🛍️ Wellness Product Store

Saarthi includes a wellness product section where users can explore items such as:

* Herbal tea
* Yoga mats
* Essential oil diffusers
* Wellness kits
* Self-care products
* Fitness and relaxation accessories

Users can browse products and manage their shopping selections through an interactive interface.

---

### 🔐 Authentication

* User registration and login.
* Role-based onboarding.
* Protected dashboard routes.
* Personalised account experience.
* Secure user session management.

---

### 📱 Responsive User Interface

* Responsive design for desktop, tablet, and mobile devices.
* Modern and accessible layout.
* Smooth navigation.
* Interactive animations.
* Clean healthcare-focused user experience.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion
* GSAP
* React Icons
* Lucide React

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Render

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman
* MongoDB Atlas

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ Axios API Requests
  ▼
Node.js and Express.js Backend
  │
  ├── Authentication Module
  ├── User Management
  ├── Doctor Management
  ├── Appointment Management
  ├── Chatbot Service
  ├── Mood Tracking
  └── Blog and Product Services
  │
  ▼
MongoDB Database
```

---

## 📂 Project Structure

```text
Saarthi/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── doctor/
│   │   │   └── organiser/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd Saarthi
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
AI_API_KEY=your_ai_api_key
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend application:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `PORT`           | Backend server port                    |
| `MONGO_URI`      | MongoDB Atlas connection string        |
| `JWT_SECRET`     | Secret key used for JWT authentication |
| `JWT_EXPIRES_IN` | JWT token expiration period            |
| `CLIENT_URL`     | Allowed frontend URL                   |
| `VITE_API_URL`   | Backend API base URL                   |
| `AI_API_KEY`     | API key used for chatbot functionality |
| `NODE_ENV`       | Current application environment        |

> Never commit `.env` files, passwords, database credentials, or API keys to GitHub.

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users

```http
GET /api/users/profile
PUT /api/users/profile
```

### Doctors

```http
GET /api/doctors
GET /api/doctors/:id
PUT /api/doctors/profile
```

### Appointments

```http
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### Chatbot

```http
GET  /api/chat/sessions
POST /api/chat/send
GET  /api/chat/sessions/:id
```

### Mood Tracker

```http
GET  /api/moods
POST /api/moods
PUT  /api/moods/:id
```

### Blogs

```http
GET /api/blogs
GET /api/blogs/:id
```

### Products

```http
GET /api/products
GET /api/products/:id
```

> Endpoint names may vary depending on the final backend route configuration.

---

## 🔐 Authentication Flow

1. The user selects a role during onboarding.
2. The user creates an account or logs in.
3. The backend validates the submitted credentials.
4. A JSON Web Token is generated.
5. The token is stored on the client side.
6. The token is attached to protected API requests.
7. Authentication middleware verifies the token.
8. The user is redirected to the appropriate dashboard.

---

## 📅 Appointment Booking Flow

1. The patient browses available doctors.
2. The patient selects a doctor.
3. The patient chooses a consultation date and time.
4. The booking request is submitted.
5. The appointment is stored in the database.
6. The doctor receives the appointment request.
7. The doctor accepts or rejects the request.
8. The updated status becomes visible on the patient dashboard.

---

## 🤖 Chatbot Flow

1. The user opens the chatbot.
2. Existing chat sessions are loaded.
3. The user submits a health or wellness-related message.
4. The frontend sends the message to the backend.
5. The backend processes the request through the AI service.
6. The generated response is returned to the user.
7. The conversation is stored for future reference.

---

## 🚀 Deployment

Saarthi is deployed using **Render**.

### Frontend Deployment

```text
Build Command: npm install && npm run build
Publish Directory: dist
```

Production frontend environment variable:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend Deployment

```text
Build Command: npm install
Start Command: npm start
```

Configure all required environment variables in the Render dashboard:

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=https://your-frontend-url.onrender.com
AI_API_KEY=your_ai_api_key
```

---

## 🛡️ Security Features

* Password hashing.
* JWT-based authentication.
* Protected routes.
* Role-based access control.
* Environment variable protection.
* CORS configuration.
* Input validation.
* Centralised error handling.
* Authorisation checks for appointments and user data.

---

## 📈 Future Enhancements

* Real-time doctor and patient chat.
* Video consultation integration.
* Online payment system.
* Appointment reminders through email or SMS.
* Digital prescription downloads.
* Medical record management.
* Emergency contact support.
* Advanced mood analytics.
* Personalised mental wellness plans.
* AI-based doctor recommendations.
* Health report upload and analysis.
* Multilingual chatbot support.
* Push notifications.
* Product ordering and payment integration.
* Admin analytics dashboard.
* Doctor availability calendar.
* Review and rating system.

---

## 💡 Key Learnings

Building Saarthi provided practical experience in:

* Developing a full-stack healthcare platform.
* Creating role-based dashboards.
* Implementing appointment booking workflows.
* Integrating an AI-powered chatbot.
* Building REST APIs using Node.js and Express.js.
* Managing MongoDB data with Mongoose.
* Implementing JWT authentication.
* Designing reusable React components.
* Handling frontend and backend integration.
* Creating responsive interfaces using Tailwind CSS.
* Debugging API route and deployment issues.
* Managing CORS and environment variables.
* Deploying a complete application on Render.

---

## ⚠️ Medical Disclaimer

Saarthi is developed for educational and portfolio purposes.

The chatbot and wellness content provided through this platform are intended only for general informational guidance. They should not be considered a substitute for professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional for medical concerns or emergencies.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

---

## 👩‍💻 Author

**Lavanya Banga**

B.Tech Computer Science Engineering Student
MERN Stack Developer

---

## 📄 License

This project is developed for educational, learning, and portfolio purposes.

---

## ⭐ Support

If you found Saarthi useful or interesting, consider giving the repository a star.

Feedback, suggestions, and contributions are always appreciated.
