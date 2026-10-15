import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Mail, Lock, LogIn, AlertCircle, User, Stethoscope, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialRole = (searchParams.get('role') || 'PATIENT').toUpperCase();
  const [activeTab, setActiveTab] = useState(initialRole === 'DOCTOR' ? 'DOCTOR' : initialRole === 'ADMIN' ? 'ADMIN' : 'PATIENT');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit mx-auto">
            <Activity className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {activeTab === 'DOCTOR' ? 'Doctor Portal Sign In' : activeTab === 'ADMIN' ? 'Admin Portal Sign In' : 'Patient Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'DOCTOR' 
              ? 'Access your consultation queue & digital prescriptions.' 
              : activeTab === 'ADMIN' 
              ? 'System management, payment approvals & doctor profiles.' 
              : 'Sign in to manage your appointments, reports & health journey.'}
          </p>
        </div>

        {/* Portal Role Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('PATIENT'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'PATIENT' ? 'bg-white text-sky-700 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="h-3.5 w-3.5" /> Patient
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('DOCTOR'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'DOCTOR' ? 'bg-white text-sky-700 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" /> Doctor
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('ADMIN'); setError(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'ADMIN' ? 'bg-white text-sky-700 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Admin
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {activeTab === 'DOCTOR' ? 'Doctor Email Address' : activeTab === 'ADMIN' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'DOCTOR' ? 'doctor@example.com' : activeTab === 'ADMIN' ? 'admin@healthtrack.demo' : 'patient@example.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Remember me</span>
            </label>
            <a 
              href="#forgot" 
              onClick={(e) => { 
                e.preventDefault(); 
                alert(`Forgot Password: Contact platform administration to reset account credentials.`); 
              }} 
              className="text-sky-600 hover:underline font-semibold"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            {loading ? 'Authenticating...' : `Sign In to ${activeTab === 'DOCTOR' ? 'Doctor Portal' : activeTab === 'ADMIN' ? 'Admin Portal' : 'Patient Portal'}`}
          </button>
        </form>

        {/* Footer Navigation: ONLY display "Register as Patient" for Patient Portal */}
        {activeTab === 'PATIENT' ? (
          <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 font-bold hover:underline">
              Register as Patient
            </Link>
          </div>
        ) : (
          <div className="text-center border-t border-slate-100 pt-4 text-xs text-slate-400 font-medium">
            {activeTab === 'DOCTOR' 
              ? 'Doctor accounts are authorized & managed by System Administrator.' 
              : 'Admin portal access requires system administrator credentials.'}
          </div>
        )}
      </div>
    </div>
  );
}
