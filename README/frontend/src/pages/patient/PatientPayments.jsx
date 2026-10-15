import React, { useEffect, useState } from 'react';
import { paymentService } from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { CreditCard, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PatientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getMyPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading payment receipts..." />;

  const filteredPayments = payments.filter((p) =>
    p.transactionId.toLowerCase().includes(filter.toLowerCase()) ||
    p.paymentMethod.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Payments & Receipts</h1>
          <p className="text-xs text-slate-500 mt-1">Academic sandbox transaction audit log and approval tracking.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Txn ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <EmptyState
          title="No Payments Submitted"
          description="There are no payment receipts matching your search."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                  <th className="py-3.5 px-4">Transaction / Ref ID</th>
                  <th className="py-3.5 px-4">Service Details</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Amount (₹)</th>
                  <th className="py-3.5 px-4 text-center">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{pay.transactionId}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {pay.bookingId ? `Diagnostic: ${pay.bookingId.testId?.name || 'Test'}` : `Doctor: ${pay.appointmentId?.doctorId?.name || 'Consultation'}`}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(pay.submittedAt || pay.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{pay.paymentMethod}</td>
                    <td className="py-3 px-4 font-extrabold text-sky-600">₹{pay.amount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] ${
                        pay.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        pay.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                        'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {pay.status === 'PENDING_ADMIN_APPROVAL' ? 'Pending Admin Approval' : pay.status}
                      </span>
                      {pay.status === 'REJECTED' && pay.adminReason && (
                        <p className="text-[10px] text-rose-600 mt-1 italic">Reason: "{pay.adminReason}"</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
