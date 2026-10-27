# 📖 Recipe Book Application

A full-stack Recipe Book web application built with React, Vite, Node.js, Express, and MongoDB.

---

## 🚀 Features

- Browse and search delicious recipes
- Add, update, and manage your favorite recipes
- Responsive user interface built with React & modern CSS
- RESTful API backend connected with MongoDB Atlas

---

## 📁 Project Structure

```text
recipe-book/
├── backend/            # Express & Mongoose API server
│   ├── server.js       # Main server file
│   ├── Recipe.js       # Recipe schema / model
│   ├── .env.example    # Sample environment configuration
│   └── package.json
└── frontend-app/       # React (Vite) frontend application
    ├── src/            # Components, styles, and logic
    ├── index.html
    └── package.json
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 1. Setup Backend

```bash
cd backend
npm install
```

Copy the `.env.example` file to `.env` and fill in your MongoDB connection details:

```bash
# In backend/
cp .env.example .env
```

Start the backend server:

```bash
npm run dev
# Server will run on port specified in .env (default: 5000)
```

### 2. Setup Frontend

In a separate terminal:

```bash
cd frontend-app
npm install
npm run dev
```

Open your browser at the Vite URL shown (usually `http://localhost:5173`).
