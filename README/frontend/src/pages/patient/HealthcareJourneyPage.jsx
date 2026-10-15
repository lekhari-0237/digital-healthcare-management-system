import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { appointmentService } from '../../services/appointmentService';
import { reportService } from '../../services/reportService';
import JourneyTimeline from '../../components/patient/JourneyTimeline';
import Loader from '../../components/common/Loader';
import { Compass, Calendar, TestTube, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function HealthcareJourneyPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadJourneyData = async () => {
      setLoading(true);
      try {
        const [b, a, r] = await Promise.all([
          bookingService.getMyBookings(),
          appointmentService.getMyAppointments(),
          reportService.getMyReports()
        ]);
        setBookings(b);
        setAppointments(a);
        setReports(r);
      } catch (err) {
        console.error('Error loading healthcare journey:', err);
      } finally {
        setLoading(false);
      }
    };
    loadJourneyData();
  }, []);

  if (loading) return <Loader label="Compiling complete healthcare journey timeline..." />;

  // Merge events into chronological activity feed
  const timelineEvents = [];

  bookings.forEach((b) => {
    timelineEvents.push({
      id: `booking-${b._id}`,
      type: 'BOOKING',
      title: `Diagnostic Test Booked: ${b.testId?.name || 'Test'}`,
      date: new Date(b.createdAt),
      status: b.status,
      details: `Slot: ${b.timeSlot} • Collection: ${b.collectionMethod}`,
      bookingObj: b
    });
  });

  appointments.forEach((a) => {
    timelineEvents.push({
      id: `apt-${a._id}`,
      type: 'APPOINTMENT',
      title: `Doctor Appointment: ${a.doctorId?.name || 'Doctor'}`,
      date: new Date(a.appointmentDate),
      status: a.status,
      details: `Type: ${a.appointmentType} • Slot: ${a.timeSlot}`,
      aptObj: a
    });
  });

  reports.forEach((r) => {
    timelineEvents.push({
      id: `report-${r._id}`,
      type: 'REPORT',
      title: `Diagnostic Report: ${r.testName}`,
      date: new Date(r.reportDate || r.createdAt),
      status: r.status,
      details: `Issued by: ${r.generatedBy}`
    });
  });

  // Sort descending by date
  timelineEvents.sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Compass className="h-6 w-6 text-sky-600" /> Complete Healthcare Journey Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological record of diagnostic test bookings, sample collection, report publications, and doctor consultations.
        </p>
      </div>

      {/* Active Booking Stage Card */}
      {bookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Current Diagnostic Booking Progress</h3>
          <JourneyTimeline booking={bookings[0]} report={reports.find((r) => r.testBookingId === bookings[0]._id)} />
        </div>
      )}

      {/* Complete Historical Activity Feed */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Complete Chronological Activity Log</h3>

        {timelineEvents.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">No healthcare activities recorded yet.</div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineEvents.map((ev) => (
              <div key={ev.id} className="relative flex items-start group">
                <div className="absolute -left-6 top-0 flex items-center justify-center h-6 w-6 rounded-full bg-sky-100 text-sky-600 text-xs font-bold">
                  {ev.type === 'BOOKING' && <TestTube className="h-3.5 w-3.5" />}
                  {ev.type === 'APPOINTMENT' && <Calendar className="h-3.5 w-3.5" />}
                  {ev.type === 'REPORT' && <FileText className="h-3.5 w-3.5" />}
                </div>

                <div className="ml-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full hover:bg-slate-100/60 transition">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{ev.date.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{ev.details}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px]">
                      Status: {ev.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
