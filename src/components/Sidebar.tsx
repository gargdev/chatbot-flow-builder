import React from 'react';
import { Node } from 'reactflow';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';

interface SidebarProps {
  selectedNode: Node | null;
  onUpdateNodeText: (nodeId: string, newText: string) => void;
  onBackToNodes: () => void;
  isMobile: boolean;
  onClose: () => void;
  onMobileAddNode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedNode, 
  onUpdateNodeText, 
  onBackToNodes,
  isMobile,
  onClose,
  onMobileAddNode
}) => {
  return (
    <div className={`
      bg-white shadow-lg h-full flex flex-col
      ${isMobile 
        ? 'w-full border-0' 
        : 'w-80 border-l border-gray-200'
      }
    `}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedNode ? 'Node Settings' : 'Add Nodes'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {selectedNode ? (
        <SettingsPanel 
          selectedNode={selectedNode}
          onUpdateNodeText={onUpdateNodeText}
          onBackToNodes={onBackToNodes}
          isMobile={isMobile}
        />
      ) : (
        <NodesPanel 
          isMobile={isMobile} 
          onMobileAddNode={onMobileAddNode}
        />
      )}
    </div>
  );
};

export default Sidebar;