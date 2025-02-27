
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Brain, 
  Database, 
  CircuitBoard,
  FileText, 
  Globe, 
  GitFork, 
  Timer,
  X
} from "lucide-react";

const nodeIcons: Record<string, any> = {
  'input': ArrowDownToLine,
  'output': ArrowUpFromLine,
  'llm-openai': Brain,
  'llm-anthropic': Brain,
  'llm-perplexity': Brain,
  'logic-if': GitFork,
  'logic-switch': CircuitBoard,
  'trigger-webhook': Globe,
  'trigger-schedule': Timer,
  'data-csv': FileText,
  'data-db': Database,
};

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type?: string;
  };
  type: string;
  selected?: boolean;
}

export function BaseNode({ id, data, type }: BaseNodeProps) {
  const Icon = nodeIcons[type] || FileText;
  const { setNodes, getNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  return (
    <div className={`relative px-4 py-2 shadow-md rounded-md bg-white border ${type === 'input' ? 'border-blue-500' : type === 'output' ? 'border-green-500' : 'border-gray-200'}`}>
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 p-1 rounded-sm hover:bg-gray-100"
        aria-label="Delete node"
      >
        <X className="h-3 w-3 text-gray-500" />
      </button>
      
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      
      {type !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-gray-500"
        />
      )}
      
      {type !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-gray-500"
        />
      )}
    </div>
  );
}
