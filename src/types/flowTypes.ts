/**
 * Flow Management Types
 * 
 * Defines interfaces for flow storage, metadata, and management
 */

export interface FlowMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}

export interface SavedFlow extends FlowMetadata {
  nodes: any[];
  edges: any[];
}

export interface FlowListItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}