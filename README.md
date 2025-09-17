# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Chef Srinivas's Kitchen 

## 🚀 Features

### Frontend Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Interactive Components** - Dynamic contact form with validation
- **Smooth Navigation** - One-page design with scroll-to-section functionality

### Backend Features
- **RESTful API** - Clean API endpoints for all operations
- **Database Integration** - SQLite database for persistent data storage
- **Admin Dashboard** - Complete message management system
- **Error Handling** - Comprehensive error handling and validation

### Admin Panel Features
- 📋 **View All Messages** - See all customer inquiries in a organized table
- 🔍 **Search Functionality** - Search messages by name, email, or content
- 📊 **Status Management** - Mark messages as read/unread
- 🗑️ **Delete Messages** - Remove processed messages
- 📱 **Responsive Design** - Manage messages from any device

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern frontend framework
- **Vite** - Fast build tool and development server
- **CSS3** - Custom responsive styling
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Server-side runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **GitHub** - Code repository and collaboration
- **VS Code** - Development environment

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/praveen7386626080/chef-booking-app.git
cd chef-booking-app

#Install Frontend Dependencies:
npm install



#Install Backend Dependencies:
cd chef-backend
npm install
cd ..


## Start the Development Servers:

#Terminal 1 - Backend Server:
cd chef-backend
npm run dev
Server runs on: http://localhost:5000

#Terminal 2 - Frontend Server:
npm run dev
Frontend runs on http://localhost:5173


🎯 Usage For Customers:

1. Visit the website and browse services
2 .Fill out the contact form with your inquiry
3. Receive confirmation and wait for chef's response


### For Admin (Chef Srinivas)

1. Navigate to the Admin section
2. View all customer messages in the dashboard
3. Mark messages as read/unread
4. Search and filter messages as needed
5. Delete processed messages



📁 Project Structure:

chef-booking-app/
├── chef-backend/                 # Backend server
│   ├── server.js                # Express server setup
│   ├── database.js              # SQLite database configuration
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
├── src/                         # Frontend React application
│   ├── components/              # React components
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Hero.jsx             # Hero section
│   │   ├── Menu.jsx             # Services menu
│   │   ├── About.jsx            # About section
│   │   ├── Contact.jsx          # Contact form
│   │   ├── Admin.jsx            # Admin panel
│   │   └── Footer.jsx           # Footer section
│   ├── App.jsx                  # Main App component
│   ├── App.css                  # Global styles
│   └── main.jsx                 # React entry point
├── package.json                 # Frontend dependencies
├── index.html                   # HTML template
└── README.md                    # Project documentation


