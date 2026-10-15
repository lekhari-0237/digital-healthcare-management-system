import React, { useState } from 'react';
import Modal from '../common/Modal';
import { appointmentService } from '../../services/appointmentService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, QrCode, Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DoctorBookingModal({ isOpen, onClose, doctor, onSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [reason, setReason] = useState('General Consultation');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState(null);

  if (!doctor) return null;

  const fee = doctor.profile?.consultationFee || 500;
  const timeSlots = ['09:30 AM', '10:30 AM', '11:30 AM', '03:00 PM', '04:30 PM', '06:00 PM'];

  // Step 1 -> Step 2: Reserve appointment in DB
  const handleReserveAppointment = async () => {
    setLoading(true);
    setError('');
    try {
      const apt = await appointmentService.createAppointment({
        doctorId: doctor._id,
        appointmentDate,
        timeSlot,
        appointmentType,
        reason
      });
      setCreatedAppointment(apt);
      setLoading(false);
      setStep(2); // Move to Payment verification step
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to reserve appointment.');
    }
  };

  // Step 2 -> Step 3: Submit Payment Transaction ID for Admin Verification
  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      setError('Please enter the Transaction / Reference ID provided by your UPI or banking app.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await paymentService.submitPayment({
        appointmentId: createdAppointment?._id,
        amount: fee,
        paymentMethod,
        transactionId: transactionId.trim()
      });
      setLoading(false);
      setStep(3); // Pending Admin Approval Success screen
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error submitting payment transaction for verification.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Schedule Appointment with ${doctor.name}`}>
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl border border-sky-100">
            <img
              src={doctor.profileImage || 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=200'}
              alt={doctor.name}
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h4 className="font-bold text-sky-950 text-sm">{doctor.name}</h4>
              <p className="text-xs font-medium text-sky-700">{doctor.profile?.specialization} • {doctor.profile?.qualification}</p>
              <p className="text-[11px] font-bold text-emerald-600 mt-1">₹{fee} Consultation Fee</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {['In-person', 'Online consultation'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition text-left ${
                    appointmentType === type
                      ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-200'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Visit</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe symptoms or purpose..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            disabled={loading}
            onClick={handleReserveAppointment}
            className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
          >
            {loading ? 'Reserving Slot...' : `Proceed to Academic Payment (₹${fee})`}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between"><span>Doctor:</span><span className="font-bold text-slate-800">{doctor.name}</span></div>
            <div className="flex justify-between"><span>Date & Slot:</span><span className="font-semibold">{appointmentDate} @ {timeSlot}</span></div>
            <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1.5 mt-1">
              <span>Amount Payable:</span>
              <span className="text-sky-600">₹{fee}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'Credit/Debit Card', 'Net Banking'].map((pm) => (
                <button
                  type="button"
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    paymentMethod === pm
                      ? 'border-sky-600 bg-sky-50 text-sky-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Academic UPI Direct Payment Details (Scanner removed) */}
          {paymentMethod === 'UPI' && (
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-center space-y-2">
              <div className="text-xs font-bold text-sky-950">Academic Sandbox UPI Direct Transfer</div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-sky-200 rounded-xl text-xs font-mono font-bold text-sky-700 shadow-2xs">
                <span>VPA / UPI ID:</span>
                <span className="text-sky-950 font-extrabold">healthtrack@upi</span>
              </div>
              <p className="text-[11px] text-slate-500">Send demo payment through your UPI app and copy your Transaction Reference ID below.</p>
            </div>
          )}

          {/* Transaction ID input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Transaction / Reference ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UPI/TXN-998877654321"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">Enter the transaction reference ID from your demo app.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              disabled={loading}
              onClick={handleSubmitPayment}
              className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {loading ? 'Submitting...' : 'Submit Payment for Admin Approval'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Clock className="h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Payment Submitted for Admin Approval!</h3>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-xs text-amber-900 max-w-sm mx-auto space-y-1">
            <p className="font-bold">Status: PENDING ADMIN APPROVAL</p>
            <p className="text-slate-600">Transaction ID: <span className="font-mono font-bold text-slate-800">{transactionId}</span></p>
            <p className="text-slate-500 pt-1 text-[11px]">
              Once the Admin reviews and approves your transaction, your appointment with Dr. {doctor.name} will be confirmed and visible to the doctor.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700 transition"
          >
            Done & View Status
          </button>
        </div>
      )}
    </Modal>
  );
}
