import React, { useState } from 'react';
import { MessageCircle, Plus, X } from 'lucide-react';

interface MobileDragHelperProps {
  onAddNode: (position: { x: number; y: number }) => void;
  isVisible: boolean;
  onClose: () => void;
}

const MobileDragHelper: React.FC<MobileDragHelperProps> = ({
  onAddNode,
  isVisible,
  onClose
}) => {
  const [isPlacing, setIsPlacing] = useState(false);

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!isPlacing) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left - 100, // Center the node
      y: event.clientY - rect.top - 50,
    };
    
    onAddNode(position);
    setIsPlacing(false);
    onClose();
  };

  const startPlacing = () => {
    setIsPlacing(true);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Node Addition Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex flex-col">
        {/* Instructions Header */}
        <div className="bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Add Node</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
          
          {!isPlacing ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Choose a node type to add to your flow:
              </p>
              
              {/* Node Type Selection */}
              <button
                onClick={startPlacing}
                className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <MessageCircle size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-800">Message Node</h4>
                    <p className="text-sm text-gray-600">Send a text message to the user</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Tap anywhere on the canvas below to place your node:
              </p>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <MessageCircle size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Ready to place Message Node</span>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div 
          className="flex-1 relative cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {isPlacing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-dashed border-blue-400">
                <div className="flex items-center gap-2 text-blue-600">
                  <Plus size={20} />
                  <span className="font-medium">Tap to place node</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDragHelper;