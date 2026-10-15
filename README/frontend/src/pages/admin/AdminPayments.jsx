import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { paymentService } from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Transaction ID could not be verified.');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllPayments();
      setPayments(data);
    } catch (err) {
      console.error('Error fetching admin payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setMessage('');
    try {
      const res = await paymentService.approvePayment(id);
      setMessage(res.message || 'Payment approved! Appointment/Booking is now CONFIRMED.');
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving payment');
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingId) return;
    setMessage('');
    try {
      const res = await paymentService.rejectPayment(rejectingId, rejectReason);
      setMessage(res.message || 'Payment rejected.');
      setRejectingId(null);
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting payment');
    }
  };

  if (loading) return <Loader label="Loading global transaction ledger & approval queue..." />;

  const pendingPayments = payments.filter((p) => p.status === 'PENDING_ADMIN_APPROVAL');
  const approvedPayments = payments.filter((p) => p.status === 'APPROVED');
  const totalRevenue = approvedPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Academic Payment Verification Queue</h1>
          <p className="text-xs text-slate-500 mt-1">Review manual transaction IDs submitted by patients and authorize bookings.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] text-amber-600 font-bold uppercase block">Pending Approval</span>
            <span className="text-xl font-extrabold text-amber-600">{pendingPayments.length}</span>
          </div>
          <div className="text-right border-l border-slate-200 pl-6">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Approved Revenue</span>
            <span className="text-xl font-extrabold text-emerald-600">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No payment submissions found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className={`hover:bg-slate-50/60 ${p.status === 'PENDING_ADMIN_APPROVAL' ? 'bg-amber-50/40 font-semibold' : ''}`}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.transactionId}</td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{p.patientId?.name || 'Patient'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.bookingId ? `Diagnostic: ${p.bookingId.testId?.name || 'Test'}` : `Consultation: ${p.appointmentId?.doctorId?.name || 'Doctor'}`}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(p.submittedAt || p.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-extrabold text-sky-600">₹{p.amount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] ${
                        p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        p.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {p.status === 'PENDING_ADMIN_APPROVAL' ? 'PENDING APPROVAL' : p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {p.status === 'PENDING_ADMIN_APPROVAL' ? (
                        <>
                          <button
                            onClick={() => handleApprove(p._id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingId(p._id)}
                            className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg text-[10px] transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reject Payment Transaction</h3>
            <p className="text-xs text-slate-500">Provide a reason for rejecting this transaction ID. The patient will be notified.</p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
