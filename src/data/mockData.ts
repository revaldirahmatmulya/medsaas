import { 
  User, 
  Patient, 
  QueueItem, 
  Appointment, 
  LabRequest, 
  LabResult, 
  Prescription 
} from '../types';

// Mock Users
export const users: User[] = [
  {
    id: 'user1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'doctor',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
  },
  {
    id: 'user2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
  },
  {
    id: 'user3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    role: 'nurse',
    department: 'General Medicine',
  },
  {
    id: 'user4',
    name: 'Alex Kim',
    email: 'alex.kim@hospital.com',
    role: 'lab',
    department: 'Pathology',
  },
  {
    id: 'user5',
    name: 'Jessica Patel',
    email: 'jessica.patel@hospital.com',
    role: 'pharmacy',
    department: 'Pharmacy',
  },
  {
    id: 'user6',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@hospital.com',
    role: 'cashier',
    department: 'Finance',
  },
];

// Mock Patients
export const patients: Patient[] = [
  {
    id: 'patient1',
    mrn: 'MRN00001',
    name: 'John Smith',
    dateOfBirth: '1980-05-15',
    gender: 'male',
    address: '123 Main St, Anytown, US 12345',
    phone: '555-123-4567',
    email: 'john.smith@email.com',
    emergencyContact: {
      name: 'Mary Smith',
      phone: '555-765-4321',
      relationship: 'Spouse',
    },
    registrationDate: '2023-01-10',
    isRegistered: true,
  },
  {
    id: 'patient2',
    mrn: 'MRN00002',
    name: 'Emma Davis',
    dateOfBirth: '1992-08-22',
    gender: 'female',
    address: '456 Elm St, Anytown, US 12345',
    phone: '555-234-5678',
    email: 'emma.davis@email.com',
    emergencyContact: {
      name: 'Robert Davis',
      phone: '555-876-5432',
      relationship: 'Father',
    },
    registrationDate: '2023-02-15',
    isRegistered: true,
  },
  {
    id: 'patient3',
    mrn: 'MRN00003',
    name: 'David Wilson',
    dateOfBirth: '1975-11-30',
    gender: 'male',
    address: '789 Oak St, Anytown, US 12345',
    phone: '555-345-6789',
    registrationDate: '2023-03-20',
    isRegistered: true,
  },
];

// Mock Queue Items
export const queueItems: QueueItem[] = [
  {
    id: 'queue1',
    patientId: 'patient1',
    patientName: 'John Smith',
    serviceType: 'doctor',
    serviceId: 'user1',
    ticketNumber: 'A001',
    status: 'waiting',
    timestamp: '2023-05-01T09:00:00Z',
    estimatedWaitTime: 15,
    priority: 'normal',
  },
  {
    id: 'queue2',
    patientId: 'patient2',
    patientName: 'Emma Davis',
    serviceType: 'doctor',
    serviceId: 'user1',
    ticketNumber: 'A002',
    status: 'in-progress',
    timestamp: '2023-05-01T09:15:00Z',
    estimatedWaitTime: 0,
    priority: 'normal',
  },
  {
    id: 'queue3',
    patientId: 'patient3',
    patientName: 'David Wilson',
    serviceType: 'lab',
    serviceId: 'user4',
    ticketNumber: 'B001',
    status: 'waiting',
    timestamp: '2023-05-01T09:30:00Z',
    estimatedWaitTime: 20,
    priority: 'urgent',
  },
  {
    id: 'queue4',
    patientId: 'patient1',
    patientName: 'John Smith',
    serviceType: 'pharmacy',
    serviceId: 'user5',
    ticketNumber: 'C001',
    status: 'waiting',
    timestamp: '2023-05-01T10:00:00Z',
    estimatedWaitTime: 10,
    priority: 'normal',
  },
];

// Mock Appointments
export const appointments: Appointment[] = [
  {
    id: 'appt1',
    patientId: 'patient1',
    doctorId: 'user1',
    date: '2023-05-01',
    time: '09:00',
    status: 'in-progress',
    type: 'follow-up',
    notes: 'Follow-up for hypertension medication adjustment',
  },
  {
    id: 'appt2',
    patientId: 'patient2',
    doctorId: 'user1',
    date: '2023-05-01',
    time: '10:00',
    status: 'scheduled',
    type: 'initial',
    notes: 'Initial consultation for recurring headaches',
  },
  {
    id: 'appt3',
    patientId: 'patient3',
    doctorId: 'user2',
    date: '2023-05-01',
    time: '11:00',
    status: 'scheduled',
    type: 'follow-up',
    notes: 'Cardiac follow-up after medication change',
  },
];

// Mock Lab Requests
export const labRequests: LabRequest[] = [
  {
    id: 'lab1',
    patientId: 'patient1',
    doctorId: 'user1',
    date: '2023-05-01',
    tests: [
      {
        id: 'test1',
        name: 'Complete Blood Count',
        description: 'Measures red and white blood cells, and platelets',
        normalRange: 'Varies by component',
        price: 50,
      },
      {
        id: 'test2',
        name: 'Basic Metabolic Panel',
        description: 'Measures glucose, calcium, and electrolytes',
        normalRange: 'Varies by component',
        price: 60,
      },
    ],
    urgency: 'routine',
    status: 'in-progress',
    notes: 'Routine blood work for hypertension monitoring',
  },
  {
    id: 'lab2',
    patientId: 'patient3',
    doctorId: 'user2',
    date: '2023-05-01',
    tests: [
      {
        id: 'test3',
        name: 'Lipid Panel',
        description: 'Measures cholesterol levels',
        normalRange: 'Total Cholesterol: <200 mg/dL',
        price: 70,
      },
      {
        id: 'test4',
        name: 'Troponin',
        description: 'Cardiac marker for heart damage',
        normalRange: '<0.04 ng/mL',
        price: 80,
      },
    ],
    urgency: 'urgent',
    status: 'pending',
    notes: 'Check for cardiac markers',
  },
];

// Mock Lab Results
export const labResults: LabResult[] = [
  {
    id: 'result1',
    requestId: 'lab1',
    patientId: 'patient1',
    testId: 'test1',
    testName: 'Complete Blood Count',
    result: 'WBC: 7.5, RBC: 4.8, Hemoglobin: 14.2, Hematocrit: 42%, Platelets: 250',
    normalRange: 'WBC: 4.5-11.0, RBC: 4.5-5.9, Hemoglobin: 13.5-17.5, Hematocrit: 41-50%, Platelets: 150-450',
    interpretation: 'Within normal limits',
    date: '2023-05-01T11:30:00Z',
    performedBy: 'user4',
    status: 'completed',
  },
];

// Mock Prescriptions
export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'patient1',
    doctorId: 'user1',
    date: '2023-05-01',
    medications: [
      {
        id: 'med1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with food',
        quantity: 30,
      },
      {
        id: 'med2',
        name: 'Hydrochlorothiazide',
        dosage: '12.5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with food',
        quantity: 30,
      },
    ],
    notes: 'Continue current regimen and monitor blood pressure',
    status: 'pending',
  },
];