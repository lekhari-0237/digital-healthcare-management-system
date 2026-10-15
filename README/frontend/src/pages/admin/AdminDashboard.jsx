import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import {
  Users,
  Stethoscope,
  TestTube,
  Calendar,
  CreditCard,
  FileCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading administrative analytics dashboard..." />;

  const { stats, revenueByMonth, appointmentStatusCounts } = data || {};

  const pieData = Object.keys(appointmentStatusCounts || {}).map((key) => ({
    name: key,
    value: appointmentStatusCounts[key]
  }));

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">System Management</span>
          <h1 className="text-3xl font-extrabold mt-1">Admin Executive Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time health platform operational metrics and revenue analysis.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Registered Patients</span>
            <span className="text-2xl font-extrabold text-slate-800">{stats?.totalPatients}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Doctors</span>
            <span className="text-2xl font-extrabold text-slate-800">{stats?.totalDoctors}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TestTube className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Diagnostic Catalog</span>
            <span className="text-2xl font-extrabold text-slate-800">{stats?.totalTests}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Revenue</span>
            <span className="text-2xl font-extrabold text-emerald-600">₹{stats?.totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue & Volume Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-600" /> Monthly Revenue & Booking Trends (₹)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0284c7" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
                <Bar dataKey="appointments" fill="#10b981" radius={[6, 6, 0, 0]} name="Appointments" />
                <Bar dataKey="testBookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Test Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointment Status Distribution Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-600" /> Appointment Status Ratio
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 font-semibold">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
