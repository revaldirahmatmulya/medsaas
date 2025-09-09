import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import LoginView from './views/LoginView';
import Dashboard from './views/Dashboard';
import PatientList from './views/Patients/PatientList';
import QueueManagement from './views/Queue';
import DoctorView from './views/Doctor';
import LaboratoryView from './views/Laboratory';
import PharmacyView from './views/Pharmacy';
import AppointmentsView from './views/Appointments';

const AppContent: React.FC = () => {
  const { currentUser, activeView } = useAppContext();

  if (!currentUser) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'queue':
        return <QueueManagement />;
      case 'doctor':
        return <DoctorView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'pharmacy':
        return <PharmacyView />;
      case 'appointments':
        return <AppointmentsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;