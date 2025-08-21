/**
 * Node Types Definition
 * 
 * This file defines all available node types in the flow builder.
 * Adding new types here makes them available throughout the application.
 */

// Currently supported node types
export type NodeType = 'text';

// Future node types can be added here:
// export type NodeType = 'text' | 'input' | 'condition' | 'action';

// Node data interface for type safety
export interface NodeData {
  text: string;
  nodeType: NodeType;
  // Additional properties for future node types:
  // inputType?: 'email' | 'phone' | 'text';
  // conditions?: Array<{ field: string; operator: string; value: string }>;
  // actionType?: 'webhook' | 'email' | 'sms';
}

// Configuration interface for node types
export interface NodeTypeConfig {
  type: NodeType;
  label: string;
  description: string;
  defaultData: Partial<NodeData>;
  color: string;
}