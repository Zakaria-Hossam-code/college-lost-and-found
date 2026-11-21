import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ItemsPage } from './pages/ItemsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';

// User Pages
import { UserDashboardPage } from './pages/UserDashboardPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportLostPage } from './pages/ReportLostPage';
import { ReportFoundPage } from './pages/ReportFoundPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageReportsPage } from './pages/admin/ManageReportsPage';
import { ManageClaimsPage } from './pages/admin/ManageClaimsPage';
import { UnclaimedItemsPage } from './pages/admin/UnclaimedItemsPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ManageLocationsPage } from './pages/admin/ManageLocationsPage';

// Admin Layout Component
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/lost-and-found" element={<Navigate to="/items" replace />} />
                <Route path="/items/:id" element={<ItemDetailsPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-reports"
                  element={
                    <ProtectedRoute>
                      <MyReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-claims"
                  element={
                    <ProtectedRoute>
                      <MyClaimsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-lost"
                  element={
                    <ProtectedRoute>
                      <ReportLostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-found"
                  element={
                    <ProtectedRoute>
                      <ReportFoundPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="reports" element={<ManageReportsPage />} />
                  <Route path="claims" element={<ManageClaimsPage />} />
                  <Route path="unclaimed" element={<UnclaimedItemsPage />} />
                  <Route path="categories" element={<ManageCategoriesPage />} />
                  <Route path="locations" element={<ManageLocationsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
