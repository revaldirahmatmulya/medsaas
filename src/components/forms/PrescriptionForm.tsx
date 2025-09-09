import React, { useState } from 'react';
import { Prescription, Medication } from '../../types';
import Card from '../common/Card';
import { Trash2 } from 'lucide-react';

interface PrescriptionFormProps {
  patientId: string;
  doctorId: string;
  diagnosis?: string;
  onSubmit: (prescription: Omit<Prescription, 'id' | 'date' | 'status'>) => Promise<void>;
  onCancel: () => void;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  patientId,
  doctorId,
  diagnosis,
  onSubmit,
  onCancel,
}) => {
  const [medications, setMedications] = useState<Omit<Medication, 'id'>[]>([{
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    quantity: 0,
    route: '',
    timing: '',
    refills: 0,
  }]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');

  const addMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 0,
      route: '',
      timing: '',
      refills: 0,
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate medications
    const invalidMedications = medications.some(
      med => !med.name || !med.dosage || !med.frequency || !med.duration
    );

    if (invalidMedications) {
      alert('Please fill in all required medication fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        patientId,
        doctorId,
        medications: medications.map((med, index) => ({
          ...med,
          id: `temp_${index}`, // Temporary ID, will be replaced by backend
        })),
        diagnosis,
        allergies: allergies.length > 0 ? allergies : undefined,
        notes: notes || undefined,
      });
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Prescription Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        {diagnosis && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700">Diagnosis</h4>
            <p className="mt-1 text-sm text-gray-600">{diagnosis}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medications</h3>
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">
                    Medication #{index + 1}
                  </h4>
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Route of Administration
                    </label>
                    <select
                      value={medication.route}
                      onChange={(e) => updateMedication(index, 'route', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select route</option>
                      <option value="oral">Oral</option>
                      <option value="topical">Topical</option>
                      <option value="injection">Injection</option>
                      <option value="inhalation">Inhalation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Frequency *
                    </label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., Twice daily"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timing
                    </label>
                    <input
                      type="text"
                      value={medication.timing}
                      onChange={(e) => updateMedication(index, 'timing', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g., After meals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={medication.quantity}
                      onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Refills
                    </label>
                    <input
                      type="number"
                      value={medication.refills}
                      onChange={(e) => updateMedication(index, 'refills', parseInt(e.target.value) || 0)}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Instructions
                    </label>
                    <textarea
                      value={medication.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Special instructions for this medication..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMedication}
              className="mt-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              + Add Another Medication
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter allergy..."
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Add
              </button>
            </div>

            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
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
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Prescription'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;