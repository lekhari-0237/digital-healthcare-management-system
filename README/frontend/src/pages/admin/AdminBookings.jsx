import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { TestTube, ArrowRight } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error loading admin test bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating booking status');
    }
  };

  if (loading) return <Loader label="Loading laboratory test bookings..." />;

  const statusOptions = ['Booked', 'Confirmed', 'Sample Collected', 'Processing', 'Report Generated', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Diagnostic Test Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Update lab processing stages and trigger real-time patient journey updates.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Diagnostic Test</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Current Stage Status</th>
                <th className="py-3.5 px-4 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">#{b._id?.substring(18)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{b.patientId?.name || 'Patient'}</td>
                  <td className="py-3 px-4 text-sky-700 font-semibold">{b.testId?.name}</td>
                  <td className="py-3 px-4 text-slate-600">{b.collectionMethod}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 rounded-full text-[10px]">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700 outline-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
