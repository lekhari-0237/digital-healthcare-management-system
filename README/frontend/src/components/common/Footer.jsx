import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="p-2 bg-sky-500 text-white rounded-xl">
                <Activity className="h-5 w-5" />
              </div>
              <span>HealthTrack</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Your Complete Digital Healthcare Journey. Book tests, consult expert doctors, track laboratory reports, and access prescriptions seamlessly.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> HIPAA Compliant & Secure Data Encryption
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Healthcare Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/tests" className="hover:text-sky-400 transition">Diagnostic Test Booking</Link></li>
              <li><Link to="/doctors" className="hover:text-sky-400 transition">Find Specialist Doctors</Link></li>
              <li><Link to="/tests?category=Diabetic%20Profile" className="hover:text-sky-400 transition">Diabetic Health Check</Link></li>
              <li><Link to="/tests?category=Cardiology" className="hover:text-sky-400 transition">Cardiology Diagnostics</Link></li>
              <li><Link to="/doctors?specialization=General%20Physician" className="hover:text-sky-400 transition">General Consultations</Link></li>
            </ul>
          </div>

          {/* Patient Portal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Patient Portal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/patient/dashboard" className="hover:text-sky-400 transition">Patient Dashboard</Link></li>
              <li><Link to="/patient/healthcare-journey" className="hover:text-sky-400 transition">Healthcare Journey Tracker</Link></li>
              <li><Link to="/patient/reports" className="hover:text-sky-400 transition">Diagnostic Reports</Link></li>
              <li><Link to="/patient/prescriptions" className="hover:text-sky-400 transition">Digital Prescriptions</Link></li>
              <li><Link to="/patient/payments" className="hover:text-sky-400 transition">Payment Receipts</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Emergency & Contact</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <span>+1 800-555-HEALTH (24/7 Helpline)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <span>support@healthtrack.demo</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>HealthTrack Medical Center, 500 Digital Ave, Tech City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HealthTrack Digital Healthcare Platform. Full Stack Academic Project.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Built with</span> <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> <span>using MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
