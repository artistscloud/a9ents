
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { NodeIcon } from "./components/NodeIcon";
import { NodeLabel } from "./components/NodeLabel";

interface NodeCardProps {
  type: string;
  label: string;
  icon: LucideIcon;
  description: string;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodeCard({ type, label, icon, description, onDragStart }: NodeCardProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-auto p-4 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
    >
      <NodeIcon icon={icon} />
      <NodeLabel label={label} description={description} />
    </Button>
  );
}
