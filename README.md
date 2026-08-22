# Chef Srinivas's Kitchen 🍽️

A modern, full-stack chef booking and catering management application built with React, Express, and Supabase.

---

## 🚀 Features

### Frontend Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional interface with interactive menus and booking flows
- **Interactive Booking & Contact** - Dynamic booking modal and contact forms with validation
- **Smooth Navigation** - Single-page experience with smooth section scrolling

### Backend & Database Features
- **RESTful API** - Modular Express.js backend for bookings, contacts, and authentication
- **Supabase (PostgreSQL)** - Cloud-hosted, high-performance database with connection pooling
- **Admin Dashboard** - Secure admin panel for managing bookings and messages
- **Authentication & Security** - Session-based authentication with bcrypt password hashing

### Admin Panel Features
- 📋 **Order Management** - View, confirm, and manage catering booking requests
- 📧 **Message Center** - View, search, and manage customer inquiries
- 🔍 **Search & Filter** - Instantly find messages and orders
- 🔒 **Security** - Protected routes and password reset capability

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **CSS3** (Custom responsive styling)
- **JavaScript (ES6+)**

### Backend
- **Node.js** & **Express.js**
- **Supabase** (`@supabase/supabase-js` / PostgreSQL `pg`)
- **bcryptjs** (Password hashing)
- **express-session** (Session authentication)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/praveen7386626080/chef-booking-app.git
cd chef-booking-app
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd chef-backend
npm install
cd ..
```

### 3. Configure Supabase Environment Variables
Create or edit `chef-backend/.env`:
```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key
ADMIN_USER=admin
ADMIN_PASSWORD=Praveen@123

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
cd chef-backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 📁 Project Structure

```text
chef-booking-app/
├── chef-backend/                 # Backend server
│   ├── server.js                # Express API server & static SPA serving
│   ├── database.js              # Supabase database connection module
│   ├── routes/                  # Express routes (orders.js, etc.)
│   ├── supabase_schema.sql      # Supabase PostgreSQL schema & tables
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
├── src/                         # React frontend
│   ├── Components/              # React components
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Hero.jsx             # Hero section
│   │   ├── Menu.jsx             # Services & dish menu
│   │   ├── BookingModal.jsx     # Booking modal
│   │   ├── About.jsx            # About section
│   │   ├── Contact.jsx          # Contact form
│   │   ├── Admin.jsx            # Admin dashboard
│   │   └── Footer.jsx           # Footer
│   ├── App.jsx                  # Main App component
│   └── main.jsx                 # Entry point
├── render.yaml                  # Render deployment configuration
└── package.json                 # Frontend dependencies
```
