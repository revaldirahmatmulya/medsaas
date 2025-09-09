import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  Patient,
  QueueItem,
  Appointment,
  LabRequest,
  LabResult,
  Prescription,
  Invoice
} from '../types';
import {
  users,
  patients,
  queueItems,
  appointments,
  labRequests,
  labResults,
  prescriptions
} from '../data/mockData';

interface AppContextProps {
  currentUser: User | null;
  patients: Patient[];
  queueItems: QueueItem[];
  appointments: Appointment[];
  labRequests: LabRequest[];
  labResults: LabResult[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  activeView: string;
  // User Management
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Patient Management  
  registerPatient: (patient: Omit<Patient, 'id' | 'registrationDate' | 'isRegistered'>) => Promise<Patient>;
  getPatient: (id: string) => Patient | undefined;
  // Queue Management
  addToQueue: (queueItem: Omit<QueueItem, 'id' | 'timestamp'>) => Promise<QueueItem>;
  updateQueueStatus: (id: string, status: QueueItem['status']) => Promise<boolean>;
  getQueueForService: (serviceType: QueueItem['serviceType'], serviceId?: string) => QueueItem[];
  // Lab Management
  createLabRequest: (request: Omit<LabRequest, 'id' | 'date'>) => Promise<LabRequest>;
  submitLabResults: (result: Omit<LabResult, 'id' | 'date'>) => Promise<LabResult>;
  getLabResultsForPatient: (patientId: string) => LabResult[];
  // Prescription Management
  createPrescription: (prescription: Omit<Prescription, 'id' | 'date'>) => Promise<Prescription>;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => Promise<boolean>;
  // Invoice Management
  createInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => Promise<Invoice>;
  updateInvoiceStatus: (id: string, status: Invoice['paymentStatus']) => Promise<boolean>;
  // View Management
  setActiveView: (view: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patientsData, setPatientsData] = useState<Patient[]>(patients);
  const [queueItemsData, setQueueItemsData] = useState<QueueItem[]>(queueItems);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>(appointments);
  const [labRequestsData, setLabRequestsData] = useState<LabRequest[]>(labRequests);
  const [labResultsData, setLabResultsData] = useState<LabResult[]>(labResults);
  const [prescriptionsData, setPrescriptionsData] = useState<Prescription[]>(prescriptions);
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');

  // User Management
  const login = async (email: string, password: string): Promise<boolean> => {
    // For demo purposes, just check if email exists and return the user
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  // Patient Management
  const registerPatient = async (
    patient: Omit<Patient, 'id' | 'registrationDate' | 'isRegistered'>
  ): Promise<Patient> => {
    const newPatient = {
      ...patient,
      id: `patient${patientsData.length + 1}`,
      mrn: `MRN${String(patientsData.length + 1).padStart(5, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      isRegistered: true,
    };
    
    setPatientsData(prev => [...prev, newPatient]);
    return newPatient;
  };

  const getPatient = (id: string): Patient | undefined => {
    return patientsData.find(p => p.id === id);
  };

  // Queue Management
  const addToQueue = async (
    queueItem: Omit<QueueItem, 'id' | 'timestamp'>
  ): Promise<QueueItem> => {
    const serviceType = queueItem.serviceType;
    const serviceQueues = queueItemsData.filter(q => q.serviceType === serviceType);
    
    // Generate ticket number based on service type and existing queue items
    const letter = serviceType === 'doctor' ? 'A' : serviceType === 'lab' ? 'B' : serviceType === 'pharmacy' ? 'C' : 'D';
    const number = String(serviceQueues.length + 1).padStart(3, '0');
    const ticketNumber = `${letter}${number}`;
    
    const newQueueItem = {
      ...queueItem,
      id: `queue${queueItemsData.length + 1}`,
      ticketNumber,
      timestamp: new Date().toISOString(),
      status: 'waiting' as const,
    };
    
    setQueueItemsData(prev => [...prev, newQueueItem]);
    return newQueueItem;
  };

  const updateQueueStatus = async (id: string, status: QueueItem['status']): Promise<boolean> => {
    setQueueItemsData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
    return true;
  };

  const getQueueForService = (serviceType: QueueItem['serviceType'], serviceId?: string): QueueItem[] => {
    return queueItemsData
      .filter(q => q.serviceType === serviceType && (!serviceId || q.serviceId === serviceId))
      .filter(q => q.status === 'waiting' || q.status === 'in-progress')
      .sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
  };

  // Lab Management
  const createLabRequest = async (
    request: Omit<LabRequest, 'id' | 'date'>
  ): Promise<LabRequest> => {
    const newRequest = {
      ...request,
      id: `lab${labRequestsData.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    
    setLabRequestsData(prev => [...prev, newRequest]);
    return newRequest;
  };

  const submitLabResults = async (
    result: Omit<LabResult, 'id' | 'date'>
  ): Promise<LabResult> => {
    const newResult = {
      ...result,
      id: `result${labResultsData.length + 1}`,
      date: new Date().toISOString(),
    };
    
    setLabResultsData(prev => [...prev, newResult]);
    return newResult;
  };

  const getLabResultsForPatient = (patientId: string): LabResult[] => {
    return labResultsData.filter(r => r.patientId === patientId);
  };

  // Prescription Management
  const createPrescription = async (
    prescription: Omit<Prescription, 'id' | 'date'>
  ): Promise<Prescription> => {
    const newPrescription = {
      ...prescription,
      id: `rx${prescriptionsData.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    
    setPrescriptionsData(prev => [...prev, newPrescription]);
    return newPrescription;
  };

  const updatePrescriptionStatus = async (id: string, status: Prescription['status']): Promise<boolean> => {
    setPrescriptionsData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
    return true;
  };

  // Invoice Management
  const createInvoice = async (
    invoice: Omit<Invoice, 'id' | 'date'>
  ): Promise<Invoice> => {
    const newInvoice = {
      ...invoice,
      id: `inv${invoicesData.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    
    setInvoicesData(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['paymentStatus']): Promise<boolean> => {
    setInvoicesData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, paymentStatus: status } : item
      )
    );
    return true;
  };

  const value = {
    currentUser,
    patients: patientsData,
    queueItems: queueItemsData,
    appointments: appointmentsData,
    labRequests: labRequestsData,
    labResults: labResultsData,
    prescriptions: prescriptionsData,
    invoices: invoicesData,
    activeView,
    // Methods
    login,
    logout,
    registerPatient,
    getPatient,
    addToQueue,
    updateQueueStatus,
    getQueueForService,
    createLabRequest,
    submitLabResults,
    getLabResultsForPatient,
    createPrescription,
    updatePrescriptionStatus,
    createInvoice,
    updateInvoiceStatus,
    setActiveView,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};