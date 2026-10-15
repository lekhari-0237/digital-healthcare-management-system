import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { appointmentService } from '../../services/appointmentService';
import { Activity, Bell, User, LogOut, LayoutDashboard, Calendar, TestTube, FileText, CheckCheck, Menu, X, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [reschedulingId, setReschedulingId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-sky-600 font-bold text-xl tracking-tight">
              <div className="p-2 bg-sky-500 text-white rounded-xl shadow-md shadow-sky-500/20">
                <Activity className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-extrabold text-lg leading-none">HealthTrack</span>
                <span className="text-[10px] text-sky-600 font-medium tracking-wide">DIGITAL HEALTHCARE</span>
              </div>
            </Link>

            {/* Main Nav Links (Desktop) */}
            <div className="hidden md:flex md:ml-10 md:space-x-6">
              <Link to="/" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition">Home</Link>
              <Link to="/tests" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition">Diagnostic Tests</Link>
              <Link to="/doctors" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition">Find Doctors</Link>
              <Link to="/about" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition">About Us</Link>
              <Link to="/contact" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition">Contact</Link>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {isAuthenticated ? (
              <>
                {/* Notification Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-full transition relative"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                        <h4 className="font-semibold text-slate-800 text-sm">Notifications</h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-medium"
                          >
                            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      {toastMsg && (
                        <div className="m-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span>{toastMsg}</span>
                        </div>
                      )}

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">No notifications yet</div>
                        ) : (
                          notifications.map((n) => {
                            const isDoctorUnavailable = n.type === 'DOCTOR_UNAVAILABLE' || (n.suggestedSlots && n.suggestedSlots.length > 0);
                            return (
                              <div
                                key={n._id}
                                onClick={() => markAsRead(n._id)}
                                className={`p-3.5 hover:bg-slate-50 cursor-pointer transition ${
                                  !n.isRead ? 'bg-sky-50/50' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-semibold text-xs text-slate-800">{n.title}</span>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {n.message ? n.message.replace(/\$/g, '₹') : ''}
                                </p>

                                {/* Render suggested slots for DOCTOR_UNAVAILABLE notifications */}
                                {isDoctorUnavailable && n.suggestedSlots && n.suggestedSlots.length > 0 && (
                                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-[11px] font-bold text-slate-700">Suggested Alternative Slots:</p>
                                    <div className="space-y-1.5">
                                      {n.suggestedSlots.map((slot, sIdx) => {
                                        const keyKey = `${n._id}-${sIdx}`;
                                        const isBusy = reschedulingId === keyKey;
                                        const dateStr = slot.date || '';
                                        const timeStr = slot.time || '';
                                        const labelText = `${dateStr}${timeStr ? `, ${timeStr}` : ''}`;
                                        return (
                                          <div
                                            key={sIdx}
                                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-sky-50 transition text-xs"
                                          >
                                            <span className="font-medium text-slate-800 text-[11px] truncate mr-2">
                                              {labelText}
                                            </span>
                                            <button
                                              type="button"
                                              disabled={isBusy}
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                setReschedulingId(keyKey);
                                                try {
                                                  const aptId = typeof n.appointmentId === 'object' ? n.appointmentId?._id : n.appointmentId;
                                                  if (!aptId) {
                                                    alert('Appointment ID not found in notification');
                                                    return;
                                                  }
                                                  await appointmentService.rescheduleAppointment(aptId, {
                                                    date: slot.date,
                                                    time: slot.time
                                                  });
                                                  await markAsRead(n._id);
                                                  const successText = `Appointment rescheduled to ${labelText}`;
                                                  setToastMsg(successText);
                                                  setTimeout(() => setToastMsg(''), 5000);
                                                } catch (err) {
                                                  console.error('Failed to reschedule:', err);
                                                  alert(err.response?.data?.message || 'Error rescheduling appointment');
                                                } finally {
                                                  setReschedulingId(null);
                                                }
                                              }}
                                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-[10px] rounded-lg shadow-sm transition disabled:opacity-50 whitespace-nowrap"
                                            >
                                              {isBusy ? 'Selecting...' : 'Select'}
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>


                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition border border-slate-200/60"
                  >
                    <img
                      src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full object-cover shadow-sm"
                    />
                    <div className="text-left hidden lg:block pr-2">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                      <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md">
                        {role}
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <LayoutDashboard className="h-4 w-4 text-sky-500" /> Dashboard
                      </Link>

                      {role === 'PATIENT' && (
                        <Link
                          to="/patient/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <User className="h-4 w-4 text-sky-500" /> My Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100 mt-1"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-sky-600 font-semibold text-xs px-4 py-2 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition transform active:scale-95"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Home</Link>
          <Link to="/tests" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Diagnostic Tests</Link>
          <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Find Doctors</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 font-medium">Contact</Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sky-600 font-semibold">Go to Dashboard</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-rose-600 font-semibold">Sign Out</button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-xl bg-sky-600 text-white font-semibold shadow-md">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
