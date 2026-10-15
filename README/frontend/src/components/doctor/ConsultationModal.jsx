import React, { useState } from 'react';
import Modal from '../common/Modal';
import { prescriptionService } from '../../services/prescriptionService';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose, appointment, onSuccess }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After food' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!appointment) return null;

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { medicineName: '', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days', instructions: 'After food' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMedChange = (index, field, value) => {
    setMedicines((prev) =>
      prev.map((med, idx) => (idx === index ? { ...med, [field]: value } : med))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis.');
      return;
    }

    const invalidMed = medicines.find((m) => !m.medicineName.trim());
    if (invalidMed) {
      setError('Please specify medicine name for all listed items or remove empty rows.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await prescriptionService.createPrescription({
        appointmentId: appointment._id,
        patientId: appointment.patientId?._id || appointment.patientId,
        diagnosis: diagnosis.trim(),
        notes: notes.trim(),
        advice: advice.trim(),
        followUpDate: followUpDate || null,
        medicines
      });

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error issuing prescription.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Doctor Consultation & Digital Prescription" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Summary */}
        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-sky-700 font-bold block">Patient Name:</span>
            <span className="text-slate-800 font-semibold">{appointment.patientId?.name || 'Patient'}</span>
          </div>
          <div>
            <span className="text-sky-700 font-bold block">Age / Gender:</span>
            <span className="text-slate-800 font-semibold">{appointment.patientId?.gender || 'N/A'}</span>
          </div>
          <div>
            <span className="text-sky-700 font-bold block">Reason for Visit:</span>
            <span className="text-slate-800 font-semibold truncate">{appointment.reason || 'General'}</span>
          </div>
        </div>

        {/* Diagnosis & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Diagnosis *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acute Sinusitis / Hypertension Stage 1"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Observations / Notes</label>
            <input
              type="text"
              placeholder="e.g. Blood Pressure: 130/85 mmHg, Pulse: 78 bpm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

        {/* Prescribed Medicines */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700">Prescribed Medicines</label>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              <Plus className="h-4 w-4" /> Add Medicine
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Paracetamol)"
                    value={med.medicineName}
                    onChange={(e) => handleMedChange(index, 'medicineName', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Dosage (500 mg)"
                    value={med.dosage}
                    onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    placeholder="Frequency (Twice daily)"
                    value={med.frequency}
                    onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    placeholder="Instructions (After food)"
                    value={med.instructions}
                    onChange={(e) => handleMedChange(index, 'instructions', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="col-span-1 text-right">
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice & Follow-Up */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">General Advice</label>
            <input
              type="text"
              placeholder="e.g. Rest, drink 3L water daily"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Follow-Up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {loading ? 'Saving Prescription...' : 'Save Prescription & Complete Consultation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
