import React, { useEffect, useState } from 'react';
import { testService } from '../../services/testService';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { Plus, Trash2, Edit, TestTube } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Biochemistry',
    description: '',
    price: 300,
    sampleType: 'Blood',
    preparation: 'Fasting 8-10 hours',
    reportTime: '24 Hours'
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await testService.getTests();
      setTests(data);
    } catch (err) {
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await testService.createTest(formData);
      setShowAddModal(false);
      fetchTests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating test');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this diagnostic test?')) return;
    try {
      await testService.deleteTest(id);
      fetchTests();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting test');
    }
  };

  if (loading) return <Loader label="Loading diagnostic catalog..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Diagnostic Tests Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Configure diagnostic packages, pricing, and report turnaround targets.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="h-4 w-4" /> Add Diagnostic Test
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <th className="py-3.5 px-4">Test Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Sample Type</th>
                <th className="py-3.5 px-4">Turnaround Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.map((test) => (
                <tr key={test._id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">{test.name}</td>
                  <td className="py-3 px-4 font-semibold text-sky-600">{test.category}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-800">₹{test.price}</td>
                  <td className="py-3 px-4 text-slate-600">{test.sampleType}</td>
                  <td className="py-3 px-4 text-slate-600">{test.reportTime}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Test Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Diagnostic Package">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Test Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sample Type</label>
              <input
                type="text"
                required
                value={formData.sampleType}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround Time</label>
              <input
                type="text"
                required
                value={formData.reportTime}
                onChange={(e) => setFormData({ ...formData, reportTime: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Save Diagnostic Test
          </button>
        </form>
      </Modal>
    </div>
  );
}
