import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { Plus, Trash2, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const specializationsList = [
    'General Physician',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'ENT Specialist',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Dentist',
    'Ophthalmologist',
    'Psychiatrist',
    'Other'
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: 'General Physician',
    qualification: 'MBBS, MD',
    experience: 5,
    consultationFee: 500,
    hospital: 'HealthTrack Multi-Specialty Hospital',
    biography: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await doctorService.createDoctor({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        specialization: formData.specialization,
        qualification: formData.qualification.trim(),
        experience: Number(formData.experience),
        consultationFee: Number(formData.consultationFee),
        hospital: formData.hospital.trim(),
        biography: formData.biography.trim()
      });

      setSuccess(`Doctor ${formData.name} created successfully! They can now log in with their email.`);
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        specialization: 'General Physician',
        qualification: 'MBBS, MD',
        experience: 5,
        consultationFee: 500,
        hospital: 'HealthTrack Multi-Specialty Hospital',
        biography: ''
      });
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating doctor account');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this doctor profile?')) return;
    try {
      await doctorService.deleteDoctor(id);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating doctor');
    }
  };

  if (loading) return <Loader label="Loading doctor directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Doctor Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Create new doctor accounts, assign specializations, and manage consultation fees.</p>
        </div>

        <button
          onClick={() => { setError(''); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="h-4 w-4" /> Add Specialist Doctor
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Doctor Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Experience</th>
                <th className="py-3.5 px-4">Consultation Fee</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No doctor accounts found in MongoDB. Click "Add Specialist Doctor" to create one.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900">{doc.name}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.email}</td>
                    <td className="py-3 px-4 font-semibold text-sky-600">{doc.profile?.specialization || 'General'}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.profile?.experience} Years</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">₹{doc.profile?.consultationFee}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeactivate(doc._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Deactivate Doctor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Doctor Account" maxWidth="max-w-2xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="priya.doctor@healthtrack.demo"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization *</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {specializationsList.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qualification *</label>
              <input
                type="text"
                required
                placeholder="e.g. MBBS, MD (Cardiology)"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
              <input
                type="text"
                required
                placeholder="+1 555-014-9900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Yrs)</label>
              <input
                type="number"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                required
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic</label>
            <input
              type="text"
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Biography / Profile Intro</label>
            <textarea
              rows={2}
              placeholder="Short bio..."
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
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
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Create Doctor Account
          </button>
        </form>
      </Modal>
    </div>
  );
}
