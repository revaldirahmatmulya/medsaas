import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import QueueDisplay from '../../components/common/QueueDisplay';
import { Pill, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const PharmacyView: React.FC = () => {
  const { currentUser, prescriptions } = useAppContext();
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  
  if (!currentUser || currentUser.role !== 'pharmacy') return null;

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const dispensedToday = prescriptions.filter(
    p => p.status === 'dispensed' && 
    new Date(p.date).toDateString() === new Date().toDateString()
  );

  const lowStockItems = [
    { name: 'Amoxicillin 500mg', quantity: 50, threshold: 100 },
    { name: 'Ibuprofen 400mg', quantity: 25, threshold: 75 },
    { name: 'Omeprazole 20mg', quantity: 30, threshold: 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h2>
        <p className="text-gray-600">Manage prescriptions and inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Pending Prescriptions" 
          icon={<Pill className="h-5 w-5 text-yellow-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{pendingPrescriptions.length}</div>
          <p className="text-gray-500">Prescriptions to dispense</p>
        </Card>

        <Card 
          title="Dispensed Today" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{dispensedToday.length}</div>
          <p className="text-gray-500">Completed prescriptions</p>
        </Card>

        <Card 
          title="Low Stock Items" 
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{lowStockItems.length}</div>
          <p className="text-gray-500">Items below threshold</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pending Prescriptions">
          <div className="space-y-4">
            {pendingPrescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Patient ID: {prescription.patientId}</h4>
                    <p className="text-sm text-gray-500">Doctor: {prescription.doctorId}</p>
                    <p className="text-sm text-gray-500">Date: {prescription.date}</p>
                  </div>
                  <StatusBadge status="pending" />
                </div>

                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Medications:</h5>
                  <ul className="space-y-2">
                    {prescription.medications.map((med) => (
                      <li key={med.id} className="text-sm">
                        <p className="font-medium text-gray-800">{med.name}</p>
                        <p className="text-gray-600">
                          {med.dosage} - {med.frequency} for {med.duration}
                        </p>
                        <p className="text-gray-500">Quantity: {med.quantity}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {prescription.notes && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{prescription.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {/* Handle verification */}}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Verify Stock
                  </button>
                  <button
                    onClick={() => {/* Handle dispensing */}}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Dispense
                  </button>
                </div>
              </div>
            ))}

            {pendingPrescriptions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No pending prescriptions
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <QueueDisplay 
            serviceType="pharmacy"
            showControls={true}
          />

          <Card 
            title="Inventory Alerts" 
            icon={<Package className="h-5 w-5 text-red-500" />}
          >
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Current stock: {item.quantity} units
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge 
                      status={item.quantity < item.threshold / 2 ? 'error' : 'warning'} 
                      label={item.quantity < item.threshold / 2 ? 'Critical' : 'Low'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Threshold: {item.threshold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyView;