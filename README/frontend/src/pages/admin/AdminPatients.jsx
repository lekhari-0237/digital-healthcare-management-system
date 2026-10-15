import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPatients({ search: search || undefined });
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminService.togglePatientStatus(id);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating patient status');
    }
  };

  if (loading) return <Loader label="Loading patient directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Patient Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">Search registered patients and manage access privileges.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sky-500"
          />
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4 text-center">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-slate-600">{p.email}</td>
                  <td className="py-3 px-4 text-slate-600">{p.phone}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 font-bold rounded-full text-[10px] ${
                      p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {p.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(p._id)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-xl border transition ${
                        p.isActive
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
