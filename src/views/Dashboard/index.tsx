import React from 'react';
import { Users, Clock, Calendar, CreditCard, Activity, UserCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import QueueDisplay from '../../components/common/QueueDisplay';
import { useAppContext } from '../../context/AppContext';

const Dashboard: React.FC = () => {
  const { currentUser, patients, queueItems, appointments } = useAppContext();
  
  if (!currentUser) return null;
  
  const getStats = () => {
    // For a real app, these would come from actual data processing
    return {
      totalPatients: patients.length,
      activeQueue: queueItems.filter(q => q.status === 'waiting' || q.status === 'in-progress').length,
      appointmentsToday: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      pendingPayments: 5,
      revenueToday: 2850,
      newPatients: 3
    };
  };
  
  const stats = getStats();
  
  const renderDoctorDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Today's Appointments" 
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.appointmentsToday}</div>
            <p className="text-gray-500">Total appointments today</p>
          </Card>
          
          <Card 
            title="Patients in Queue" 
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.activeQueue}</div>
            <p className="text-gray-500">Waiting for consultation</p>
          </Card>
          
          <Card 
            title="New Patients" 
            icon={<UserCheck className="h-5 w-5 text-green-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.newPatients}</div>
            <p className="text-gray-500">New registrations today</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QueueDisplay 
            serviceType="doctor" 
            serviceId={currentUser.id} 
            showControls={true}
          />
          
          <Card 
            title="Lab Results (Recent)" 
            icon={<Activity className="h-5 w-5 text-purple-500" />}
          >
            {/* This would display recent lab results */}
            <p className="text-gray-500 py-4 text-center">No recent lab results to display</p>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderLabDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title="Pending Lab Tests" 
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">8</div>
            <p className="text-gray-500">Tests awaiting processing</p>
          </Card>
          
          <Card 
            title="Completed Today" 
            icon={<Activity className="h-5 w-5 text-green-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">12</div>
            <p className="text-gray-500">Tests completed today</p>
          </Card>
        </div>
        
        <QueueDisplay 
          serviceType="lab"
          showControls={true}
        />
      </div>
    );
  };
  
  const renderPharmacyDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title="Pending Prescriptions" 
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">5</div>
            <p className="text-gray-500">Prescriptions to dispense</p>
          </Card>
          
          <Card 
            title="Dispensed Today" 
            icon={<Activity className="h-5 w-5 text-green-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">18</div>
            <p className="text-gray-500">Prescriptions completed today</p>
          </Card>
        </div>
        
        <QueueDisplay 
          serviceType="pharmacy"
          showControls={true}
        />
      </div>
    );
  };
  
  const renderCashierDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Today's Revenue" 
            icon={<CreditCard className="h-5 w-5 text-green-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">${stats.revenueToday}</div>
            <p className="text-gray-500">Total collections today</p>
          </Card>
          
          <Card 
            title="Pending Payments" 
            icon={<Clock className="h-5 w-5 text-yellow-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.pendingPayments}</div>
            <p className="text-gray-500">Invoices awaiting payment</p>
          </Card>
          
          <Card 
            title="New Patients" 
            icon={<Users className="h-5 w-5 text-blue-500" />}
          >
            <div className="text-3xl font-bold text-gray-800">{stats.newPatients}</div>
            <p className="text-gray-500">Registered today</p>
          </Card>
        </div>
        
        <QueueDisplay 
          serviceType="cashier"
          showControls={true}
        />
      </div>
    );
  };
  
  // Render different dashboards based on user role
  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'doctor':
        return renderDoctorDashboard();
      case 'lab':
        return renderLabDashboard();
      case 'pharmacy':
        return renderPharmacyDashboard();
      case 'cashier':
        return renderCashierDashboard();
      default:
        return renderDoctorDashboard(); // Default to doctor dashboard
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Welcome, {currentUser.name}
        </h2>
        <p className="text-gray-600">
          Here's what's happening today in your department
        </p>
      </div>
      
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;