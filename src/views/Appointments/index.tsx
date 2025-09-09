import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

const AppointmentsView: React.FC = () => {
  const { currentUser, appointments, patients } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  if (!currentUser) return null;

  const todayAppointments = appointments.filter(
    app => app.date === new Date().toISOString().split('T')[0]
  );

  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) > new Date()
  );

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <p className="text-gray-600">Manage and schedule patient appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Today's Schedule" 
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">
            {todayAppointments.length}
          </div>
          <p className="text-gray-500">Appointments today</p>
        </Card>

        <Card 
          title="Upcoming" 
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">
            {upcomingAppointments.length}
          </div>
          <p className="text-gray-500">Future appointments</p>
        </Card>

        <Card 
          title="Completed" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        >
          <div className="text-3xl font-bold text-gray-800">
            {appointments.filter(a => a.status === 'completed').length}
          </div>
          <p className="text-gray-500">Appointments completed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Schedule">
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {getPatientName(appointment.patientId)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Time: {appointment.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {appointment.type}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>

                {appointment.notes && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p className="font-medium">Notes:</p>
                    <p>{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Reschedule
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Start Consultation
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {todayAppointments.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No appointments scheduled for today
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Calendar">
            <div className="p-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </Card>

          <Card 
            title="Recent Patients" 
            icon={<Users className="h-5 w-5 text-blue-500" />}
          >
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      Last visit: {patient.registrationDate}
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Schedule
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsView;