# 🎙️ InterviewIQ — AI-Powered Mock Interview Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=flat-square&logo=redis)](https://upstash.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

**InterviewIQ** is an interactive, full-stack AI mock interview application designed to help job seekers prepare for real-world job interviews. Featuring real-time voice interactions, interactive AI avatars, resume parsing, and LLM-powered feedback reports, InterviewIQ simulates realistic technical, HR, and behavioral interview environments.

---

## ✨ Features

* **📄 Resume Parsing & Contextual Questions**: Upload your resume (PDF) to automatically generate interview questions tailored to your skills and experience.
* **🗣️ Interactive Voice & AI Avatars**: Practice with animated male/female AI avatars using built-in Text-to-Speech (TTS) and real-time Speech-to-Text (STT) voice recognition.
* **⏱️ Realistic Interview Simulation**: Per-question timers, live audio feedback, and customizable interview settings (Technical, HR, Behavioral).
* **📊 Comprehensive AI Performance Reports**: Detailed evaluations featuring overall scores, metric breakdowns (Technical, Communication, Confidence, Problem Solving), and ideal sample answers.
* **🔒 Secure Authentication**: JWT Access & Refresh token rotation with secure HTTP-only cookies and Redis token blacklisting.
* **📜 Interview History & Dashboard**: Review past interviews, track score improvements, and download performance reports.

---

## 🛠️ Tech Stack

### **Frontend (`/client`)**
* **Framework**: React 18 (Vite)
* **State Management**: Redux Toolkit & React Context API
* **Styling & Animation**: Tailwind CSS, Framer Motion (`motion/react`), React Icons
* **Audio & Speech**: Web Speech API (`SpeechRecognition` & `speechSynthesis`)
* **HTTP Client**: Axios (with automatic token-refresh interceptors)

### **Backend (`/server`)**
* **Runtime**: Node.js (ES Modules) + Express.js
* **AI Service**: OpenRouter API / LLM Integrations
* **File Uploads & PDF Parsing**: Multer + `pdf-parse` / `pdfjs-dist`
* **Database**: MongoDB Atlas (Mongoose ORM)
* **Cache / Session**: Redis (Upstash / Redis Cloud)

---

## 📁 Repository Structure

```text
InterviewIQ/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── api/                 # Axios configuration & interceptors
│   │   ├── assets/              # Avatar videos, audio & static assets
│   │   ├── components/          # 3-step setup, live interview & report views
│   │   ├── pages/               # Auth, Home, History & Report pages
│   │   └── redux/               # Redux slices for global state
│   └── package.json
│
└── server/                      # Backend API Service (Express.js)
    ├── src/
    │   ├── config/              # Database & Redis configuration
    │   ├── controller/          # Auth, Interview & User controllers
    │   ├── middleware/          # Authentication & Error handling
    │   ├── models/              # MongoDB Schemas (User, Interview)
    │   ├── routes/              # Express API Routes
    │   └── services/            # OpenRouter AI LLM integration
    ├── index.js                 # Server entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **MongoDB**: A running MongoDB instance or MongoDB Atlas URL
* **Redis**: A running Redis instance or Upstash Cloud Redis connection string

---

### Environment Setup

#### 1. Server Environment (`server/.env`)
Create a `.env` file in the `server` directory:

```env
PORT_NO=6000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/interviewiq
REDIS_URL=rediss://default:<password>@<your-redis-host>:6379
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

#### 2. Client Environment (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_FIRE_BASE_URL=""
```

---

### Installation & Local Run

#### 1. Install Backend Dependencies & Start Server
```bash
cd server
npm install
npm run dev
```

#### 2. Install Frontend Dependencies & Start Client
```bash
cd client
npm install
npm run dev
```

## 📄 License

This project is licensed under the [ISC License](LICENSE).
