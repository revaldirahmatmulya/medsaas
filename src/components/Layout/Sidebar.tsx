import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  Microscope, 
  Pill, 
  CreditCard, 
  Settings, 
  LogOut,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick, alert }) => {
  return (
    <div 
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-blue-100 text-blue-800' 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {alert && (
        <div className="ml-auto">
          <ShieldAlert className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { currentUser, activeView, setActiveView, logout } = useAppContext();

  if (!currentUser) return null;

  const getMenuItems = () => {
    const commonMenuItems = [
      { 
        icon: <Home className="h-5 w-5" />, 
        label: 'Dashboard', 
        view: 'dashboard',
        roles: ['admin', 'doctor', 'nurse', 'lab', 'pharmacy', 'cashier']
      },
      { 
        icon: <Users className="h-5 w-5" />, 
        label: 'Patients', 
        view: 'patients',
        roles: ['admin', 'doctor', 'nurse', 'cashier']
      },
      { 
        icon: <Calendar className="h-5 w-5" />, 
        label: 'Appointments', 
        view: 'appointments',
        roles: ['admin', 'doctor', 'nurse']
      },
      { 
        icon: <Clock className="h-5 w-5" />, 
        label: 'Queue Management', 
        view: 'queue',
        roles: ['admin', 'doctor', 'nurse', 'lab', 'pharmacy', 'cashier']
      },
      { 
        icon: <Microscope className="h-5 w-5" />, 
        label: 'Laboratory', 
        view: 'laboratory',
        roles: ['admin', 'doctor', 'lab']
      },
      { 
        icon: <Pill className="h-5 w-5" />, 
        label: 'Pharmacy', 
        view: 'pharmacy',
        roles: ['admin', 'doctor', 'pharmacy']
      },
      { 
        icon: <FileText className="h-5 w-5" />, 
        label: 'Medical Records', 
        view: 'records',
        roles: ['admin', 'doctor', 'nurse']
      },
      { 
        icon: <CreditCard className="h-5 w-5" />, 
        label: 'Billing', 
        view: 'billing',
        roles: ['admin', 'cashier']
      },
      { 
        icon: <Settings className="h-5 w-5" />, 
        label: 'Settings', 
        view: 'settings',
        roles: ['admin']
      },
    ];

    // Filter menu items based on user role
    return commonMenuItems.filter(item => item.roles.includes(currentUser.role));
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-800">MedSaaS</h1>
        <p className="text-sm text-gray-600 mt-1">Hospital Management</p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {getMenuItems().map((item) => (
            <SidebarItem 
              key={item.view}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.view}
              onClick={() => setActiveView(item.view)}
              alert={item.view === 'laboratory' && currentUser.role === 'doctor'} // Example alert condition
            />
          ))}
        </div>
      </div>

      <div className="p-5 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        </div>
        
        <SidebarItem 
          icon={<LogOut className="h-5 w-5" />}
          label="Logout"
          isActive={false}
          onClick={logout}
        />
      </div>
    </div>
  );
};

export default Sidebar;