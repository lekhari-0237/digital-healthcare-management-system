import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import ReportModal from '../../components/patient/ReportModal';
import Loader from '../../components/common/Loader';
import { FileText, Eye, CheckCircle2 } from 'lucide-react';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllReports();
      setReports(data);
    } catch (err) {
      console.error('Error loading admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await reportService.updateReport(id, { status: 'AVAILABLE' });
      fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Error releasing report');
    }
  };

  if (loading) return <Loader label="Loading laboratory diagnostic reports..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Laboratory Report Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review diagnostic lab values and authorize publication to patient portal.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Report ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Test Name</th>
                <th className="py-3.5 px-4">Report Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">#{r._id?.substring(18)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.patientId?.name || 'Patient'}</td>
                  <td className="py-3 px-4 font-semibold text-sky-700">{r.testName}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(r.reportDate || r.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      (r.status === 'AVAILABLE' || r.status === 'Available') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedReport(r)}
                      className="px-2.5 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg hover:bg-sky-100"
                    >
                      Inspect Report
                    </button>
                    {(r.status !== 'AVAILABLE' && r.status !== 'Available') && (
                      <button
                        onClick={() => handlePublish(r._id)}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg shadow-sm hover:bg-emerald-700"
                      >
                        Publish to Patient
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ReportModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
