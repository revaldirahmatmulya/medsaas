import React from 'react';

type StatusType = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'pending' 
  | 'completed' 
  | 'cancelled'
  | 'in-progress'
  | 'urgent';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  // Default styles
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  // Custom label based on status
  let displayLabel = label || status;
  
  switch (status) {
    case 'success':
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      displayLabel = label || 'Completed';
      break;
    case 'warning':
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      displayLabel = label || 'Pending';
      break;
    case 'error':
    case 'cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      displayLabel = label || 'Cancelled';
      break;
    case 'info':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      displayLabel = label || 'Information';
      break;
    case 'in-progress':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      displayLabel = label || 'In Progress';
      break;
    case 'urgent':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      displayLabel = label || 'Urgent';
      break;
  }
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {displayLabel}
    </span>
  );
};

export default StatusBadge;