import React from 'react';
import { useAppContext } from '../../context/AppContext';

interface QueueDisplayProps {
  serviceType: 'doctor' | 'pharmacy' | 'lab' | 'cashier';
  serviceId?: string;
  showControls?: boolean;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({ 
  serviceType, 
  serviceId,
  showControls = false
}) => {
  const { getQueueForService, updateQueueStatus } = useAppContext();
  
  const queueItems = getQueueForService(serviceType, serviceId);
  
  const getServiceName = () => {
    switch (serviceType) {
      case 'doctor':
        return 'Doctor Consultation';
      case 'pharmacy':
        return 'Pharmacy';
      case 'lab':
        return 'Laboratory';
      case 'cashier':
        return 'Cashier';
      default:
        return 'Service';
    }
  };

  const handleNext = async (itemId: string) => {
    await updateQueueStatus(itemId, 'in-progress');
  };

  const handleComplete = async (itemId: string) => {
    await updateQueueStatus(itemId, 'completed');
  };

  const handleCancel = async (itemId: string) => {
    await updateQueueStatus(itemId, 'cancelled');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{getServiceName()} Queue</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {queueItems.length} Waiting
        </span>
      </div>

      {queueItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patients in queue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queueItems.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-lg p-4 ${
                item.status === 'in-progress' 
                  ? 'border-green-200 bg-green-50' 
                  : item.priority === 'urgent'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-xl font-bold ${
                    item.status === 'in-progress' 
                      ? 'text-green-600' 
                      : item.priority === 'urgent'
                        ? 'text-red-600'
                        : 'text-blue-600'
                  }`}>
                    {item.ticketNumber}
                  </span>
                  <p className="text-sm text-gray-600">{item.patientName}</p>
                </div>
                <div className="flex items-center">
                  {item.priority === 'urgent' && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      URGENT
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-0.5 rounded ${
                    item.status === 'waiting' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.status === 'waiting' ? 'Waiting' : 'In Progress'}
                  </span>
                </div>
              </div>

              {showControls && (
                <div className="mt-3 flex space-x-2 justify-end">
                  {item.status === 'waiting' && (
                    <button
                      onClick={() => handleNext(item.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      Next
                    </button>
                  )}
                  {item.status === 'in-progress' && (
                    <button
                      onClick={() => handleComplete(item.id)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(item.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueDisplay;