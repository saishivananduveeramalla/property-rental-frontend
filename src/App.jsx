import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { Home } from './pages/public/Home';
import { Properties } from './pages/public/Properties';
import { PropertyDetails } from './pages/public/PropertyDetails';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Tenant Pages
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { TenantRequests } from './pages/tenant/TenantRequests';
import { TenantBookings } from './pages/tenant/TenantBookings';
import { TenantProfile } from './pages/tenant/TenantProfile';
import { NotificationsPage } from './pages/tenant/NotificationsPage';
import { PaymentPage } from './pages/tenant/PaymentPage';
import { ReceiptPage } from './pages/tenant/ReceiptPage';

// Owner Pages
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerProperties } from './pages/owner/OwnerProperties';
import { AddProperty } from './pages/owner/AddProperty';
import { EditProperty } from './pages/owner/EditProperty';
import { OwnerRequests } from './pages/owner/OwnerRequests';
import { OwnerRentalHistory } from './pages/owner/OwnerRentalHistory';
import { OwnerProfile } from './pages/owner/OwnerProfile';
import { OwnerMessages } from './pages/owner/OwnerMessages';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminProperties } from './pages/admin/AdminProperties';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminReports } from './pages/admin/AdminReports';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Tenant Routes */}
              <Route
                path="/tenant/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/requests"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                    <TenantRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/bookings"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                    <TenantBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                    <TenantProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/notifications"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_OWNER', 'ROLE_ADMIN']}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/payment/:bookingId"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/receipt/:id"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_OWNER', 'ROLE_ADMIN']}>
                    <ReceiptPage />
                  </ProtectedRoute>
                }
              />

              {/* Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/properties"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/properties/add"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/properties/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/requests"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/history"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerRentalHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/messages"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                    <OwnerMessages />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/properties"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminProperties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminReports />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
