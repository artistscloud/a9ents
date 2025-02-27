
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NodeCardProps {
  type: string;
  label: string;
  icon: LucideIcon;
  description: string;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodeCard({ type, label, icon: Icon, description, onDragStart }: NodeCardProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-auto p-4 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex flex-col items-start gap-1">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </Button>
  );
}
