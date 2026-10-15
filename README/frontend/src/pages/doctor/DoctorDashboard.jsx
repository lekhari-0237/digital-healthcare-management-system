import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import ConsultationModal from '../../components/doctor/ConsultationModal';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Stethoscope, CheckCircle2, User, Play } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading doctor clinical workspace..." />;

  const todayApts = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Consultation Started');
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-8">
      {/* Doctor Header */}
      <div className="bg-gradient-to-r from-sky-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Doctor Portal</span>
          <h1 className="text-3xl font-extrabold mt-1">Welcome, {user?.name}</h1>
          <p className="text-xs text-sky-100 mt-1">
            {user?.doctorProfile?.specialization || 'Consultant Physician'} • {todayApts.length} Consultation(s) Pending Today
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Today's Pending Consults</span>
            <span className="text-2xl font-extrabold text-slate-800">{todayApts.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Completed Consultations</span>
            <span className="text-2xl font-extrabold text-slate-800">{completedCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Appointments Assigned</span>
            <span className="text-2xl font-extrabold text-slate-800">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Today's Consultations List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-sky-600" /> Scheduled Consultations Room
        </h3>

        {appointments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">No patient appointments scheduled.</div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-slate-100/60 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center font-bold text-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{apt.patientId?.name || 'Patient'}</h4>
                    <p className="text-xs text-slate-500">Gender: {apt.patientId?.gender || 'N/A'} • Reason: "{apt.reason}"</p>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Date: <strong className="text-slate-700">{new Date(apt.appointmentDate).toLocaleDateString()}</strong></span>
                      <span>Slot: <strong className="text-slate-700">{apt.timeSlot}</strong></span>
                      <span>Mode: <strong className="text-sky-700">{apt.appointmentType}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
                  }`}>
                    {apt.status}
                  </span>

                  {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" /> Start Consultation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}
