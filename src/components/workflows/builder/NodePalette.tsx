
import { Button } from "@/components/ui/button";
import { Input as InputIcon, Output as OutputIcon, Brain, Database, Webhook, 
         FileText, Share2, SplitSquareVertical, Transform, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodePaletteProps {
  category: string;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ category, onDragStart }: NodePaletteProps) {
  const nodesByCategory = {
    general: [
      { type: 'input', label: 'Input', icon: InputIcon, description: 'Pass data into your workflow' },
      { type: 'output', label: 'Output', icon: OutputIcon, description: 'Output data from your workflow' },
      { type: 'text', label: 'Text', icon: FileText, description: 'Add text content' },
    ],
    llms: [
      { type: 'llm-openai', label: 'OpenAI', icon: Brain, description: 'Use OpenAI models' },
      { type: 'llm-anthropic', label: 'Anthropic', icon: Brain, description: 'Use Anthropic models' },
      { type: 'llm-perplexity', label: 'Perplexity', icon: Brain, description: 'Use Perplexity AI' },
    ],
    logic: [
      { type: 'logic-if', label: 'If Condition', icon: SplitSquareVertical, description: 'Add conditional logic' },
      { type: 'logic-switch', label: 'Switch', icon: SplitSquareVertical, description: 'Multiple conditions' },
      { type: 'logic-loop', label: 'Loop', icon: Transform, description: 'Iterate over data' },
    ],
    triggers: [
      { type: 'trigger-webhook', label: 'Webhook', icon: Webhook, description: 'Trigger via HTTP webhook' },
      { type: 'trigger-schedule', label: 'Schedule', icon: Clock, description: 'Time-based trigger' },
    ],
    data: [
      { type: 'data-csv', label: 'CSV', icon: FileText, description: 'Load CSV data' },
      { type: 'data-api', label: 'API', icon: Share2, description: 'Fetch API data' },
      { type: 'data-db', label: 'Database', icon: Database, description: 'Query database' },
    ],
    transform: [
      { type: 'transform-map', label: 'Map', icon: Transform, description: 'Transform data structure' },
      { type: 'transform-filter', label: 'Filter', icon: Transform, description: 'Filter data' },
      { type: 'transform-reduce', label: 'Reduce', icon: Transform, description: 'Aggregate data' },
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
