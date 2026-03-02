# 📦 Inventory Management System

A full-stack web application designed to manage and track inventory and goods, featuring QR code scanning, secure user authentication, role-based access control, and comprehensive activity logging.

---

## 🎯 Overview

This is a **modern inventory management system** built using:

* **Frontend**: React 19 + Vite + Tailwind CSS
* **Backend**: Node.js + Express 5
* **Database**: PostgreSQL

**Core Capabilities** include QR code scanning, activity logging, role-based access control, equipment tracking, and request management.

---

## 🏗️ Project Structure

```
inventory_system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/        # UI components (Header, Cards, Modals, Navigation)
│   │   ├── hooks/         # Custom React hooks (Auth routes, admin checks)
│   │   ├── page/          # Page components (Dashboard, Equipment, Users, etc.)
│   │   ├── store/         # Zustand state management
│   │   ├── layout/        # Layout components
│   │   ├── root/          # Root layout
│   │   ├── App.jsx        # Main app component with routing
│   │   ├── main.jsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── vite.config.js     # Vite configuration
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Configuration (DB, Cloudinary, Multer)
│   │   ├── controller/    # Route controllers (Auth, Equipment, Requests, etc.)
│   │   ├── database/      # Database connection and initialization
│   │   ├── mail/          # Email templates
│   │   ├── model/         # Data models (User, Equipment, Request, etc.)
│   │   ├── routes/        # API route definitions
│   │   ├── util/          # Utility helpers (Sessions, Validation, IP address)
│   │   └── server.js      # Express application entry point
│   └── package.json
│
└── README.md              # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites

* **Node.js** (v16+)
* **PostgreSQL** (v12+)
* **npm** or **yarn**

---

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd inventory_system
```

---

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server root:

```bash
cat > .env << EOF
PORT=5680
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password

# Email configuration (activity notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Cloudinary (image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret
JWT_SECRET=your_jwt_secret_key
EOF
```

Initialize the database and start the server:

```bash
npm run db_init
npm run server
```

---

#### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the client root if needed:

```bash
cat > .env << EOF
VITE_API_URL=http://localhost:5680/api
EOF
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:
👉 `http://localhost:5173`

---

## 🔑 Key Features

### 🔐 Authentication & Authorization

* **User Registration**: Restricted to admin users
* **Login System**: Secure email/password authentication using bcryptjs
* **Role-Based Access Control**:

  * `super_admin` – Full system access
  * `admin` – User and equipment management
  * `staff` – Core operational access
  * `customer` – Limited access

---

### 📦 Equipment Management

* Create, update, and remove equipment records
* **Automatic QR Code Generation** for each item
* Track equipment quantity, category, status, and images
* Search and filter functionality

---

### 📋 Request Management

* Staff can submit equipment requests
* Admin approval workflow
* Request status tracking (pending, approved, rejected)
* Full request history visibility

---

### 🔄 Returns & Transactions

* Manual return processing
* Transaction history tracking
* Equipment condition photos upon return
* Automatic status updates

---

### 📊 Reporting & Analytics

* Dashboard with key statistics
* Detailed activity logs
* Exportable transaction history
* Equipment usage analytics

---

### 🔒 Activity Logging

All system actions are logged with:

* User ID and username
* Action type
* IP address
* User agent
* Severity level
* Affected resource

---

### 🎨 User Interface

* Clean, modern UI powered by Tailwind CSS
* Responsive design for desktop and tablet
* Modal-based forms for quick actions
* Toast notifications for feedback
* QR code label printing
* Barcode scanning support

---

## 📊 Database Schema

### Core Tables

* **auth.users** – User accounts and roles
* **inventory.equipments** – Equipment and goods with QR codes
* **inventory.categories** – Equipment categorization
* **operations.transactions** – Issued and returned items
* **operations.activity_logs** – Full audit trail
* **people.customers** – Customer and recipient records

Refer to
`server/src/database/database_schema.md`
for complete schema details.

---

## 🛠️ API Endpoints

### Authentication

```
POST   /api/auth/register         - Register new user (admin only)
POST   /api/auth/login            - User login
POST   /api/auth/logout           - User logout
GET    /api/auth/user             - Get authenticated user
POST   /api/auth/change-password  - Change password
```

### Equipment Management

```
GET    /api/equipment          - Retrieve all equipment
POST   /api/equipment          - Create new equipment
GET    /api/equipment/:id      - Get equipment details
PUT    /api/equipment/:id      - Update equipment
DELETE /api/equipment/:id      - Remove equipment
GET    /api/equipment/qr/:id   - Generate QR code
```

### Requests

```
GET    /api/request            - Retrieve requests
POST   /api/request            - Create new request
GET    /api/request/:id        - Request details
PUT    /api/request/:id        - Update request status
DELETE /api/request/:id        - Cancel request
```

### Transactions

```
GET    /api/transaction        - Retrieve transactions
POST   /api/transaction/issue  - Issue equipment
POST   /api/transaction/return - Return equipment
```

### Logs & Analytics

```
GET    /api/logs               - Activity logs
GET    /api/stats              - Statistics and analytics
```

---

## 🔧 Technology Stack

### Frontend

| Package        | Purpose             |
| -------------- | ------------------- |
| React 19       | UI framework        |
| Vite           | Build tool          |
| React Router 7 | Client-side routing |
| Zustand        | State management    |
| Tailwind CSS   | Styling             |
| Axios          | HTTP requests       |
| React-to-Print | QR code printing    |
| Lucide React   | Icons               |
| React-QR-Code  | QR rendering        |
| React Barcode  | Barcode scanning    |

---

### Backend

| Package            | Purpose               |
| ------------------ | --------------------- |
| Express 5          | Web framework         |
| PostgreSQL (pg)    | Database              |
| bcryptjs           | Password hashing      |
| Nodemailer         | Email delivery        |
| Multer             | File uploads          |
| Cloudinary         | Image storage         |
| JWT                | Authentication tokens |
| Express Validator  | Input validation      |
| Express Rate Limit | API rate limiting     |

---

## 🔐 Security Features

* ✅ Password hashing with bcrypt
* ✅ Parameterized SQL queries
* ✅ CORS protection
* ✅ Secure session handling
* ✅ Role-based authorization
* ✅ Full activity auditing
* ✅ IP address tracking
* ✅ Rate limiting on sensitive endpoints

---

## 📝 Scripts

### Backend

```bash
npm run server    # Start development server
npm run start     # Start production server
npm run db_init   # Initialize database
```

### Frontend

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🐛 Troubleshooting

### Database Issues

* Confirm PostgreSQL is running
* Validate `.env` credentials
* Ensure database exists
* Run `npm run db_init`

### Port Conflicts

* Change `PORT` in server `.env`
* Change Vite port using:

  ```bash
  npm run dev -- --port 3000
  ```

### CORS Errors

* Ensure `CLIENT_URL` matches the frontend URL

### Image Upload Problems

* Verify Cloudinary credentials
* Confirm API keys are valid

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👥 Contributing

Contributions are welcome:

1. Create a feature branch
2. Apply your changes
3. Submit a pull request

---

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Happy inventory tracking! 🚀**


