import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Settings, ArrowLeft } from 'lucide-react';

interface SettingsPanelProps {
  selectedNode: Node;
  onUpdateNodeText: (nodeId: string, newText: string) => void;
  onBackToNodes: () => void;
  isMobile: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  selectedNode, 
  onUpdateNodeText,
  onBackToNodes,
  isMobile
}) => {
  const [textValue, setTextValue] = useState(selectedNode.data.text || '');

  // Update local state when selected node changes
  useEffect(() => {
    setTextValue(selectedNode.data.text || '');
  }, [selectedNode.data.text]);

  // Handle text input changes with real-time updates
  const handleTextChange = (newText: string) => {
    setTextValue(newText);
    onUpdateNodeText(selectedNode.id, newText);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200 bg-gray-50`}>
        <button
          onClick={onBackToNodes}
          className="flex items-center gap-2 mb-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Back to Nodes Panel</span>
        </button>
        <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 flex items-center gap-2`}>
          <Settings size={20} />
          Message Settings
        </h2>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
          Edit the selected node's properties
        </p>
      </div>

      {/* Quick Tips for Settings */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-green-50 border-b border-green-200`}>
        <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-green-900 mb-2`}>
          Editing Tips
        </h3>
        <ul className={`${isMobile ? 'text-xs' : 'text-sm'} text-green-800 space-y-1`}>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Changes are saved automatically</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Use clear, concise messages</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>Click outside to deselect node</span>
          </li>
        </ul>
        </div>

      {/* Settings Form */}
      <div className={`flex-1 ${isMobile ? 'p-3 space-y-4' : 'p-4 space-y-6'} overflow-y-auto`}>
        {/* Node Information */}
        <div className={`bg-blue-50 border border-blue-200 rounded-lg ${isMobile ? 'p-2' : 'p-3'}`}>
          <h3 className={`font-medium text-blue-900 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
            Selected Node
          </h3>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} space-y-1`}>
            <div className="flex justify-between">
              <span className="text-blue-700">Node ID:</span>
              <span className="text-blue-800 font-mono truncate ml-2">{selectedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Node Type:</span>
              <span className="text-blue-800 capitalize">{selectedNode.data.nodeType}</span>
            </div>
          </div>
        </div>

        {/* Text Content Editor */}
        <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
          <label className="block">
            <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 mb-2 block`}>
              Message Content
            </span>
            <textarea
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your message here..."
              className="
                w-full border border-gray-300 rounded-lg resize-none
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors duration-200
                ${isMobile ? 'p-2 text-sm' : 'p-3 text-base'}
              "
              rows={isMobile ? 3 : 4}
            />
          </label>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            This text will be displayed in the message node
          </p>
        </div>

        {/* Character Count */}
        <div className="text-right">
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {textValue.length} characters
          </span>
        </div>

        {/* Future Settings Sections */}
        <div className={`border-t border-gray-200 ${isMobile ? 'pt-3' : 'pt-4'}`}>
          <div className={`bg-gray-50 border border-gray-200 rounded-lg ${isMobile ? 'p-2' : 'p-3'} text-center`}>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
              Additional settings for different node types will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;