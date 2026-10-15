import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import ReportModal from '../../components/patient/ReportModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileText, Eye, Printer, CheckCircle } from 'lucide-react';

export default function PatientReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading diagnostic lab reports..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Diagnostic Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Access verified pathology, blood test, and radiology reports.</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No Lab Reports Available"
          description="Your diagnostic reports will appear here once processed by the lab."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    (report.status === 'AVAILABLE' || report.status === 'Available') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{report.testName}</h3>
                <p className="text-xs text-slate-400 mt-1">Issued: {new Date(report.reportDate || report.createdAt).toLocaleDateString()}</p>
                <p className="text-[11px] text-slate-500 mt-2">Lab: {report.generatedBy}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {(report.status === 'AVAILABLE' || report.status === 'Available') ? (
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="h-4 w-4" /> View & Download PDF
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold italic">Report currently under lab processing...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report PDF Modal */}
      <ReportModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
