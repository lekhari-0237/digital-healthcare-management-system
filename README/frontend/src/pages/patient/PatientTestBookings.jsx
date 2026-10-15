import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { TestTube, Calendar, Clock, MapPin } from 'lucide-react';

export default function PatientTestBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching test bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading diagnostic bookings..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Diagnostic Test Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Track status of home sample collections and lab diagnostic requests.</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No Diagnostic Bookings"
          description="You haven't requested any diagnostic packages yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md uppercase">
                    {booking.testId?.category || 'Diagnostic'}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{booking.testId?.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">#{booking._id?.substring(18)}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-600" />
                  <span>Date: <strong className="text-slate-800">{new Date(booking.bookingDate).toLocaleDateString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-sky-600" />
                  <span>Slot: <strong className="text-slate-800">{booking.timeSlot}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" />
                  <span>Method: <strong className="text-slate-800">{booking.collectionMethod}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  booking.status === 'CONFIRMED' || booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                  booking.status === 'PENDING_ADMIN_APPROVAL' ? 'bg-amber-100 text-amber-800' :
                  'bg-sky-50 text-sky-800'
                }`}>
                  Status: {booking.status === 'PENDING_ADMIN_APPROVAL' ? 'Awaiting Admin Approval' : booking.status}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Fee: ₹{booking.testId?.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
