
import { Handle, Position } from '@xyflow/react';

interface BaseNodeProps {
  data: {
    label: string;
    type?: string;
  };
  isSource?: boolean;
  isTarget?: boolean;
}

export function BaseNode({ data, isSource = true, isTarget = true }: BaseNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-medium">{data.label}</div>
          {data.type && (
            <div className="text-xs text-gray-500">{data.type}</div>
          )}
        </div>
      </div>
      {isTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-gray-500"
        />
      )}
      {isSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-gray-500"
        />
      )}
    </div>
  );
}
