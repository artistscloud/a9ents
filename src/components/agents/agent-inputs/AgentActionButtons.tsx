import { Button } from "@/components/ui/button";
import { Sparkles, Upload, PenLine } from "lucide-react";

interface AgentActionButtonsProps {
  onGenerate: () => void;
  loading: boolean;
}

export function AgentActionButtons({ onGenerate, loading }: AgentActionButtonsProps) {
  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={onGenerate}
        disabled={loading}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Generate with AI
      </Button>
      <div className="text-center text-sm text-muted-foreground">or</div>
      <Button variant="outline" className="w-full">
        <Upload className="mr-2 h-4 w-4" />
        Import from JSON
      </Button>
      <Button variant="outline" className="w-full">
        <PenLine className="mr-2 h-4 w-4" />
        Start from scratch
      </Button>
    </div>
  );
}
