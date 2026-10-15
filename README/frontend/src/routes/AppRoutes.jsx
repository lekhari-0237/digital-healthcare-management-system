import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import DoctorsPage from '../pages/public/DoctorsPage';
import DiagnosticTestsPage from '../pages/public/DiagnosticTestsPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientProfile from '../pages/patient/PatientProfile';
import PatientAppointments from '../pages/patient/PatientAppointments';
import PatientTestBookings from '../pages/patient/PatientTestBookings';
import PatientReports from '../pages/patient/PatientReports';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions';
import PatientPayments from '../pages/patient/PatientPayments';
import HealthcareJourneyPage from '../pages/patient/HealthcareJourneyPage';
import NotificationsPage from '../pages/patient/NotificationsPage';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions';
import DoctorProfile from '../pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPatients from '../pages/admin/AdminPatients';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminTests from '../pages/admin/AdminTests';
import AdminAppointments from '../pages/admin/AdminAppointments';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminReports from '../pages/admin/AdminReports';
import AdminPayments from '../pages/admin/AdminPayments';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function PortalLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-slate-50/50">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/doctors" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
      <Route path="/tests" element={<PublicLayout><DiagnosticTestsPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

      {/* Patient Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
        <Route path="/patient/dashboard" element={<PortalLayout><PatientDashboard /></PortalLayout>} />
        <Route path="/patient/profile" element={<PortalLayout><PatientProfile /></PortalLayout>} />
        <Route path="/patient/appointments" element={<PortalLayout><PatientAppointments /></PortalLayout>} />
        <Route path="/patient/test-bookings" element={<PortalLayout><PatientTestBookings /></PortalLayout>} />
        <Route path="/patient/reports" element={<PortalLayout><PatientReports /></PortalLayout>} />
        <Route path="/patient/prescriptions" element={<PortalLayout><PatientPrescriptions /></PortalLayout>} />
        <Route path="/patient/payments" element={<PortalLayout><PatientPayments /></PortalLayout>} />
        <Route path="/patient/healthcare-journey" element={<PortalLayout><HealthcareJourneyPage /></PortalLayout>} />
        <Route path="/patient/notifications" element={<PortalLayout><NotificationsPage /></PortalLayout>} />
      </Route>

      {/* Doctor Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
        <Route path="/doctor/dashboard" element={<PortalLayout><DoctorDashboard /></PortalLayout>} />
        <Route path="/doctor/appointments" element={<PortalLayout><DoctorAppointments /></PortalLayout>} />
        <Route path="/doctor/prescriptions" element={<PortalLayout><DoctorPrescriptions /></PortalLayout>} />
        <Route path="/doctor/profile" element={<PortalLayout><DoctorProfile /></PortalLayout>} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<PortalLayout><AdminDashboard /></PortalLayout>} />
        <Route path="/admin/patients" element={<PortalLayout><AdminPatients /></PortalLayout>} />
        <Route path="/admin/doctors" element={<PortalLayout><AdminDoctors /></PortalLayout>} />
        <Route path="/admin/tests" element={<PortalLayout><AdminTests /></PortalLayout>} />
        <Route path="/admin/appointments" element={<PortalLayout><AdminAppointments /></PortalLayout>} />
        <Route path="/admin/bookings" element={<PortalLayout><AdminBookings /></PortalLayout>} />
        <Route path="/admin/reports" element={<PortalLayout><AdminReports /></PortalLayout>} />
        <Route path="/admin/payments" element={<PortalLayout><AdminPayments /></PortalLayout>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
