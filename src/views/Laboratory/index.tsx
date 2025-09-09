import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import QueueDisplay from '../../components/common/QueueDisplay';
import { FlaskRound, Activity, ClipboardCheck } from 'lucide-react';
import LabResultForm from '../../components/forms/LabResultForm';
import StatusBadge from '../../components/common/StatusBadge';

const LaboratoryView: React.FC = () => {
  const { currentUser, labRequests } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  if (!currentUser || currentUser.role !== 'lab') return null;

  const pendingTests = labRequests.filter(req => req.status === 'pending');
  const inProgressTests = labRequests.filter(req => req.status === 'in-progress');
  const completedToday = labRequests.filter(
    req => req.status === 'completed' && 
    new Date(req.date).toDateString() === new Date().toDateString()
  );

  const handleStartTest = (requestId: string) => {
    setSelectedRequest(requestId);
  };

  if (selectedRequest) {
    const request = labRequests.find(req => req.id === selectedRequest);
    if (!request) return null;

    return (
      <LabResultForm
        labRequest={request}
        onSubmit={async () => {
          setSelectedRequest(null);
          // Refresh data would happen here
        }}
        onCancel={() => setSelectedRequest(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Laboratory Dashboard</h2>
        <p className="text-gray-600">Manage and process laboratory tests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Pending Tests" 
          icon={<FlaskRound className="h-5 w-5 text-yellow-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{pendingTests.length}</div>
          <p className="text-gray-500">Tests awaiting processing</p>
        </Card>

        <Card 
          title="In Progress" 
          icon={<Activity className="h-5 w-5 text-blue-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{inProgressTests.length}</div>
          <p className="text-gray-500">Tests being processed</p>
        </Card>

        <Card 
          title="Completed Today" 
          icon={<ClipboardCheck className="h-5 w-5 text-green-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">{completedToday.length}</div>
          <p className="text-gray-500">Tests completed today</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pending Test Requests">
          <div className="space-y-4">
            {pendingTests.map((request) => (
              <div 
                key={request.id} 
                className={`border rounded-lg p-4 ${
                  request.urgency === 'urgent' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Patient ID: {request.patientId}</h4>
                    <p className="text-sm text-gray-500">Doctor: {request.doctorId}</p>
                  </div>
                  <StatusBadge status={request.urgency} />
                </div>

                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Requested Tests:</h5>
                  <ul className="space-y-1">
                    {request.tests.map((test) => (
                      <li key={test.id} className="text-sm text-gray-600">
                        • {test.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {request.notes && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{request.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleStartTest(request.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Start Processing
                  </button>
                </div>
              </div>
            ))}

            {pendingTests.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No pending test requests
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <QueueDisplay 
            serviceType="lab"
            showControls={true}
          />

          <Card title="Recent Results">
            <div className="space-y-4">
              {completedToday.slice(0, 5).map((result) => (
                <div key={result.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Patient ID: {result.patientId}</p>
                      <p className="text-sm text-gray-500">Completed at {new Date(result.date).toLocaleTimeString()}</p>
                    </div>
                    <StatusBadge status="completed" />
                  </div>
                </div>
              ))}

              {completedToday.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No completed tests today
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryView;