import React, { useState } from 'react';
import { Clipboard, FlaskRound, Pill, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { useAppContext } from '../../context/AppContext';
import { QueueItem, Patient, LabTest } from '../../types';

interface PatientExaminationProps {
  queueItem: QueueItem;
  onComplete: () => void;
}

const PatientExamination: React.FC<PatientExaminationProps> = ({ 
  queueItem,
  onComplete 
}) => {
  const { getPatient, createLabRequest, createPrescription, addToQueue, updateQueueStatus } = useAppContext();
  const patient = getPatient(queueItem.patientId);
  
  const [activeTab, setActiveTab] = useState('examination');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  
  // Lab tests selection
  const [selectedLabTests, setSelectedLabTests] = useState<LabTest[]>([]);
  const [labNotes, setLabNotes] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>('routine');
  
  // Medication
  const [medications, setMedications] = useState([{ 
    id: '1', 
    name: '', 
    dosage: '', 
    frequency: '', 
    duration: '', 
    instructions: '', 
    quantity: 0 
  }]);
  
  if (!patient) {
    return <div>Patient not found</div>;
  }
  
  // Sample lab tests (in a real app, these would come from a database)
  const availableLabTests: LabTest[] = [
    { id: 'test1', name: 'Complete Blood Count (CBC)', description: 'Measures red and white blood cells, and platelets', price: 50 },
    { id: 'test2', name: 'Basic Metabolic Panel', description: 'Measures glucose, calcium, and electrolytes', price: 60 },
    { id: 'test3', name: 'Lipid Panel', description: 'Measures cholesterol levels', price: 70 },
    { id: 'test4', name: 'Urinalysis', description: 'Examines urine components', price: 40 },
    { id: 'test5', name: 'Thyroid Function', description: 'Measures thyroid hormones', price: 80 },
    { id: 'test6', name: 'HbA1c', description: 'Measures average blood glucose', price: 65 },
  ];
  
  const handleLabTestToggle = (test: LabTest) => {
    if (selectedLabTests.find(t => t.id === test.id)) {
      setSelectedLabTests(selectedLabTests.filter(t => t.id !== test.id));
    } else {
      setSelectedLabTests([...selectedLabTests, test]);
    }
  };
  
  const addMedication = () => {
    setMedications([
      ...medications, 
      { 
        id: `med${medications.length + 1}`,
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '', 
        quantity: 0 
      }
    ]);
  };
  
  const updateMedication = (index: number, field: string, value: string | number) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };
  
  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };
  
  const handleLabReferral = async () => {
    if (selectedLabTests.length === 0) {
      alert('Please select at least one lab test');
      return;
    }
    
    try {
      // Create lab request
      await createLabRequest({
        patientId: patient.id,
        doctorId: 'user1', // Current doctor ID would come from context
        tests: selectedLabTests,
        urgency,
        status: 'pending',
        notes: labNotes,
      });
      
      // Add patient to lab queue
      await addToQueue({
        patientId: patient.id,
        patientName: patient.name,
        serviceType: 'lab',
        serviceId: 'user4', // Lab technician ID
        ticketNumber: '', // Will be generated
        status: 'waiting',
        priority: urgency === 'urgent' ? 'urgent' : 'normal',
      });
      
      alert('Patient has been referred to the laboratory');
      setSelectedLabTests([]);
      setLabNotes('');
      setUrgency('routine');
    } catch (error) {
      console.error('Error referring to lab:', error);
      alert('Failed to refer patient to laboratory');
    }
  };
  
  const handlePharmacyReferral = async () => {
    // Validate medications
    const validMedications = medications.filter(med => med.name && med.dosage);
    
    if (validMedications.length === 0) {
      alert('Please add at least one medication with name and dosage');
      return;
    }
    
    try {
      // Create prescription
      await createPrescription({
        patientId: patient.id,
        doctorId: 'user1', // Current doctor ID
        medications: validMedications,
        notes: prescriptionDetails,
        status: 'pending',
      });
      
      // Add patient to pharmacy queue
      await addToQueue({
        patientId: patient.id,
        patientName: patient.name,
        serviceType: 'pharmacy',
        serviceId: 'user5', // Pharmacy ID
        ticketNumber: '', // Will be generated
        status: 'waiting',
        priority: 'normal',
      });
      
      alert('Prescription has been sent to pharmacy');
      setMedications([{ 
        id: '1', 
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '', 
        quantity: 0 
      }]);
      setPrescriptionDetails('');
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Failed to send prescription to pharmacy');
    }
  };
  
  const handleCompleteExamination = async () => {
    try {
      // Update the queue status
      await updateQueueStatus(queueItem.id, 'completed');
      
      // Add to cashier queue if needed
      await addToQueue({
        patientId: patient.id,
        patientName: patient.name,
        serviceType: 'cashier',
        serviceId: 'user6', // Cashier ID
        ticketNumber: '', // Will be generated
        status: 'waiting',
        priority: 'normal',
      });
      
      // Notify parent component
      onComplete();
    } catch (error) {
      console.error('Error completing examination:', error);
      alert('Failed to complete the examination');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card title="Patient Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{patient.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">MRN</p>
            <p className="font-medium">{patient.mrn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{patient.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium capitalize">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <StatusBadge status="in-progress" label="In Consultation" />
          </div>
        </div>
      </Card>
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'examination'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('examination')}
            >
              <div className="flex items-center">
                <Clipboard className="h-5 w-5 mr-2" />
                Examination
              </div>
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'lab'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('lab')}
            >
              <div className="flex items-center">
                <FlaskRound className="h-5 w-5 mr-2" />
                Lab Referral
              </div>
            </button>
            <button
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'prescription'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('prescription')}
            >
              <div className="flex items-center">
                <Pill className="h-5 w-5 mr-2" />
                Prescription
              </div>
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'examination' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Examination Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter patient examination notes..."
                />
              </div>
              
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter diagnosis..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleCompleteExamination}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Complete Examination
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'lab' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Laboratory Tests</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {availableLabTests.map((test) => (
                    <div key={test.id} className="border rounded-md p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-gray-500">{test.description}</p>
                        <p className="text-sm text-gray-700">Price: ${test.price}</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={!!selectedLabTests.find(t => t.id === test.id)}
                        onChange={() => handleLabTestToggle(test)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          value="routine"
                          checked={urgency === 'routine'}
                          onChange={() => setUrgency('routine')}
                        />
                        <span className="ml-2">Routine</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-red-600"
                          value="urgent"
                          checked={urgency === 'urgent'}
                          onChange={() => setUrgency('urgent')}
                        />
                        <span className="ml-2 text-red-600 font-medium">Urgent</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="labNotes" className="block text-sm font-medium text-gray-700 mb-2">
                      Notes for Laboratory
                    </label>
                    <textarea
                      id="labNotes"
                      value={labNotes}
                      onChange={(e) => setLabNotes(e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Additional instructions for the lab technician..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleLabReferral}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={selectedLabTests.length === 0}
                >
                  <FlaskRound className="h-5 w-5 mr-2" />
                  Refer to Laboratory
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'prescription' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Prescription Details</h3>
              
              {medications.map((med, index) => (
                <div key={med.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium">Medication #{index + 1}</h4>
                    {medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name
                      </label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Amoxicillin"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Twice daily"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={med.quantity}
                        onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 14"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Take with food"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div>
                <button
                  onClick={addMedication}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  + Add Another Medication
                </button>
              </div>
              
              <div>
                <label htmlFor="prescriptionDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="prescriptionDetails"
                  value={prescriptionDetails}
                  onChange={(e) => setPrescriptionDetails(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Additional instructions for the pharmacist..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handlePharmacyReferral}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Send to Pharmacy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientExamination;