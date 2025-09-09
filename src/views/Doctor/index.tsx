import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import QueueDisplay from '../../components/common/QueueDisplay';
import PatientExamination from './PatientExamination';
import Card from '../../components/common/Card';
import { QueueItem } from '../../types';

const DoctorView: React.FC = () => {
  const { currentUser, getQueueForService, updateQueueStatus } = useAppContext();
  const [selectedPatient, setSelectedPatient] = useState<QueueItem | null>(null);
  
  if (!currentUser || currentUser.role !== 'doctor') return null;
  
  const doctorQueue = getQueueForService('doctor', currentUser.id);
  const currentPatient = doctorQueue.find(q => q.status === 'in-progress');
  
  const handleStartExamination = async (queueItem: QueueItem) => {
    await updateQueueStatus(queueItem.id, 'in-progress');
    setSelectedPatient(queueItem);
  };
  
  const handleCompleteExamination = () => {
    setSelectedPatient(null);
  };
  
  if (currentPatient || selectedPatient) {
    return (
      <PatientExamination 
        queueItem={selectedPatient || currentPatient!}
        onComplete={handleCompleteExamination}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
        <p className="text-gray-600">Manage patient consultations and referrals</p>
      </div>
      
      {doctorQueue.length > 0 ? (
        <Card title="Waiting Patients">
          <div className="space-y-4">
            {doctorQueue.map((queueItem) => (
              <div 
                key={queueItem.id} 
                className={`border rounded-lg p-4 ${
                  queueItem.priority === 'urgent' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{queueItem.patientName}</p>
                    <div className="flex items-center mt-1">
                      <span className={`text-lg font-bold ${
                        queueItem.priority === 'urgent' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {queueItem.ticketNumber}
                      </span>
                      {queueItem.priority === 'urgent' && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartExamination(queueItem)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Start Examination
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card title="Patient Queue">
          <div className="py-8 text-center">
            <p className="text-gray-500">No patients waiting in your queue</p>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Lab Results">
          <div className="py-8 text-center">
            <p className="text-gray-500">No recent lab results to display</p>
          </div>
        </Card>
        
        <Card title="Recent Patients">
          <div className="py-8 text-center">
            <p className="text-gray-500">No recent patients</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorView;