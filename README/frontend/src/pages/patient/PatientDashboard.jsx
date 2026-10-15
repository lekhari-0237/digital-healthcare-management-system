import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { bookingService } from '../../services/bookingService';
import { reportService } from '../../services/reportService';
import { paymentService } from '../../services/paymentService';
import JourneyTimeline from '../../components/patient/JourneyTimeline';
import ReportModal from '../../components/patient/ReportModal';
import Loader from '../../components/common/Loader';
import {
  Calendar,
  TestTube,
  FileText,
  CreditCard,
  Compass,
  ArrowRight,
  PlusCircle,
  Eye,
  Clock
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [testBookings, setTestBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [apts, bookings, reps, pays] = await Promise.all([
        appointmentService.getMyAppointments(),
        bookingService.getMyBookings(),
        reportService.getMyReports(),
        paymentService.getMyPayments()
      ]);
      setAppointments(apts || []);
      setTestBookings(bookings || []);
      setReports(reps || []);
      setPayments(pays || []);
    } catch (err) {
      console.error('Error fetching patient dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading patient portal metrics..." />;

  const upcomingApt = appointments.find(
    (a) => a.status === 'CONFIRMED' || a.status === 'Confirmed' || a.status === 'PENDING_ADMIN_APPROVAL'
  );
  const recentBooking = testBookings[0];
  const recentReport = reports[0];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-200">Patient Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome back, {user?.name}!</h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">Your healthcare journey is active and secure.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/tests"
            className="px-4 py-2.5 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Book Diagnostic Test
          </Link>
          <Link
            to="/doctors"
            className="px-4 py-2.5 bg-sky-700/60 hover:bg-sky-800 text-white font-bold text-xs rounded-xl border border-sky-400/40 backdrop-blur-md transition flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" /> Book Doctor Consultation
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Appointments</span>
            <span className="text-xl font-extrabold text-slate-800">{appointments.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TestTube className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Test Bookings</span>
            <span className="text-xl font-extrabold text-slate-800">{testBookings.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Available Reports</span>
            <span className="text-xl font-extrabold text-slate-800">
              {reports.filter((r) => r.status === 'AVAILABLE' || r.status === 'Available').length}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Payments Submitted</span>
            <span className="text-xl font-extrabold text-slate-800">{payments.length}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Compass className="h-5 w-5 text-sky-600" /> Active Healthcare Journey Timeline
            </h3>
            <Link to="/patient/healthcare-journey" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
              View Complete Timeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentBooking ? (
            <JourneyTimeline booking={recentBooking} report={recentReport} />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-500 text-xs">
              No diagnostic bookings yet. Reserve a test to start tracking!
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming appointment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 text-sm">Next Doctor Appointment</h4>
              <Link to="/patient/appointments" className="text-xs text-sky-600 font-bold hover:underline">View All</Link>
            </div>

            {upcomingApt ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={upcomingApt.doctorId?.profileImage || 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=100'}
                    alt="Doctor"
                    className="h-10 w-10 rounded-full object-cover border border-white"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{upcomingApt.doctorId?.name}</h5>
                    <p className="text-[11px] text-sky-600 font-semibold">{upcomingApt.appointmentType}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 flex justify-between border-t border-slate-200/60 pt-2">
                  <span>Date & Slot:</span>
                  <span className="font-bold text-slate-800">
                    {new Date(upcomingApt.appointmentDate).toLocaleDateString()} @ {upcomingApt.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 font-bold rounded text-[10px] ${
                    upcomingApt.status === 'CONFIRMED' || upcomingApt.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    {upcomingApt.status === 'PENDING_ADMIN_APPROVAL' ? 'Awaiting Admin Approval' : upcomingApt.status}
                  </span>
                  <Link to="/patient/appointments" className="text-xs font-bold text-sky-600 hover:underline">
                    Details →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming appointments scheduled.</p>
            )}
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 text-sm">Diagnostic Reports</h4>
              <Link to="/patient/reports" className="text-xs text-sky-600 font-bold hover:underline">All Reports</Link>
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reports available yet.</p>
            ) : (
              <div className="space-y-2.5">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-800">{rep.testName}</h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rep.reportDate || rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rep.status === 'AVAILABLE' || rep.status === 'Available' ? (
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" /> View
                      </button>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded">
                        {rep.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
