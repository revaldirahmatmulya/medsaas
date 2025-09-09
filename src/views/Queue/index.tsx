import React, { useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import QueueDisplay from '../../components/common/QueueDisplay';
import { useAppContext } from '../../context/AppContext';

const QueueManagement: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('current');
  
  if (!currentUser) return null;
  
  // Determine which queues to show based on user role
  const getServiceTypeForRole = (): ('doctor' | 'pharmacy' | 'lab' | 'cashier')[] => {
    switch (currentUser.role) {
      case 'doctor':
        return ['doctor'];
      case 'lab':
        return ['lab'];
      case 'pharmacy':
        return ['pharmacy'];
      case 'cashier':
        return ['cashier'];
      case 'admin':
      case 'nurse':
        return ['doctor', 'lab', 'pharmacy', 'cashier'];
      default:
        return ['doctor'];
    }
  };
  
  const serviceTypes = getServiceTypeForRole();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Queue Management</h2>
        <p className="text-gray-600">
          Manage and monitor patient queues across different services
        </p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('current')}
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Current Queue
              </div>
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Queue Overview
              </div>
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'current' ? (
        <div className="space-y-6">
          {serviceTypes.map((serviceType) => (
            <div key={serviceType}>
              {serviceType === 'doctor' && currentUser.role === 'doctor' ? (
                <QueueDisplay 
                  serviceType={serviceType} 
                  serviceId={currentUser.id}
                  showControls={true}
                />
              ) : (
                <QueueDisplay 
                  serviceType={serviceType}
                  showControls={currentUser.role === serviceType}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card 
            title="Doctor Consultation Queue" 
            icon={<Clock className="h-5 w-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <QueueDisplay serviceType="doctor" />
            </div>
          </Card>
          
          <Card 
            title="Laboratory Queue" 
            icon={<Clock className="h-5 w-5 text-purple-500" />}
          >
            <div className="space-y-4">
              <QueueDisplay serviceType="lab" />
            </div>
          </Card>
          
          <Card 
            title="Pharmacy Queue" 
            icon={<Clock className="h-5 w-5 text-green-500" />}
          >
            <div className="space-y-4">
              <QueueDisplay serviceType="pharmacy" />
            </div>
          </Card>
          
          <Card 
            title="Cashier Queue" 
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="space-y-4">
              <QueueDisplay serviceType="cashier" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;