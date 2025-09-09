import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { activeView, currentUser } = useAppContext();

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard';
      case 'patients':
        return 'Patient Management';
      case 'appointments':
        return 'Appointments';
      case 'queue':
        return 'Queue Management';
      case 'laboratory':
        return 'Laboratory Services';
      case 'pharmacy':
        return 'Pharmacy';
      case 'records':
        return 'Medical Records';
      case 'billing':
        return 'Billing & Payments';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between h-16">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 md:hidden"
        >
          <Menu className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center">
        <div className="relative mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="relative mr-4">
          <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;