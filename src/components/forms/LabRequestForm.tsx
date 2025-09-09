import React, { useState } from 'react';
import { LabTest, LabRequest } from '../../types';
import Card from '../common/Card';

interface LabRequestFormProps {
  patientId: string;
  doctorId: string;
  availableTests: LabTest[];
  onSubmit: (request: Omit<LabRequest, 'id' | 'date' | 'status'>) => Promise<void>;
  onCancel: () => void;
}

const LabRequestForm: React.FC<LabRequestFormProps> = ({
  patientId,
  doctorId,
  availableTests,
  onSubmit,
  onCancel,
}) => {
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [clinicalInfo, setClinicalInfo] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>('routine');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestToggle = (test: LabTest) => {
    if (selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        patientId,
        doctorId,
        tests: selectedTests,
        urgency,
        clinicalInfo,
        diagnosis,
        notes,
      });
    } catch (error) {
      console.error('Error submitting lab request:', error);
      alert('Failed to submit lab request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Laboratory Request Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Laboratory Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTests.map((test) => (
              <div key={test.id} className="border rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={!!selectedTests.find(t => t.id === test.id)}
                      onChange={() => handleTestToggle(test)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="font-medium text-gray-700">{test.name}</label>
                    {test.description && (
                      <p className="text-sm text-gray-500">{test.description}</p>
                    )}
                    {test.normalRange && (
                      <p className="text-sm text-gray-500">Normal range: {test.normalRange}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Urgency</label>
          <div className="mt-2 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="routine"
                checked={urgency === 'routine'}
                onChange={(e) => setUrgency(e.target.value as 'routine')}
                className="h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2">Routine</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="urgent"
                checked={urgency === 'urgent'}
                onChange={(e) => setUrgency(e.target.value as 'urgent')}
                className="h-4 w-4 text-red-600 border-gray-300"
              />
              <span className="ml-2 text-red-600">Urgent</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="clinicalInfo" className="block text-sm font-medium text-gray-700">
            Clinical Information
          </label>
          <textarea
            id="clinicalInfo"
            value={clinicalInfo}
            onChange={(e) => setClinicalInfo(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter relevant clinical information..."
          />
        </div>

        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
            Provisional Diagnosis
          </label>
          <textarea
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter provisional diagnosis..."
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Any additional notes or instructions..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || selectedTests.length === 0}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default LabRequestForm;