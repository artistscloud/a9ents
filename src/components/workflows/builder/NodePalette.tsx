
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodePaletteProps {
  category: string;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ category, onDragStart }: NodePaletteProps) {
  const nodesByCategory = {
    general: [
      { type: 'input', label: 'Input', icon: ArrowDownToLine, description: 'Pass data into your workflow' },
      { type: 'output', label: 'Output', icon: ArrowUpFromLine, description: 'Display results' },
      { type: 'text', label: 'Text', icon: FileText, description: 'Text content' },
      { type: 'pipeline', label: 'Pipeline', icon: Play, description: 'Sub-pipeline' },
      { type: 'transform', label: 'Transform', icon: PencilRuler, description: 'Transform data' },
      { type: 'file-save', label: 'File Save', icon: Save, description: 'Save to file' },
      { type: 'note', label: 'Note', icon: StickyNote, description: 'Add notes' },
    ],
    llms: [
      { type: 'llm-openai', label: 'OpenAI', icon: Brain, description: 'Use OpenAI models' },
      { type: 'llm-anthropic', label: 'Anthropic', icon: Brain, description: 'Use Anthropic models' },
      { type: 'llm-perplexity', label: 'Perplexity', icon: Brain, description: 'Use Perplexity AI' },
    ],
    'knowledge-base': [
      { type: 'kb-reader', label: 'KB Reader', icon: FileText, description: 'Read from knowledge base' },
      { type: 'kb-writer', label: 'KB Writer', icon: FileUp, description: 'Write to knowledge base' },
      { type: 'kb-search', label: 'KB Search', icon: Database, description: 'Search knowledge base' },
    ],
    'multi-modal': [
      { type: 'audio', label: 'Audio', icon: Headphones, description: 'Audio processing' },
      { type: 'image', label: 'Image', icon: Image, description: 'Image processing' },
    ],
    logic: [
      { type: 'logic-condition', label: 'Condition', icon: ArrowLeftRight, description: 'Conditional logic' },
      { type: 'logic-merge', label: 'Merge', icon: Merge, description: 'Merge branches' },
      { type: 'logic-time', label: 'Time', icon: Clock, description: 'Time-based logic' },
      { type: 'logic-ttsql', label: 'TTSQL', icon: Database, description: 'SQL operations' },
    ],
    'data-transformation': [
      { type: 'text-ops', label: 'Text Ops', icon: FileText, description: 'Text operations' },
      { type: 'json-ops', label: 'JSON Ops', icon: Braces, description: 'JSON operations' },
      { type: 'list-ops', label: 'List Ops', icon: List, description: 'List operations' },
      { type: 'file-ops', label: 'File Ops', icon: FileUp, description: 'File operations' },
      { type: 'ai-ops', label: 'AI Ops', icon: Wand2, description: 'AI operations' },
      { type: 'notifications', label: 'Notifications', icon: Bell, description: 'Send notifications' },
      { type: 'data-enrichment', label: 'Data Enrichment', icon: TrendingUp, description: 'Enrich data' },
    ],
    chat: [
      { type: 'chat-memory', label: 'Chat Memory', icon: MessageSquare, description: 'Manage chat history' },
      { type: 'data-collector', label: 'Data Collector', icon: Table, description: 'Collect chat data' },
      { type: 'chat-file-reader', label: 'Chat File Reader', icon: Download, description: 'Read chat files' },
    ],
    integrations: [
      { type: 'integration-grid', label: 'Grid', icon: Grid, description: 'Grid integration' },
    ],
    triggers: [
      { type: 'trigger-webhook', label: 'Webhook', icon: Globe, description: 'HTTP webhook trigger' },
      { type: 'trigger-schedule', label: 'Schedule', icon: Timer, description: 'Time-based trigger' },
    ],
    'data-loaders': [
      { type: 'data-csv', label: 'CSV', icon: FileText, description: 'Load CSV data' },
      { type: 'data-db', label: 'Database', icon: Database, description: 'Database operations' },
    ],
  };

  const nodes = nodesByCategory[category as keyof typeof nodesByCategory] || [];

  return (
    <ScrollArea className="w-64 border-r bg-muted/40">
      <div className="p-4 space-y-4">
        {nodes.map((node) => (
          <Button
            key={node.type}
            variant="outline"
            className="w-full justify-start gap-2 h-auto p-4"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <node.icon className="h-5 w-5 shrink-0" />
            <div className="flex flex-col items-start gap-1">
              <div className="font-medium">{node.label}</div>
              <div className="text-xs text-muted-foreground">{node.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
