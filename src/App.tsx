import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  ConnectionMode,
  // getOutgoers,
  getIncomers,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TextNode from './components/TextNode';
import Sidebar from './components/Sidebar';
import FlowList from './components/FlowList';
import SaveFlowModal from './components/SaveFlowModal';
import MobileDragHelper from './components/MobileDragHelper';
import { NodeType } from './types/nodeTypes';
import { flowStorage } from './utils/flowStorage';
import { SavedFlow } from './types/flowTypes';

// Define custom node types for React Flow
const nodeTypes = {
  textNode: TextNode,
};

// Initial nodes and edges (empty flow)
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Unique ID generator for new nodes
let id = 1;
const getId = () => `node_${id++}`;

function App() {
  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // UI state management
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFlowList, setShowFlowList] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showMobileDragHelper, setShowMobileDragHelper] = useState(false);
  
  // Flow management state
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [currentFlowName, setCurrentFlowName] = useState<string>('Untitled Flow');
  const [currentFlowDescription, setCurrentFlowDescription] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');

  // Check for mobile screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
        setShowMobileDragHelper(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Track changes for unsaved changes detection
  React.useEffect(() => {
    const currentState = JSON.stringify({ nodes, edges });
    if (lastSavedState && currentState !== lastSavedState) {
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, lastSavedState]);

  // Load current flow on mount
  React.useEffect(() => {
    const savedFlowId = flowStorage.getCurrentFlowId();
    if (savedFlowId) {
      loadFlow(savedFlowId);
    } else {
      updateLastSavedState();
    }
  }, []);

  // Beforeunload event for unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateLastSavedState = () => {
    const currentState = JSON.stringify({ nodes, edges });
    setLastSavedState(currentState);
    setHasUnsavedChanges(false);
  };
  // Handle new connections between nodes
  const onConnect = useCallback((params: Edge | Connection) => {
    // Validate source handle connection limit (only one outgoing edge allowed)
    const sourceNode = nodes.find(node => node.id === params.source);
    if (sourceNode) {
      const outgoingEdges = edges.filter(edge => edge.source === params.source);
      if (outgoingEdges.length > 0) {
        // Remove existing outgoing edge before adding new one
        const newEdges = edges.filter(edge => edge.source !== params.source);
        setEdges(newEdges);
      }
    }

    // Add the new connection with custom styling
    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        stroke: '#3B82F6',
        strokeWidth: 2,
      }
    }, eds));
  }, [nodes, edges, setEdges]);

  // Handle drag and drop from the sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    // Get the node type from drag data
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    // Calculate position for the new node
    const position = {
      x: event.clientX - reactFlowBounds.left - 100, // Center the node
      y: event.clientY - reactFlowBounds.top - 50,
    };

    addNodeAtPosition(position);
  }, [setNodes]);

  // Add node at specific position (for both drag-drop and mobile)
  const addNodeAtPosition = useCallback((position: { x: number; y: number }) => {
    const newNode: Node = {
      id: getId(),
      type: 'textNode',
      position,
      data: { 
        text: 'Text Message',
        nodeType: 'text' as NodeType,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);
  // Handle node selection for settings panel
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle clicking on empty canvas (deselect node)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, []);

  // Handle back to nodes panel
  const handleBackToNodes = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update selected node's text content
  const updateNodeText = useCallback((nodeId: string, newText: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, text: newText } }
          : node
      )
    );
    
    // Update selected node state
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, text: newText } } : null);
    }
  }, [setNodes, selectedNode]);

  // Validate flow before saving
  const validateFlow = useCallback(() => {
    // Check if there are more than one nodes
    if (nodes.length > 1) {
      // Find nodes with empty target handles (no incoming edges)
      const nodesWithoutIncomingEdges = nodes.filter(node => {
        const incomers = getIncomers(node, nodes, edges);
        return incomers.length === 0;
      });

      // If more than one node has no incoming edges, show error
      if (nodesWithoutIncomingEdges.length > 1) {
        return 'Error: Cannot save flow. More than one node has empty target handles.';
      }
    }
    return null;
  }, [nodes, edges]);

  // Handle save button click
  const handleSaveClick = useCallback(() => {
    const validationError = validateFlow();
    if (validationError) {
      alert(validationError);
      return;
    }
    setShowSaveModal(true);
  }, [validateFlow]);

  // Save flow to localStorage
  const saveFlow = useCallback((name: string, description: string) => {
    try {
      const flowId = currentFlowId || flowStorage.generateId();
      const now = new Date().toISOString();
      
      const flowData: SavedFlow = {
        id: flowId,
        name,
        description,
        nodes,
        edges,
        createdAt: currentFlowId ? (flowStorage.getFlow(flowId)?.createdAt || now) : now,
        updatedAt: now,
        nodeCount: nodes.length,
        edgeCount: edges.length
      };
      
      flowStorage.saveFlow(flowData);
      flowStorage.setCurrentFlowId(flowId);
      
      setCurrentFlowId(flowId);
      setCurrentFlowName(name);
      setCurrentFlowDescription(description);
      updateLastSavedState();
      
      alert('Flow saved successfully!');
    } catch  {
      alert('Failed to save flow. Please try again.');
    }
  }, [currentFlowId, nodes, edges, updateLastSavedState]);

  // Load flow from localStorage
  const loadFlow = useCallback((flowId: string) => {
    const flow = flowStorage.getFlow(flowId);
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setCurrentFlowId(flow.id);
      setCurrentFlowName(flow.name);
      setCurrentFlowDescription(flow.description);
      flowStorage.setCurrentFlowId(flow.id);
      updateLastSavedState();
      setShowFlowList(false);
    }
  }, [setNodes, setEdges, updateLastSavedState]);

  // Create new flow
  const createNewFlow = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to create a new flow?');
      if (!confirmDiscard) return;
    }
    
    setNodes([]);
    setEdges([]);
    setCurrentFlowId(null);
    setCurrentFlowName('Untitled Flow');
    setCurrentFlowDescription('');
    setSelectedNode(null);
    flowStorage.setCurrentFlowId(null);
    updateLastSavedState();
    setShowFlowList(false);
  }, [hasUnsavedChanges, setNodes, setEdges, updateLastSavedState]);

  // Handle mobile add node
  const handleMobileAddNode = useCallback(() => {
    if (isMobile) {
      setShowMobileDragHelper(true);
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="h-screen flex relative">
      {/* Main Flow Area */}
      <div className={`flex-1 relative ${isMobile && (sidebarOpen || showFlowList) ? 'hidden' : ''}`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white shadow-lg border border-gray-200 rounded-lg" />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#e5e7eb"
          />
        </ReactFlow>
        
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          {/* Left Side - Mobile Menu & Flow Info */}
          <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg border border-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
            
            {/* Flow Name Display */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{currentFlowName}</span>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Flows List Button */}
            <button
              onClick={() => setShowFlowList(true)}
              className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-200 transition-colors duration-200 text-sm font-medium"
            >
              My Flows
            </button>
            
            {/* Save Button */}
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 font-medium text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-0 z-50 ${sidebarOpen && !showFlowList ? 'block' : 'hidden'}` 
          : 'w-80 relative'
        }
        ${showFlowList ? 'hidden' : ''}
      `}>
        <Sidebar 
          selectedNode={selectedNode}
          onUpdateNodeText={updateNodeText}
          onBackToNodes={handleBackToNodes}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
          onMobileAddNode={handleMobileAddNode}
        />
      </div>

      {/* Flow List */}
      <div className={`
        ${isMobile 
          ? `fixed inset-0 z-50 ${showFlowList ? 'block' : 'hidden'}` 
          : `w-80 relative ${showFlowList ? 'block' : 'hidden'}`
        }
      `}>
        <FlowList
          onSelectFlow={loadFlow}
          onCreateNew={createNewFlow}
          onClose={() => setShowFlowList(false)}
          isMobile={isMobile}
        />
      </div>

      {/* Save Flow Modal */}
      <SaveFlowModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveFlow}
        initialName={currentFlowName}
        initialDescription={currentFlowDescription}
        isUpdate={!!currentFlowId}
      />

      {/* Mobile Drag Helper */}
      <MobileDragHelper
        isVisible={showMobileDragHelper}
        onClose={() => setShowMobileDragHelper(false)}
        onAddNode={addNodeAtPosition}
      />
    </div>
  );
}

export default App;