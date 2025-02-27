
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeCard } from "./nodes/NodeCard";
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
  ArrowLeftRight,
  Merge,
  Clock,
  Braces,
  Grid,
} from "lucide-react";

interface NodePaletteProps {
  category: string;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const nodeDefinitions = {
  general: [
    { type: 'input', label: 'Input', icon: ArrowDownToLine, description: 'Pass text or files into your workflow' },
    { type: 'output', label: 'Output', icon: ArrowUpFromLine, description: 'Display results as text, formatted text, or images' },
    { type: 'text', label: 'Text', icon: FileText, description: 'Add static text content' },
    { type: 'pipeline', label: 'Pipeline', icon: Play, description: 'Create a sub-workflow pipeline' },
    { type: 'transform', label: 'Transform', icon: PencilRuler, description: 'Transform data between nodes' },
    { type: 'file-save', label: 'File Save', icon: Save, description: 'Save outputs to a file' },
    { type: 'note', label: 'Note', icon: StickyNote, description: 'Add notes to your workflow' },
  ],
  llms: [
    { type: 'llm-openai', label: 'OpenAI', icon: Brain, description: 'Use GPT-4, GPT-3.5 models' },
    { type: 'llm-anthropic', label: 'Anthropic', icon: Brain, description: 'Use Claude models' },
    { type: 'llm-perplexity', label: 'Perplexity', icon: Brain, description: 'Use Perplexity AI models' },
  ],
  'knowledge-base': [
    { type: 'kb-reader', label: 'KB Reader', icon: FileText, description: 'Read from your knowledge base' },
    { type: 'kb-writer', label: 'KB Writer', icon: FileUp, description: 'Write to your knowledge base' },
    { type: 'kb-search', label: 'KB Search', icon: Database, description: 'Semantic search in your knowledge base' },
  ],
  'multi-modal': [
    { type: 'audio', label: 'Audio', icon: Headphones, description: 'Process and generate audio' },
    { type: 'image', label: 'Image', icon: Image, description: 'Process and generate images' },
  ],
  logic: [
    { type: 'logic-condition', label: 'Condition', icon: ArrowLeftRight, description: 'Add conditional branching' },
    { type: 'logic-merge', label: 'Merge', icon: Merge, description: 'Merge multiple branches' },
    { type: 'logic-time', label: 'Time', icon: Clock, description: 'Add time-based logic' },
    { type: 'logic-ttsql', label: 'TTSQL', icon: Database, description: 'Run SQL operations' },
  ],
  'data-transformation': [
    { type: 'text-ops', label: 'Text Ops', icon: FileText, description: 'Manipulate text content' },
    { type: 'json-ops', label: 'JSON Ops', icon: Braces, description: 'Work with JSON data' },
    { type: 'list-ops', label: 'List Ops', icon: List, description: 'Manipulate lists and arrays' },
    { type: 'file-ops', label: 'File Ops', icon: FileUp, description: 'File operations' },
    { type: 'ai-ops', label: 'AI Ops', icon: Wand2, description: 'AI-powered operations' },
    { type: 'notifications', label: 'Notifications', icon: Bell, description: 'Send notifications' },
    { type: 'data-enrichment', label: 'Data Enrichment', icon: TrendingUp, description: 'Enrich data with external sources' },
  ],
  chat: [
    { type: 'chat-memory', label: 'Chat Memory', icon: MessageSquare, description: 'Store and manage chat history' },
    { type: 'data-collector', label: 'Data Collector', icon: Table, description: 'Collect and store chat data' },
    { type: 'chat-file-reader', label: 'File Reader', icon: Download, description: 'Read files in chat context' },
  ],
  integrations: [
    { type: 'integration-grid', label: 'Grid', icon: Grid, description: 'Integration with external services' },
  ],
  triggers: [
    { type: 'trigger-webhook', label: 'Webhook', icon: Globe, description: 'Trigger workflow via HTTP webhook' },
    { type: 'trigger-schedule', label: 'Schedule', icon: Timer, description: 'Schedule workflow execution' },
  ],
  'data-loaders': [
    { type: 'data-csv', label: 'CSV', icon: FileText, description: 'Load and process CSV files' },
    { type: 'data-db', label: 'Database', icon: Database, description: 'Database operations' },
    { type: 'data-audio', label: 'Audio', icon: Headphones, description: 'Load and process audio files' },
  ],
};

export function NodePalette({ category, onDragStart }: NodePaletteProps) {
  const nodes = nodeDefinitions[category as keyof typeof nodeDefinitions] || [];

  return (
    <ScrollArea className="w-64 border-r bg-muted/40">
      <div className="p-4 space-y-4">
        {nodes.map((node) => (
          <NodeCard
            key={node.type}
            type={node.type}
            label={node.label}
            icon={node.icon}
            description={node.description}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
