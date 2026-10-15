import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/common/Loader';
import { Calendar, CheckCircle2, XCircle, AlertTriangle, Plus, Trash2, Send } from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Doctor Unavailable Modal State
  const [notifyModalApt, setNotifyModalApt] = useState(null);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM');
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching admin appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const openNotifyModal = (apt) => {
    setNotifyModalApt(apt);
    const docName = apt.doctorId?.name || 'Doctor';
    const dateStr = new Date(apt.appointmentDate).toLocaleDateString();
    setNotifyMessage(
      `Important Notice: Dr. ${docName} is unavailable for your consultation scheduled on ${dateStr} at ${apt.timeSlot}. Please review suggested alternative slots below or rebook.`
    );
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    setNewSlotDate(tomorrowStr);
    setNewSlotTime('11:00 AM');
    setSuggestedSlots([
      { date: tomorrowStr, time: '11:00 AM' },
      { date: tomorrowStr, time: '03:00 PM' }
    ]);
    setNotifySuccess('');
  };

  const handleAddSuggestedSlot = () => {
    if (!newSlotDate || !newSlotTime) return;
    setSuggestedSlots([...suggestedSlots, { date: newSlotDate, time: newSlotTime }]);
  };

  const handleRemoveSuggestedSlot = (idx) => {
    setSuggestedSlots(suggestedSlots.filter((_, i) => i !== idx));
  };

  const handleSendUnavailabilityNotice = async (e) => {
    e.preventDefault();
    if (!notifyModalApt) return;
    setNotifyLoading(true);
    setNotifySuccess('');
    try {
      await adminService.notifyDoctorUnavailable(notifyModalApt._id, {
        message: notifyMessage,
        suggestedSlots
      });
      setNotifySuccess('Patient notified successfully!');
      setTimeout(() => {
        setNotifyModalApt(null);
        setNotifySuccess('');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setNotifyLoading(false);
    }
  };

  if (loading) return <Loader label="Loading all system appointments..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage All Doctor Appointments</h1>
        <p className="text-xs text-slate-500 mt-1">System-wide consultation schedule overview and manual override controls.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Appointment ID</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Date & Slot</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">#{apt._id?.substring(18)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{apt.patientId?.name || 'Patient'}</td>
                  <td className="py-3 px-4 text-sky-700 font-semibold">{apt.doctorId?.name || 'Doctor'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(apt.appointmentDate).toLocaleDateString()} @ {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{apt.appointmentType}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      (apt.status === 'COMPLETED' || apt.status === 'Completed') ? 'bg-emerald-50 text-emerald-700' :
                      (apt.status === 'CANCELLED' || apt.status === 'Cancelled') ? 'bg-rose-50 text-rose-700' :
                      (apt.status === 'CONFIRMED' || apt.status === 'Confirmed') ? 'bg-sky-50 text-sky-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {apt.status !== 'COMPLETED' && apt.status !== 'Completed' && apt.status !== 'CANCELLED' && apt.status !== 'Cancelled' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(apt._id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-[10px]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt._id, 'CANCELLED')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg text-[10px]"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openNotifyModal(apt)}
                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-lg text-[10px] inline-flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Notify Patient - Doctor Unavailable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Unavailable Modal */}
      {notifyModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Notify Patient - Doctor Unavailable
              </h3>
              <button onClick={() => setNotifyModalApt(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">✕</button>
            </div>

            {notifySuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {notifySuccess}
              </div>
            )}

            <form onSubmit={handleSendUnavailabilityNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message to Patient</label>
                <textarea
                  rows={3}
                  required
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Suggest Alternative Slots</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <select
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {['09:30 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSuggestedSlot}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Slot
                  </button>
                </div>

                <div className="space-y-1.5">
                  {suggestedSlots.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span>📅 <strong>{s.date}</strong> at <strong>{s.time}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSuggestedSlot(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {suggestedSlots.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic">No suggested slots added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNotifyModalApt(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={notifyLoading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> {notifyLoading ? 'Sending...' : 'Send Notification to Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
