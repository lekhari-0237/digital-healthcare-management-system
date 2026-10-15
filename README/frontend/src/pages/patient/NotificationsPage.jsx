import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [toastMsg, setToastMsg] = useState('');
  const [reschedulingId, setReschedulingId] = useState(null);

  if (loading) return <Loader label="Loading notifications..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-sky-600" /> Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">In-app updates regarding appointments, bookings, payments, and lab reports.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <CheckCheck className="h-4 w-4" /> Mark All as Read
          </button>
        )}
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          title="You're All Caught Up!"
          description="There are no notifications to display at this time."
          icon={Bell}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-sm overflow-hidden">
          {notifications.map((n) => {
            const isDoctorUnavailable = n.type === 'DOCTOR_UNAVAILABLE' || (n.suggestedSlots && n.suggestedSlots.length > 0);
            return (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-5 flex items-start justify-between cursor-pointer transition ${
                  !n.isRead ? 'bg-sky-50/60 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2 flex-1 mr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{n.title}</span>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-sky-600 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message ? n.message.replace(/\$/g, '₹') : ''}
                  </p>

                  {/* Render suggested slots for DOCTOR_UNAVAILABLE notifications */}
                  {isDoctorUnavailable && n.suggestedSlots && n.suggestedSlots.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <p className="text-xs font-bold text-slate-700">Suggested Alternative Slots:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {n.suggestedSlots.map((slot, sIdx) => {
                          const keyKey = `${n._id}-${sIdx}`;
                          const isBusy = reschedulingId === keyKey;
                          const dateStr = slot.date || '';
                          const timeStr = slot.time || '';
                          const labelText = `${dateStr}${timeStr ? `, ${timeStr}` : ''}`;
                          return (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-sky-50 transition text-xs"
                            >
                              <span className="font-semibold text-slate-800 text-xs truncate mr-2">
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
                                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-sm transition disabled:opacity-50 whitespace-nowrap"
                              >
                                {isBusy ? 'Selecting...' : 'Select'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {n.type}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

