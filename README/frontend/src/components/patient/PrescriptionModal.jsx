import React from 'react';
import Modal from '../common/Modal';
import { Stethoscope, Printer, Pill, Calendar, ShieldCheck } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, prescription }) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const medicinesList = prescription.medicines || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Medical Prescription" maxWidth="max-w-3xl">
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Printer className="h-4 w-4" /> Print / Download PDF
        </button>
      </div>

      <div id="printable-content" className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-sm text-slate-800 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-sky-600 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 text-white rounded-2xl">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                {prescription.doctorId?.name || 'Dr. Specialist'}
              </h2>
              <p className="text-xs text-sky-600 font-bold">
                {prescription.doctorId?.profile?.specialization || prescription.doctorId?.doctorProfile?.specialization || 'Consultant Physician'}
              </p>
              <p className="text-[11px] text-slate-500">
                {prescription.doctorId?.profile?.qualification || prescription.doctorId?.doctorProfile?.qualification || 'MBBS, MD'} • Reg No: HT-MD-99421
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-extrabold text-slate-900">HealthTrack Medical Center</p>
            <p className="text-slate-500">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">Rx ID: #{prescription._id?.substring(16).toUpperCase()}</p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
            <span className="font-bold text-slate-900">{prescription.patientId?.name || 'Patient'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Gender / DOB</span>
            <span className="font-medium text-slate-700">{prescription.patientId?.gender || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Contact</span>
            <span className="font-medium text-slate-700">{prescription.patientId?.phone || 'N/A'}</span>
          </div>
        </div>

        {/* Diagnosis & Notes */}
        <div className="space-y-2">
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              <span className="text-sky-600 font-black text-sm mr-1">Rx</span> Clinical Diagnosis
            </span>
            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 text-xs font-bold text-sky-900">
              {prescription.diagnosis || 'General Consultation'}
            </div>
          </div>

          {prescription.notes && (
            <p className="text-xs text-slate-600 italic">Doctor Notes: "{prescription.notes}"</p>
          )}
        </div>

        {/* Medicines Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Pill className="h-4 w-4 text-sky-600" /> Prescribed Medications ({medicinesList.length})
          </h4>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Medicine Name</th>
                <th className="py-2 px-3">Dosage</th>
                <th className="py-2 px-3">Frequency</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicinesList.length > 0 ? (
                medicinesList.map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-extrabold text-slate-900">{med.medicineName || med.name}</td>
                    <td className="py-2 px-3 text-slate-700">{med.dosage}</td>
                    <td className="py-2 px-3 text-slate-700">{med.frequency}</td>
                    <td className="py-2 px-3 text-slate-700">{med.duration}</td>
                    <td className="py-2 px-3 text-slate-500 italic">{med.instructions}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">
                    No prescription has been generated for this consultation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Advice & Follow Up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {prescription.advice && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="font-bold text-amber-900 block mb-0.5">General Advice</span>
              <p className="text-amber-800 text-xs">{prescription.advice}</p>
            </div>
          )}

          {prescription.followUpDate && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-0.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Follow-Up Review Date
              </span>
              <p className="text-emerald-950 font-extrabold text-xs">
                {new Date(prescription.followUpDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Footer Signature */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Digitally Signed Medical Record • HealthTrack Platform
          </div>
          <div className="text-center">
            <div className="h-8 text-sky-800 font-serif italic text-base font-bold flex items-center justify-center">
              {prescription.doctorId?.name || 'Dr. Specialist'}
            </div>
            <p className="text-[10px] text-slate-500 font-bold border-t border-slate-300 pt-0.5 px-3">
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
