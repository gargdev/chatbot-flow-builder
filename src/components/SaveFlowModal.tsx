import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface SaveFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  isUpdate?: boolean;
}

/**
 * Save Flow Modal Component
 * 
 * Features:
 * - Flow name and description input
 * - Validation for required fields
 * - Support for both new saves and updates
 */
const SaveFlowModal: React.FC<SaveFlowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialDescription = '',
  isUpdate = false
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSave = () => {
    const newErrors: { name?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Flow name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(name.trim(), description.trim());
    handleClose();
  };

  const handleClose = () => {
    setName(initialName);
    setDescription(initialDescription);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Save size={20} />
            {isUpdate ? 'Update Flow' : 'Save Flow'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Flow Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flow Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              placeholder="Enter flow name..."
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Flow Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter flow description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            {isUpdate ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveFlowModal;