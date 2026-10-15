import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  TestTube,
  FileText,
  CreditCard,
  User,
  Bell,
  Compass,
  Users,
  Stethoscope,
  Activity,
  BarChart3,
  CheckSquare
} from 'lucide-react';

export default function Sidebar() {
  const { role } = useAuth();

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/healthcare-journey', label: 'Healthcare Journey', icon: Compass },
    { to: '/patient/appointments', label: 'Doctor Appointments', icon: Calendar },
    { to: '/patient/test-bookings', label: 'Diagnostic Bookings', icon: TestTube },
    { to: '/patient/reports', label: 'My Diagnostic Reports', icon: Activity },
    { to: '/patient/prescriptions', label: 'My Prescriptions', icon: FileText },
    { to: '/patient/payments', label: 'Payment History', icon: CreditCard },
    { to: '/patient/notifications', label: 'Notifications', icon: Bell },
    { to: '/patient/profile', label: 'My Profile', icon: User },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Doctor Dashboard', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/doctor/prescriptions', label: 'Issued Prescriptions', icon: FileText },
    { to: '/doctor/profile', label: 'Doctor Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Analytics', icon: BarChart3 },
    { to: '/admin/patients', label: 'Manage Patients', icon: Users },
    { to: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    { to: '/admin/tests', label: 'Diagnostic Tests Catalog', icon: TestTube },
    { to: '/admin/appointments', label: 'All Appointments', icon: Calendar },
    { to: '/admin/bookings', label: 'All Test Bookings', icon: CheckSquare },
    { to: '/admin/reports', label: 'Lab Reports Control', icon: Activity },
    { to: '/admin/payments', label: 'Revenue & Payments', icon: CreditCard },
  ];

  const getLinks = () => {
    if (role === 'ADMIN') return adminLinks;
    if (role === 'DOCTOR') return doctorLinks;
    return patientLinks;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="mb-4 px-3 py-2 bg-sky-50 rounded-xl">
        <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Role Portal</p>
        <p className="text-xs font-bold text-slate-800">{role} DASHBOARD</p>
      </div>

      <nav className="space-y-1">
        {getLinks().map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
