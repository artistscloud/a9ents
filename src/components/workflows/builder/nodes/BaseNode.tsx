
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import { NodeConfigurationSheet } from '../sheets/NodeConfigurationSheet';

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type?: string;
    configuration?: Record<string, any>;
  };
  type: string;
  isConnectable?: boolean;
  selected?: boolean;
  xPos?: number;
  yPos?: number;
}

export function BaseNode({ 
  id,
  data,
  type,
  isConnectable = true,
}: BaseNodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <div 
        className="px-4 py-2 shadow-md rounded-md bg-white border hover:shadow-lg transition-shadow"
        onDoubleClick={() => setIsConfigOpen(true)}
      >
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-sm font-medium">{data.label}</div>
            {data.type && (
              <div className="text-xs text-gray-500">{data.type}</div>
            )}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-gray-500"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-gray-500"
          isConnectable={isConnectable}
        />
      </div>

      <NodeConfigurationSheet
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        node={{ id, type, data }}
        onUpdate={(nodeId, updates) => {
          // This will be implemented in WorkflowBuilder
          console.log('Node update:', nodeId, updates);
        }}
      />
    </>
  );
}
