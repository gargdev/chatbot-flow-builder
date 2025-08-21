import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  GitBranch,
} from "lucide-react";
import { flowStorage } from "../utils/flowStorage";
import { FlowListItem } from "../types/flowTypes";

interface FlowListProps {
  onSelectFlow: (flowId: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
  isMobile: boolean;
}
const FlowList: React.FC<FlowListProps> = ({
  onSelectFlow,
  onCreateNew,
  onClose,
  isMobile,
}) => {
  const [flows, setFlows] = useState<FlowListItem[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = () => {
    const savedFlows = flowStorage.getAllFlows();
    setFlows(
      savedFlows.map((flow) => ({
        id: flow.id,
        name: flow.name,
        description: flow.description,
        createdAt: flow.createdAt,
        updatedAt: flow.updatedAt,
        nodeCount: flow.nodeCount,
        edgeCount: flow.edgeCount,
      }))
    );
  };

  const handleDeleteFlow = (flowId: string) => {
    try {
      flowStorage.deleteFlow(flowId);
      loadFlows();
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete flow");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`
      bg-white shadow-lg h-full flex flex-col
      ${isMobile ? "w-full border-0" : "w-80 border-l border-gray-200"}
    `}
    >
      {/* Header */}
      <div
        className={`${
          isMobile ? "p-3" : "p-4"
        } border-b border-gray-200 bg-gray-50`}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
              Back to Editor
            </span>
          </button>
        </div>
        <h2
          className={`${
            isMobile ? "text-base" : "text-lg"
          } font-semibold text-gray-800 flex items-center gap-2`}
        >
          <Layers size={20} />
          My Flows
        </h2>
        <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-600 mt-1`}>
          Manage your chatbot flows
        </p>
      </div>

      {/* Create New Flow Button */}
      <div className={`${isMobile ? "p-3" : "p-4"} border-b border-gray-200`}>
        <button
          onClick={onCreateNew}
          className={`
            w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg
            transition-colors duration-200 flex items-center justify-center gap-2
            ${isMobile ? "py-2 text-sm" : "py-3 text-base"}
          `}
        >
          <Plus size={18} />
          Create New Flow
        </button>
      </div>

      {/* Flows List */}
      <div className="flex-1 overflow-y-auto">
        {flows.length === 0 ? (
          <div className={`${isMobile ? "p-3" : "p-4"} text-center`}>
            <Layers size={48} className="mx-auto text-gray-300 mb-4" />
            <h3
              className={`${
                isMobile ? "text-sm" : "text-base"
              } font-medium text-gray-600 mb-2`}
            >
              No flows yet
            </h3>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>
              Create your first chatbot flow to get started
            </p>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>
              Refresh if you saved any flow and not getting dispalyed
            </p>
          </div>
        ) : (
          <div className={`${isMobile ? "p-2 space-y-2" : "p-4 space-y-3"}`}>
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
              >
                <div
                  className={`${isMobile ? "p-3" : "p-4"} cursor-pointer`}
                  onClick={() => onSelectFlow(flow.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`font-medium text-gray-800 truncate flex-1 mr-2 ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      {flow.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(flow.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {flow.description && (
                    <p
                      className={`text-gray-600 mb-3 line-clamp-2 ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {flow.description}
                    </p>
                  )}

                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 ${
                      isMobile ? "text-xs" : "text-sm"
                    } text-gray-500`}
                  >
                    {/* Nodes */}
                    <div className="flex items-center gap-1">
                      <Edit3 size={12} />
                      <span>{flow.nodeCount} nodes</span>
                    </div>

                    {/* Edges */}
                    <div className="flex items-center gap-1">
                      <GitBranch size={12} />
                      <span>{flow.edgeCount} edges</span>
                    </div>

                    {/* Updated At */}
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(flow.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Flow
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this flow? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFlow(deleteConfirm)}
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowList;
