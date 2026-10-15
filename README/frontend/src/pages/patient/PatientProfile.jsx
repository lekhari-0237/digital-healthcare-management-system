import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { User, Save, CheckCircle2, AlertCircle, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function PatientProfile() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || 'Prefer not to say',
    address: user?.address || '',
    profileImage: user?.profileImage || '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const updated = await authService.updatePatientProfile(formData);
      updateUserProfile(updated);
      setLoading(false);
      setSuccess('Profile and credentials updated successfully!');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Patient Personal Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your demographic details, login credentials, and contact information.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={formData.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border-2 border-sky-500 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 font-bold text-[10px] rounded-md mt-1">
              PATIENT ACCOUNT
            </span>
          </div>
        </div>

        {/* Account Credentials & Sign-In Details Section */}
        <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sky-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-600" /> Patient Sign-In & Login Credentials
            </h4>
            <span className="text-[10px] font-extrabold text-sky-700 bg-white border border-sky-200 px-2 py-0.5 rounded-md shadow-2xs">
              Registered Credentials
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Created Email ID (Sign-In Username)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-800 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password || '••••••••'}
                  onChange={handleChange}
                  placeholder="Enter new password to change"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-sky-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            This Email ID and Password were created during sign up and are used to log in to your patient account. Leave password blank unless you wish to change it.
          </p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
            <textarea
              rows={2}
              name="address"
              value={formData.address}
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
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
