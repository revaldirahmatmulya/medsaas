import React, { useState } from 'react';
import { LabRequest, LabResult } from '../../types';
import Card from '../common/Card';

interface LabResultFormProps {
  labRequest: LabRequest;
  onSubmit: (results: Omit<LabResult, 'id' | 'date' | 'status'>[]) => Promise<void>;
  onCancel: () => void;
}

const LabResultForm: React.FC<LabResultFormProps> = ({
  labRequest,
  onSubmit,
  onCancel,
}) => {
  const [results, setResults] = useState<Record<string, {
    result: string;
    interpretation?: string;
    notes?: string;
  }>>(
    Object.fromEntries(
      labRequest.tests.map(test => [
        test.id,
        { result: '', interpretation: '', notes: '' }
      ])
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateResult = (
    testId: string,
    field: 'result' | 'interpretation' | 'notes',
    value: string
  ) => {
    setResults(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all tests have results
    const missingResults = labRequest.tests.some(
      test => !results[test.id].result.trim()
    );
    
    if (missingResults) {
      alert('Please provide results for all tests');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedResults = labRequest.tests.map(test => ({
        requestId: labRequest.id,
        patientId: labRequest.patientId,
        testId: test.id,
        testName: test.name,
        result: results[test.id].result,
        normalRange: test.normalRange,
        interpretation: results[test.id].interpretation,
        notes: results[test.id].notes,
        performedBy: 'user4', // Current lab technician ID
      }));

      await onSubmit(formattedResults);
    } catch (error) {
      console.error('Error submitting lab results:', error);
      alert('Failed to submit lab results');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Laboratory Results Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Patient Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Request ID: {labRequest.id}</p>
                <p>Urgency: {labRequest.urgency.toUpperCase()}</p>
                {labRequest.diagnosis && (
                  <p>Diagnosis: {labRequest.diagnosis}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {labRequest.tests.map((test) => (
          <div key={test.id} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{test.name}</h4>
            {test.description && (
              <p className="text-sm text-gray-500 mb-2">{test.description}</p>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Result *
                </label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={results[test.id].result}
                    onChange={(e) => updateResult(test.id, 'result', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  {test.unit && (
                    <span className="ml-2 inline-flex items-center px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      {test.unit}
                    </span>
                  )}
                </div>
                {test.normalRange && (
                  <p className="mt-1 text-sm text-gray-500">
                    Normal range: {test.normalRange}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interpretation
                </label>
                <textarea
                  value={results[test.id].interpretation}
                  onChange={(e) => updateResult(test.id, 'interpretation', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter result interpretation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={results[test.id].notes}
                  onChange={(e) => updateResult(test.id, 'notes', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
          </div>
        ))}

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
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Results'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default LabResultForm;