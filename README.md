# SIMS — SmartPark Inventory Management System

A full-stack inventory management system built for SmartPark, a car service company. Replaces paper-based tracking with a modern web app for managing spare parts, stock movements, and reports.

## Tech Stack

**Frontend:** React 19 + Vite + TailwindCSS v4 + React Router v6  
**Backend:** Node.js + Express + MySQL (via mysql2)  
**Auth:** JWT + bcryptjs  

## Features

- **User authentication** — Register, login, password recovery via security questions
- **Spare Parts catalog** — Full CRUD with categories, quantities, pricing, auto-calculated total value
- **Stock In** — Record incoming stock, automatically updates part quantities
- **Stock Out** — Record sales with full CRUD (edit/delete), auto-updates inventory
- **Dashboard** — Real-time stats: total parts, stock in/out counts, low stock alerts, inventory value
- **Reports** — Stock status report, date-range movement report, low stock alerts (all exportable to PDF)
- **Responsive** — Mobile-first layout with slide-over sidebar, horizontally scrollable tables, touch-friendly forms
- **Security** — Encrypted passwords, JWT expiry validation, 401 interceptor, password strength enforcement

## Folder Structure

```
├── backend-project/
│   ├── controller/       # Route handlers (users, spare-parts, stock-in, stock-out, reports)
│   ├── routes/           # Express route definitions
│   ├── middleware/        # JWT auth + password validation
│   ├── db/               # MySQL connection + schema
│   └── server.js         # Entry point
├── frontend-project/
│   ├── src/
│   │   ├── pages/        # Page components (Login, Register, Dashboard, etc.)
│   │   ├── component/    # Reusable components (Button, Input, Card, Table, Modal, Toast, etc.)
│   │   ├── layout/       # MainLayout + Sidebar
│   │   └── api/          # Axios instance with interceptors
│   └── App.jsx           # Router setup with lazy loading
└── database.sql          # MySQL schema (in backend-project/db/)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+

### 1. Database Setup

```bash
mysql -u root -p < backend-project/db/database.sql
```

This creates the `sims` database with tables: `Users`, `SecurityQuestions`, `Spare_Part`, `Stock_In`, `Stock_Out`.

### 2. Backend

```bash
cd backend-project
cp .env.example .env      # Configure DB credentials + JWT secret
npm install
npm start                 # Runs on port 5000
```

### 3. Frontend

```bash
cd frontend-project
npm install
npm run dev               # Runs on port 5173
```

The frontend proxies API calls to `http://localhost:5000/api` (configurable via `VITE_API_URL`).

### 4. Login

Register a new account, set up your security questions, then log in.

## Database Schema

| Table | Key Columns |
|---|---|
| **Users** | ID, Name, email, password |
| **SecurityQuestions** | SQ_ID, UserID (FK), Question, Answer (hashed) |
| **Spare_Part** | SpareP_ID, Name, Category, Quantity, UnityPrice, TotalPrice (generated) |
| **Stock_In** | StockIn_ID, SpareP_ID (FK), StockInQuantity, StockInDate |
| **Stock_Out** | StockOut_ID, SpareP_ID (FK), StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice (generated), StockOutDate |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Create account (returns JWT) |
| POST | `/api/users/login` | Sign in |
| POST | `/api/users/get-security-questions` | Get user's questions by email |
| POST | `/api/users/verify-and-reset-password` | Verify answers + reset password |
| PUT | `/api/users/questions` | Save security questions (authenticated) |

### Data
| Method | Endpoint | Auth |
|---|---|---|
| GET/POST | `/api/spare-parts` | Yes |
| GET/POST | `/api/stock-in` | Yes |
| GET/POST/PUT/DELETE | `/api/stock-out` | Yes |

### Reports
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/reports/stock-status` | Yes |
| GET | `/api/reports/stock-report?startDate=&endDate=` | Yes |
| GET | `/api/reports/low-stock` | Yes |

## Design System

| Token | Value |
|---|---|
| Primary | `#2563EB` |
| Background | `#F8FAFC` |
| Text | `#0F172A` |
| Muted | `#64748B` |
| Border | `#E2E8F0` |
| Card radius | `16px` |
| Input radius | `12px` |
| Button radius | `10px` |
| Max content width | `1200px` |
| Sidebar width | `260px` |
