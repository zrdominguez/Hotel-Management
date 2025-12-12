import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import RoomsPage from './pages/RoomsPage';
import ProfilePage from './pages/ProfilePage';
import EmployeesPage from './pages/EmployeesPage';
import ReservationDetailsPage from './pages/ReservationDetailsPage';
import RoomBrowsingPage from './pages/RoomBrowsingPage';
import RoomDetailsPage from './pages/RoomDetailsPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <ToastContainer />
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomsPage />
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
            path="/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservation/:reservationId"
            element={
              <ProtectedRoute>
                <ReservationDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse-rooms"
            element={
              <ProtectedRoute>
                <RoomBrowsingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <RoomDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
