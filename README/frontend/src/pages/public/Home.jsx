import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';
import { doctorService } from '../../services/doctorService';
import TestBookingModal from '../../components/patient/TestBookingModal';
import DoctorBookingModal from '../../components/patient/DoctorBookingModal';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  Calendar,
  TestTube,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Star,
  Users,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [popularTests, setPopularTests] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const tests = await testService.getTests();
        setPopularTests(tests.slice(0, 4));

        const docs = await doctorService.getDoctors();
        setSpecialists(docs.slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    };
    loadHomeData();
  }, []);

  const handleTestBook = (test) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTest(test);
  };

  const handleDoctorBook = (doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold">
                <Activity className="h-4 w-4 text-sky-400" />
                <span>Next-Gen Healthcare Management</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Your Healthcare Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">Simplified</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Book diagnostic tests, schedule appointments with top specialist doctors, manage payments, track laboratory report progress, and access digital prescriptions — all in one secure platform.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/tests"
                  className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <TestTube className="h-4 w-4" /> Book a Diagnostic Test
                </Link>
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition flex items-center gap-2"
                >
                  <Search className="h-4 w-4" /> Find a Specialist Doctor
                </Link>
              </div>

              {/* Stats Highlights */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800 text-slate-300">
                <div>
                  <h4 className="text-2xl font-extrabold text-white">50+</h4>
                  <p className="text-xs text-slate-400">Diagnostic Tests</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">25+</h4>
                  <p className="text-xs text-slate-400">Specialist Doctors</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-white">100%</h4>
                  <p className="text-xs text-slate-400">Secure & Confidential</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4">
                <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Instant Lab Reports</h4>
                    <p className="text-xs text-slate-300">Real-time status tracking & PDF download</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl">
                  <div className="p-3 bg-sky-500 text-white rounded-xl">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Doctor Consultations</h4>
                    <p className="text-xs text-slate-300">In-person & online Video consults</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl">
                  <div className="p-3 bg-purple-500 text-white rounded-xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dynamic Journey Tracker</h4>
                    <p className="text-xs text-slate-300">Stage by stage clinical timeline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How HealthTrack Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">Manage your complete digital health journey in 4 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Search & Select', desc: 'Browse certified diagnostic tests or find specialist doctors by category.', icon: Search },
            { step: '02', title: 'Book & Pay', desc: 'Choose your convenient date, slot, and collection method with mock payment.', icon: Calendar },
            { step: '03', title: 'Consult / Sample', desc: 'Visit lab center or consult your doctor online/in-person seamlessly.', icon: TestTube },
            { step: '04', title: 'Track & Download', desc: 'Track your report timeline and download verified digital prescriptions.', icon: FileCheck }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center relative group">
                <span className="absolute top-4 right-4 text-xs font-black text-slate-200 group-hover:text-sky-200 transition">{item.step}</span>
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Diagnostic Tests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/50 py-12 rounded-3xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular Diagnostic Packages</h2>
            <p className="text-xs text-slate-500 mt-1">Accredited laboratory tests with fast turn-around reports.</p>
          </div>
          <Link to="/tests" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            View All Tests <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTests.map((test) => (
            <div key={test._id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {test.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{test.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{test.description}</p>
                <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                  <p>Sample: <strong className="text-slate-700">{test.sampleType}</strong></p>
                  <p>Turnaround: <strong className="text-slate-700">{test.reportTime}</strong></p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Price</span>
                  <span className="text-base font-extrabold text-sky-600">₹{test.price}</span>
                </div>
                <button
                  onClick={() => handleTestBook(test)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Specialist Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Our Medical Specialists</h2>
            <p className="text-xs text-slate-500 mt-1">Consult with board-certified physicians and surgeons.</p>
          </div>
          <Link to="/doctors" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            View All Doctors <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialists.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={doc.profileImage}
                  alt={doc.name}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                  <p className="text-xs font-semibold text-sky-600">{doc.profile?.specialization}</p>
                  <p className="text-[11px] text-slate-400">{doc.profile?.experience} yrs exp • {doc.profile?.qualification}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {doc.profile?.rating || 4.9}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{doc.profile?.biography}</p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fee</span>
                  <span className="text-sm font-bold text-slate-800">₹{doc.profile?.consultationFee}</span>
                </div>
                <button
                  onClick={() => handleDoctorBook(doc)}
                  className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white font-bold text-xs rounded-xl transition"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose HealthTrack */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Why Choose HealthTrack?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Built for speed, privacy, accuracy, and patient empowerment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <ShieldCheck className="h-8 w-8 text-sky-400 mb-3" />
              <h3 className="text-base font-bold mb-2">Verified & Secure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">All medical data is protected with JWT token authentication and role-based data encryption.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <Clock className="h-8 w-8 text-emerald-400 mb-3" />
              <h3 className="text-base font-bold mb-2">Real-time Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Track your diagnostic sample collection, processing, and report publication live.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <Award className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="text-base font-bold mb-2">Certified Specialists</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Connect with highly qualified doctors across cardiology, pediatrics, general medicine, and orthopedics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Booking Modal */}
      <TestBookingModal
        isOpen={!!selectedTest}
        onClose={() => setSelectedTest(null)}
        test={selectedTest}
        onSuccess={() => navigate('/patient/test-bookings')}
      />

      {/* Doctor Booking Modal */}
      <DoctorBookingModal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
        onSuccess={() => navigate('/patient/appointments')}
      />
    </div>
  );
}
