
import { Button } from "@/components/ui/button";
import { Webhook, Timer, Zap, Brain, Mail, Globe, Wrench } from "lucide-react";

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  const triggers = [
    { type: 'trigger-webhook', label: 'Webhook', icon: Webhook },
    { type: 'trigger-schedule', label: 'Schedule', icon: Timer },
    { type: 'trigger-manual', label: 'Manual', icon: Zap },
  ];

  const actions = [
    { type: 'action-llm', label: 'AI/LLM', icon: Brain },
    { type: 'action-email', label: 'Email', icon: Mail },
    { type: 'action-api', label: 'API Call', icon: Globe },
    { type: 'action-tool', label: 'Tool', icon: Wrench },
  ];

  return (
    <div className="p-4 border-r bg-muted/40 w-64 flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Triggers</h3>
        <div className="grid grid-cols-2 gap-2">
          {triggers.map((trigger) => (
            <Button
              key={trigger.type}
              variant="outline"
              className="h-20 flex flex-col gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, trigger.type)}
            >
              <trigger.icon className="h-6 w-6" />
              <span className="text-xs">{trigger.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.type}
              variant="outline"
              className="h-20 flex flex-col gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, action.type)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
