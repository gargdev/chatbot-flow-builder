import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { NodeType } from '../types/nodeTypes';

interface NodesPanelProps {
  isMobile: boolean;
  onMobileAddNode: () => void;
}

// Configuration for available node types (extensible)
const availableNodes = [
  {
    type: 'text' as NodeType,
    label: 'Message',
    icon: MessageCircle,
    description: 'Send a text message to the user',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
];

const NodesPanel: React.FC<NodesPanelProps> = ({ isMobile, onMobileAddNode }) => {
  // Handle drag start - set the node type in dataTransfer
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle mobile node addition
  const handleMobileNodeAdd = (nodeType: string) => {
    if (isMobile) {
      onMobileAddNode();
    }
  };
  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200 bg-gray-50`}>
        <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 flex items-center gap-2`}>
          <Plus size={20} />
          Nodes Panel
        </h2>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
          {isMobile ? 'Tap nodes to add them to your flow' : 'Drag and drop nodes to build your flow'}
        </p>
      </div>

      {/* Quick Tips Section */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-blue-50 border-b border-blue-200`}>
        <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-blue-900 mb-2`}>
          Quick Tips
        </h3>
        <ul className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800 space-y-1`}>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{isMobile ? 'Tap nodes to add them to the canvas' : 'Drag nodes from here to the canvas'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Connect nodes by dragging from handles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Click a node to edit its settings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Each source can have only one connection</span>
          </li>
        </ul>
      </div>

      {/* Available Nodes */}
      <div className={`flex-1 ${isMobile ? 'p-3 space-y-2' : 'p-4 space-y-3'} overflow-y-auto`}>
        {availableNodes.map((node) => {
          const IconComponent = node.icon;
          
          return (
            <div
              key={node.type}
              draggable={!isMobile}
              onDragStart={!isMobile ? (event) => onDragStart(event, node.type) : undefined}
              onClick={isMobile ? () => handleMobileNodeAdd(node.type) : undefined}
              className={`
                ${isMobile ? 'p-3 cursor-pointer' : 'p-4 cursor-grab active:cursor-grabbing'} 
                rounded-lg border-2 border-dashed
                transition-all duration-200 ${node.color}
              `}
            >
              <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-white rounded-md shadow-sm`}>
                  <IconComponent size={isMobile ? 16 : 20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-gray-800 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {node.label}
                  </h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed`}>
                    {node.description}
                  </p>
                </div>
                {isMobile && (
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                    <Plus size={14} className="text-blue-600" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Placeholder for future node types */}
        <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 opacity-50`}>
          <div className="text-center text-gray-500">
            <Plus size={isMobile ? 20 : 24} className="mx-auto mb-2 opacity-50" />
            <p className={`${isMobile ? 'text-xs' : 'text-sm'}`}>More node types coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;