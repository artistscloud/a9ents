
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
  Image,
  Headphones,
  FileJson,
  List,
  FileUp,
  Wand2,
  Bell,
  TrendingUp,
  MessageSquare,
  Table,
  Download,
  PencilRuler,
  Play,
  Save,
  StickyNote,
  X,
  ArrowLeftRight,
  Merge,
  Clock,
  Database as TTSQL,
  Braces,
  FileAudio,
  Grid,
} from "lucide-react";

const nodeIcons: Record<string, any> = {
  // General
  'input': ArrowDownToLine,
  'output': ArrowUpFromLine,
  'text': FileText,
  'pipeline': Play,
  'transform': PencilRuler,
  'file-save': Save,
  'note': StickyNote,

  // LLMs
  'llm-openai': Brain,
  'llm-anthropic': Brain,
  'llm-perplexity': Brain,

  // Knowledge Base
  'kb-reader': FileText,
  'kb-writer': FileUp,
  'kb-search': Database,

  // Multi-Modal
  'audio': Headphones,
  'image': Image,

  // Logic
  'logic-condition': ArrowLeftRight,
  'logic-merge': Merge,
  'logic-time': Clock,
  'logic-ttsql': TTSQL,

  // Data Transformation
  'text-ops': FileText,
  'json-ops': Braces,
  'list-ops': List,
  'file-ops': FileUp,
  'ai-ops': Wand2,
  'notifications': Bell,
  'data-enrichment': TrendingUp,

  // Chat
  'chat-memory': MessageSquare,
  'data-collector': Table,
  'chat-file-reader': Download,

  // Data Loaders
  'data-csv': FileText,
  'data-db': Database,
  'data-audio': FileAudio,

  // Integrations
  'integration-grid': Grid,
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
