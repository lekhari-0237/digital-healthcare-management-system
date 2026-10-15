import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, Clock3, AlertCircle } from 'lucide-react';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.updateStatus(id, 'CANCELLED');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  if (loading) return <Loader label="Loading your scheduled appointments..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Doctor Appointments</h1>
        <p className="text-xs text-slate-500 mt-1">Manage consultation schedules, status approvals, and cancellations.</p>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Scheduled"
          description="You haven't requested any doctor consultations yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorId?.profileImage || 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=200'}
                  alt={apt.doctorId?.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{apt.doctorId?.name}</h3>
                  <p className="text-xs font-semibold text-sky-600">{apt.appointmentType}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reason: "{apt.reason}"</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-600" />
                  <span>Date: <strong className="text-slate-800">{new Date(apt.appointmentDate).toLocaleDateString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sky-600" />
                  <span>Time Slot: <strong className="text-slate-800">{apt.timeSlot}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  apt.status === 'CONFIRMED' || apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                  apt.status === 'COMPLETED' || apt.status === 'Completed' ? 'bg-purple-50 text-purple-700' :
                  apt.status === 'CANCELLED' || apt.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  Status: {apt.status === 'PENDING_ADMIN_APPROVAL' ? 'Awaiting Admin Approval' : apt.status}
                </span>

                {(apt.status === 'CONFIRMED' || apt.status === 'PENDING_ADMIN_APPROVAL') && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
