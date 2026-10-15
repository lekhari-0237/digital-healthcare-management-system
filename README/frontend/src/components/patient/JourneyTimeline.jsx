import React from 'react';
import { CheckCircle2, Clock, ShieldAlert, FileText, FlaskConical, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

export default function JourneyTimeline({ booking, report }) {
  const stages = [
    { key: 'BOOKED', label: 'BOOKING INITIATED', icon: Calendar, description: 'Diagnostic test slot reserved' },
    { key: 'PAYMENT_SUBMITTED', label: 'PAYMENT SUBMITTED', icon: DollarSign, description: 'Transaction ID submitted for verification' },
    { key: 'PAYMENT_APPROVED', label: 'PAYMENT APPROVED', icon: ShieldCheck, description: 'Admin verified payment & booking confirmed' },
    { key: 'SAMPLE_COLLECTED', label: 'SAMPLE COLLECTION', icon: FlaskConical, description: 'Sample collected at lab or home' },
    { key: 'PROCESSING', label: 'TEST PROCESSING', icon: Clock, description: 'Pathology lab biochemical processing' },
    { key: 'REPORT_GENERATED', label: 'REPORT GENERATED', icon: FileText, description: 'Pathologist verified diagnostic values' },
    { key: 'AVAILABLE', label: 'REPORT AVAILABLE', icon: CheckCircle2, description: 'Verified report published to patient portal' }
  ];

  const getActiveStageIndex = () => {
    if (!booking) return 0;
    const status = booking.status;
    const repStatus = report?.status;

    if (repStatus === 'AVAILABLE' || repStatus === 'Available' || status === 'COMPLETED' || status === 'Completed') return 6;
    if (status === 'REPORT_GENERATED' || status === 'Report Generated' || repStatus === 'GENERATED') return 5;
    if (status === 'PROCESSING' || status === 'Processing' || repStatus === 'PROCESSING') return 4;
    if (status === 'SAMPLE_COLLECTED' || status === 'Sample Collected') return 3;
    if (status === 'CONFIRMED' || status === 'Confirmed') return 2;
    if (status === 'PENDING_ADMIN_APPROVAL') return 1;
    return 0;
  };

  const activeIdx = getActiveStageIndex();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Healthcare Journey Dynamic Timeline</h4>
          <p className="text-xs text-slate-500">Real-time status progression for {booking?.testId?.name || 'Diagnostic Booking'}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-100 font-mono">
          Booking ID: #{booking?._id?.substring(18)}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative flex items-start group">
              <div
                className={`absolute -left-6 sm:-left-8 top-0 flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 scale-110'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted && !isCurrent ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
              </div>

              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <h5
                    className={`text-xs font-bold tracking-wide ${
                      isCurrent
                        ? 'text-sky-600'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h5>
                  {isCurrent && (
                    <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full animate-pulse">
                      Active Stage
                    </span>
                  )}
                  {isCompleted && !isCurrent && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
