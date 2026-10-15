import React, { useEffect, useState } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import PrescriptionModal from '../../components/patient/PrescriptionModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Stethoscope, Eye, Pill } from 'lucide-react';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await prescriptionService.getMyPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading digital prescriptions..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Digital Prescriptions</h1>
        <p className="text-xs text-slate-500 mt-1">View official medical prescriptions issued by your consulting doctors.</p>
      </div>

      {prescriptions.length === 0 ? (
        <EmptyState
          title="No Prescriptions Issued"
          description="Prescriptions will be listed here after doctor consultations are completed."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{rx.doctorId?.name || 'Dr. Specialist'}</h3>
                    <span className="text-[10px] font-bold text-sky-600">
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs">
                  <p className="font-bold text-sky-900">Diagnosis: {rx.diagnosis}</p>
                  <p className="text-slate-600 flex items-center gap-1 mt-1">
                    <Pill className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{rx.medicines?.length || 0} Medications Prescribed</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPrescription(rx)}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Eye className="h-4 w-4" /> View Prescription PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Prescription PDF Modal */}
      <PrescriptionModal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        prescription={selectedPrescription}
      />
    </div>
  );
}
