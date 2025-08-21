/**
 * Flow Storage Utilities
 * 
 * Handles saving, loading, and managing flows in localStorage
 */

import { SavedFlow, FlowMetadata } from '../types/flowTypes';

const FLOWS_STORAGE_KEY = 'chatbot_flows';
const CURRENT_FLOW_KEY = 'current_flow_id';

export const flowStorage = {
  // Get all saved flows
  getAllFlows(): SavedFlow[] {
    try {
      const flows = localStorage.getItem(FLOWS_STORAGE_KEY);
      return flows ? JSON.parse(flows) : [];
    } catch (error) {
      console.error('Error loading flows:', error);
      return [];
    }
  },

  // Save a flow
  saveFlow(flow: SavedFlow): void {
    try {
      const flows = this.getAllFlows();
      const existingIndex = flows.findIndex(f => f.id === flow.id);
      
      if (existingIndex >= 0) {
        flows[existingIndex] = flow;
      } else {
        flows.push(flow);
      }
      
      localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(flows));
    } catch (error) {
      console.error('Error saving flow:', error);
      throw new Error('Failed to save flow');
    }
  },

  // Get a specific flow by ID
  getFlow(id: string): SavedFlow | null {
    try {
      const flows = this.getAllFlows();
      return flows.find(f => f.id === id) || null;
    } catch (error) {
      console.error('Error loading flow:', error);
      return null;
    }
  },

  // Delete a flow
  deleteFlow(id: string): void {
    try {
      const flows = this.getAllFlows();
      const filteredFlows = flows.filter(f => f.id !== id);
      localStorage.setItem(FLOWS_STORAGE_KEY, JSON.stringify(filteredFlows));
    } catch (error) {
      console.error('Error deleting flow:', error);
      throw new Error('Failed to delete flow');
    }
  },

  // Set current flow ID
  setCurrentFlowId(id: string | null): void {
    if (id) {
      localStorage.setItem(CURRENT_FLOW_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_FLOW_KEY);
    }
  },

  // Get current flow ID
  getCurrentFlowId(): string | null {
    return localStorage.getItem(CURRENT_FLOW_KEY);
  },

  // Generate unique ID
  generateId(): string {
    return `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};