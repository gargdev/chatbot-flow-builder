import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle } from 'lucide-react';

/**
 * Custom Text Node Component
 * 
 * Features:
 * - Displays text message content
 * - Source handle (right) - only allows one outgoing connection
 * - Target handle (left) - allows multiple incoming connections
 * - Visual feedback when selected
 */
const TextNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div 
      className={`
        min-w-[180px] max-w-[280px] bg-white rounded-lg shadow-md border-2 transition-all duration-200
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Node Header */}
      <div className="bg-teal-500 text-white px-3 py-2 rounded-t-lg flex items-center gap-2 text-xs sm:text-sm font-medium">
        <MessageCircle size={16} />
        <span>Send Message</span>
      </div>

      {/* Node Content */}
      <div className="p-3">
        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
          {data.text}
        </div>
      </div>

      {/* Target Handle - Left side (can accept multiple connections) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-sm"
        style={{ left: -6 }}
      />

      {/* Source Handle - Right side (can only have one outgoing connection) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-sm"
        style={{ right: -6 }}
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';

export default TextNode;