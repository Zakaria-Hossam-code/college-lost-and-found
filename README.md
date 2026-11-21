# 🎓 College Lost & Found Management System (CampusFind)

A full-stack, enterprise-grade web application engineered for college campuses to organize, track, report, match, and return lost property to students and staff.

Built based on the Software Engineering Course Project Proposal.

---

## 🚀 Key Features

### 👤 Student & Staff Features
- **User Authentication & Authorization**: Secure JWT-based authentication with BCrypt password hashing, profile management, and role-based permissions.
- **Report Lost Items**: Comprehensive submission form capturing item title, description, category, campus location, date lost, and photo upload.
- **Report Found Items**: Easy logging of found property with building location and custody details.
- **Directory Search & Multi-Criteria Filtering**: Real-time keyword search, type toggles (All / Lost / Found), categories, campus locations, date ranges, and status filters.
- **Item Details & Photo Gallery**: High-resolution item view with reporter metadata and location tracking.
- **Smart Matching Engine**: Algorithmic similarity detection comparing category, location proximity, date delta, and keyword overlaps with confidence percentages (e.g. 95% match).
- **Ownership Claim Submission**: Form to submit verified proof of ownership (serial numbers, custom markings, purchase receipts) and supporting evidence photos.
- **Notification Center**: Real-time alerts for suggested matches, claim approvals, claim rejections, and report updates with direct link navigation and unread counters.

### 🛡️ Administrative Portal
- **Overview Dashboard**: Analytics covering total users, lost vs. found reports, pending claims, reunited items, and unclaimed inventory.
- **Manage Reports**: Complete audit trail to search, filter, edit report metadata, change status (`Active`, `PendingClaim`, `Claimed`, `Resolved`, `Closed`), and delete inappropriate submissions.
- **Review & Verify Ownership Claims**:
  - Detailed inspection of claimant information and proof evidence.
  - **Approve Claim**: Automatically marks item as `Claimed`, notifies owner with pickup instructions, and closes competing claims.
  - **Reject Claim**: Records an official rejection explanation and notifies the claimant.
- **Unclaimed Items Management**: Tracks found items exceeding the 14-day and 30-day statutory holding periods, enabling surplus donation or archiving.
- **Manage Categories**: Create, edit, and delete item taxonomies (with safety guards preventing deletion of referenced categories).
- **Manage Locations**: Manage campus buildings, libraries, sports complexes, and dining halls.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 6, React Router 7, Axios, Lucide React Icons, HTML5, CSS3 |
| **Backend** | C# 10 / ASP.NET Core Web API, RESTful Architecture, Dependency Injection |
| **ORM / Data** | Entity Framework Core (EF Core 9.0) |
| **Database** | Microsoft SQL Server (with resilient SQLite fallback for local development) |
| **Security** | JWT (JSON Web Tokens), BCrypt.Net password hashing, Role-based authorization |

---

## 📁 Project Architecture

```
college-lost-and-found/
├── backend/                               # ASP.NET Core Web API (.NET 10/9)
│   ├── Controllers/                       # RESTful API Controllers
│   │   ├── AuthController.cs              # Register, Login, Profile
│   │   ├── ReportsController.cs           # Lost & Found CRUD, Matches, Uploads
│   │   ├── ClaimsController.cs            # Claim submission & Admin processing
│   │   ├── CategoriesController.cs        # Category management
│   │   ├── LocationsController.cs         # Location management
│   │   ├── NotificationsController.cs     # Alerts & Unread management
│   │   └── DashboardController.cs         # Admin & User analytics
│   ├── Data/                              # EF Core DbContext & Initializer
│   │   ├── LostAndFoundDbContext.cs       # Entity mapping & schema configuration
│   │   ├── DbInitializer.cs               # Sample data & Admin seed
│   │   ├── LostAndFoundDesignTimeFactory.cs
│   │   └── Migrations/                    # EF Core SQL Server migrations
│   ├── DTOs/                              # Strongly typed request/response models
│   ├── Models/                            # Relational Entities (User, Report, Claim, etc.)
│   ├── Services/                          # TokenService, MatchingService, NotificationService
│   ├── appsettings.json                   # Connection strings & JWT config
│   └── Program.cs                         # ASP.NET Core pipeline & DI registration
│
├── frontend/                              # React + Vite Single Page Application
│   ├── src/
│   │   ├── api/                           # Axios client & API service modules
│   │   ├── components/                    # Navbar, Footer, AdminSidebar, ItemCard, MatchCard, ClaimModal, Toast
│   │   ├── context/                       # AuthContext & NotificationContext
│   │   ├── pages/                         # Public, User, and Admin views
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ItemsPage.jsx
│   │   │   ├── ItemDetailsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── UserDashboardPage.jsx
│   │   │   ├── MyReportsPage.jsx
│   │   │   ├── MyClaimsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx
│   │   │       ├── ManageReportsPage.jsx
│   │   │       ├── ManageClaimsPage.jsx
│   │   │       ├── UnclaimedItemsPage.jsx
│   │   │       ├── ManageCategoriesPage.jsx
│   │   │       └── ManageLocationsPage.jsx
│   │   ├── App.jsx                        # Route definitions & ProtectedRoute guards
│   │   └── index.css                      # University design system styles
│   ├── vite.config.js                     # Vite proxy to backend API (port 5000)
│   └── package.json
│
├── database_setup.sql                     # Complete idempotent SQL Server DDL script
└── test_api.ps1                           # Automated backend verification test script
```

---

## 🔑 Development Credentials

The system seeds sample accounts automatically upon first startup:

| Role | Username | Email | Password | Phone |
|---|---|---|---|---|
| **Administrator** | `admin` | `admin@college.edu` | `Admin@123` | `+1 (555) 019-9000` |
| **Student** | `john_doe` | `john.doe@college.edu` | `Student@123` | `+1 (555) 014-2345` |
| **Student** | `jane_smith` | `jane.smith@college.edu` | `Student@123` | `+1 (555) 017-7890` |

> *Quick-login buttons are also available directly on the `/login` page.*

---

## 🗄️ Database Setup (Microsoft SQL Server)

### Option A: Using Entity Framework Core Migrations
Ensure your SQL Server instance (e.g. `localhost` or `.\SQLEXPRESS`) is running, then execute:
```bash
cd backend
dotnet dotnet-ef database update
```

### Option B: Using the Included SQL Script
You can execute `database_setup.sql` directly in **SQL Server Management Studio (SSMS)**, **Azure Data Studio**, or via command line:
```bash
sqlcmd -S localhost -E -i database_setup.sql
```

### Database Connection Configuration
In `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CollegeLostAndFoundDb;Trusted_Connection=True;TrustServerCertificate=True;Connect Timeout=5;",
    "SqliteConnection": "Data Source=lostandfound.db"
  },
  "DatabaseProvider": "SqlServer"
}
```
*Note: If SQL Server is offline or not installed on your development workstation, the application automatically falls back to SQLite so you can develop and test immediately without errors.*

---

## 🏃 How to Run the Application

### 1. Prerequisites
- **.NET SDK** (version 9.0 or 10.0)
- **Node.js** (v18+) and **npm**
- **Microsoft SQL Server** (or local database instance)

### 2. Running the Backend API
```bash
cd backend
dotnet restore
dotnet run --urls http://localhost:5000
```
- The backend API starts on **http://localhost:5000**.
- Database tables and seed accounts are initialized automatically on launch.

### 3. Running the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
- The Vite frontend starts on **http://localhost:5173**.
- Open **http://localhost:5173** in your web browser.

---

## 🧪 Automated Testing

To run the automated verification suite which tests all controllers, authentication, smart matching, claims, and dashboard stats:
```powershell
powershell -ExecutionPolicy Bypass -File test_api.ps1
```

---

## 🎨 UI/UX Design System
- **Colors**: Deep navy blue (`#0f1d40`, `#070e20`), clean white backgrounds (`#ffffff`, `#f8fafc`), and vibrant university blue accents (`#0284c7`, `#38bdf8`).
- **Badges**: Amber/yellow for Lost items (`--lost-primary`), emerald/green for Found items (`--found-primary`), red for rejected claims.
- **Responsive**: Fully responsive across desktop workstations, tablets, and smartphones.
