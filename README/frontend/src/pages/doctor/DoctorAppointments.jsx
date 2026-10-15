import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import ConsultationModal from '../../components/doctor/ConsultationModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Stethoscope, Play } from 'lucide-react';

export default function DoctorAppointments() {
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

  if (loading) return <Loader label="Loading assigned patient appointments..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Doctor Consultation Queue</h1>
        <p className="text-xs text-slate-500 mt-1">Review scheduled appointments and issue digital prescriptions.</p>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description="There are no patient appointments assigned to you currently."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{apt.patientId?.name || 'Patient'}</h4>
                <p className="text-xs text-slate-500">Gender: {apt.patientId?.gender || 'N/A'} • Reason: "{apt.reason}"</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Date: <strong className="text-slate-700">{new Date(apt.appointmentDate).toLocaleDateString()}</strong></span>
                  <span>Slot: <strong className="text-slate-700">{apt.timeSlot}</strong></span>
                  <span>Mode: <strong className="text-sky-700">{apt.appointmentType}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  (apt.status === 'COMPLETED' || apt.status === 'Completed') 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : (apt.status === 'CANCELLED' || apt.status === 'Cancelled')
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-sky-50 text-sky-700'
                }`}>
                  {apt.status}
                </span>

                {(apt.status === 'COMPLETED' || apt.status === 'Completed') ? (
                  <span className="px-3.5 py-1.5 bg-emerald-100/70 text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5" /> Consultation Completed
                  </span>
                ) : (apt.status !== 'CANCELLED' && apt.status !== 'Cancelled') && (
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
