import React, { useState, useEffect } from 'react';
import { testService } from '../../services/testService';
import TestBookingModal from '../../components/patient/TestBookingModal';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, TestTube, Clock, ShieldCheck, ArrowUpDown, Filter } from 'lucide-react';

export default function DiagnosticTestsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTest, setSelectedTest] = useState(null);

  const categories = [
    'All',
    'Hematology',
    'Diabetic Profile',
    'Cardiology',
    'Endocrinology',
    'Biochemistry',
    'Vitamins'
  ];

  useEffect(() => {
    fetchTests();
  }, [category, sortBy, sortOrder]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await testService.getTests({
        search: search || undefined,
        category: category === 'All' ? undefined : category,
        sortBy,
        sortOrder
      });
      setTests(data);
    } catch (err) {
      console.error('Error fetching diagnostic tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTests();
  };

  const handleBook = (test) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedTest(test);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostic Test Catalog</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Book certified diagnostic packages with home sample collection or clinic visits.</p>
      </div>

      {/* Filter and Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search diagnostic test name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  (category === cat || (cat === 'All' && !category))
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <Loader label="Loading diagnostic packages..." />
      ) : tests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 my-6">
          <p className="text-sm font-semibold text-slate-600">No diagnostic tests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {test.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-sky-600" /> {test.reportTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1">{test.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{test.description}</p>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs text-slate-600 mb-4">
                  <p><strong className="text-slate-800">Sample Required:</strong> {test.sampleType}</p>
                  <p><strong className="text-slate-800">Preparation:</strong> {test.preparation}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Package Price</span>
                  <span className="text-xl font-extrabold text-sky-600">₹{test.price}</span>
                </div>
                <button
                  onClick={() => handleBook(test)}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <TestTube className="h-4 w-4" /> Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <TestBookingModal
        isOpen={!!selectedTest}
        onClose={() => setSelectedTest(null)}
        test={selectedTest}
        onSuccess={() => navigate('/patient/test-bookings')}
      />
    </div>
  );
}
