import { User } from './User';
import { Patient } from './Patient';
import { Appointment } from './Appointment';
import { QueueItem } from './QueueItem';
import { LabRequest, LabResult, LabTest } from './Lab';
import { Prescription, Medication } from './Prescription';
import { Invoice, InvoiceItem } from './Invoice';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'lab' | 'pharmacy' | 'cashier';
  department?: string;
  specialization?: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone: string;
  email?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  registrationDate: string;
  isRegistered: boolean;
  medicalHistory?: MedicalRecord[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctorId: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'initial' | 'follow-up';
  notes?: string;
}

export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  serviceType: 'doctor' | 'pharmacy' | 'lab' | 'cashier';
  serviceId: string;
  ticketNumber: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  timestamp: string;
  estimatedWaitTime?: number;
  priority: 'normal' | 'urgent';
}

export interface LabTest {
  id: string;
  name: string;
  description?: string;
  normalRange?: string;
  price: number;
  unit?: string;
  category?: string;
}

export interface LabRequest {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  tests: LabTest[];
  urgency: 'routine' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  clinicalInfo?: string;
  diagnosis?: string;
  notes?: string;
  results?: LabResult[];
}

export interface LabResult {
  id: string;
  requestId: string;
  patientId: string;
  testId: string;
  testName: string;
  result: string;
  normalRange?: string;
  interpretation?: string;
  date: string;
  performedBy: string;
  verifiedBy?: string;
  status: 'pending' | 'completed' | 'verified';
  notes?: string;
  attachments?: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  route?: string;
  timing?: string;
  refills?: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  diagnosis?: string;
  allergies?: string[];
  notes?: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  dispensedBy?: string;
  dispensedDate?: string;
  pharmacyNotes?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'other';
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    coverage: number;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'consultation' | 'medication' | 'lab' | 'procedure' | 'other';
  reference?: string; // Reference to prescription, lab test, etc.
}

export type {
  User,
  Patient,
  MedicalRecord,
  Appointment,
  QueueItem,
  LabTest,
  LabRequest,
  LabResult,
  Medication,
  Prescription,
  Invoice,
  InvoiceItem,
};