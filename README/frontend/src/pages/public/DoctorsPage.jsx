import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import DoctorBookingModal from '../../components/patient/DoctorBookingModal';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Calendar, Filter, MapPin, Award } from 'lucide-react';

export default function DoctorsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const specializations = [
    'All',
    'General Physician',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'ENT Specialist',
    'Dermatologist',
    'Cardiologist',
    'Neurologist'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctors({
        search: search || undefined,
        specialization: specialization === 'All' ? undefined : specialization
      });
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBook = (doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedDoctor(doctor);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Specialist Doctors</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Book in-person or online video consultations with top certified physicians.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialization(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                (specialization === spec || (spec === 'All' && !specialization))
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <Loader label="Loading specialist doctors catalog..." />
      ) : doctors.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 my-6">
          <p className="text-sm font-semibold text-slate-600">No doctors match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doctor.name}</h3>
                    <span className="inline-block text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md mt-0.5">
                      {doctor.profile?.specialization}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {doctor.profile?.rating || 4.9}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>{doctor.profile?.qualification} ({doctor.profile?.experience} Years Exp)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{doctor.profile?.hospital || 'HealthTrack Clinic'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{doctor.profile?.biography}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
                  <span className="text-base font-extrabold text-sky-600">₹{doctor.profile?.consultationFee}</span>
                </div>
                <button
                  onClick={() => handleBook(doctor)}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" /> Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <DoctorBookingModal
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
        onSuccess={() => navigate('/patient/appointments')}
      />
    </div>
  );
}
