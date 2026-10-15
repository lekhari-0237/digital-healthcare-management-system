import React from 'react';
import Modal from '../common/Modal';
import { Activity, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, report }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const testParams = report.reportData || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Diagnostic Laboratory Report" maxWidth="max-w-3xl">
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
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 text-white rounded-2xl">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">HealthTrack Diagnostics</h2>
              <p className="text-xs font-bold text-sky-600">ACCREDITED PATHOLOGY LABORATORY</p>
              <p className="text-[10px] text-slate-400">ISO 15189 Certified Diagnostic Center</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
              <CheckCircle className="h-3.5 w-3.5" /> VERIFIED REPORT
            </span>
            <p className="text-xs text-slate-500 mt-1">Report ID: <strong className="text-slate-800">#{report._id?.substring(16).toUpperCase()}</strong></p>
            <p className="text-xs text-slate-500">Report Date: {new Date(report.reportDate || report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Patient & Test Info */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Patient Details</p>
            <p className="font-extrabold text-slate-900 text-sm">{report.patientId?.name || 'Demo Patient'}</p>
            <p className="text-slate-600">Gender/Age: {report.patientId?.gender || 'N/A'}</p>
            <p className="text-slate-600">Contact: {report.patientId?.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-1">Test Information</p>
            <p className="font-extrabold text-sky-700 text-sm">{report.testName}</p>
            <p className="text-slate-600">Lab Technician: {report.generatedBy || 'HealthTrack Diagnostic Lab'}</p>
            <p className="text-slate-600">Status: <strong className="text-emerald-600 font-bold">{report.status}</strong></p>
          </div>
        </div>

        {/* Diagnostic Parameters Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Biochemical Test Results</h4>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                <th className="py-2.5 px-3">Parameter Test Name</th>
                <th className="py-2.5 px-3 text-center">Observed Result</th>
                <th className="py-2.5 px-3 text-center">Unit</th>
                <th className="py-2.5 px-3 text-center">Reference Interval</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testParams.length > 0 ? (
                testParams.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{item.parameter}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-slate-900">{item.result}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{item.unit || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{item.referenceRange || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                        {item.status || 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">
                    No diagnostic result parameters reported.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clinical Interpretation */}
        {report.interpretation && (
          <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
            <span className="font-bold text-sky-900 block mb-0.5">Clinical Interpretation</span>
            <p className="text-sky-800 text-xs leading-relaxed">{report.interpretation}</p>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-400">
          <div className="space-y-0.5">
            <p className="flex items-center gap-1 text-slate-600 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-600" /> Authorized Pathologist Verification
            </p>
            <p className="italic text-slate-400">Academic Demo Laboratory Report — For Demonstration & Educational Purposes Only.</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-700">HealthTrack Diagnostics</p>
            <p>End of Report</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
