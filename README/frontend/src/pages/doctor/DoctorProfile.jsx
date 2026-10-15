import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { Stethoscope, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DoctorProfile() {
  const { user, updateUserProfile } = useAuth();
  const docProfile = user?.doctorProfile || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: docProfile.specialization || '',
    qualification: docProfile.qualification || '',
    experience: docProfile.experience || 5,
    consultationFee: docProfile.consultationFee || 500,
    hospital: docProfile.hospital || 'HealthTrack Clinic',
    biography: docProfile.biography || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const updated = await doctorService.updateDoctor(user._id, formData);
      updateUserProfile({ doctorProfile: updated.profile, name: updated.name, phone: updated.phone });
      setLoading(false);
      setSuccess('Doctor profile updated successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Doctor Professional Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage public profile details, consultation fees, and qualifications.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=200'}
            alt="Doctor"
            className="h-20 w-20 rounded-full object-cover border-2 border-sky-500 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
            <p className="text-xs font-semibold text-sky-600">{docProfile.specialization || 'Medical Specialist'}</p>
            <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold text-[10px] rounded-md mt-1">
              DOCTOR ACCOUNT
            </span>
          </div>
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                name="qualification"
                required
                value={formData.qualification}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                required
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Biography</label>
            <textarea
              rows={3}
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving Profile...' : 'Save Doctor Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
