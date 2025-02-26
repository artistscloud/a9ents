
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, RefreshCcw } from "lucide-react";

interface AgentDescriptionInputProps {
  jobDescription: string;
  exampleOutput: string;
  onJobDescriptionChange: (value: string) => void;
  onExampleOutputChange: (value: string) => void;
  onEnhance: () => void;
  enhancing: boolean;
}

export function AgentDescriptionInput({
  jobDescription,
  exampleOutput,
  onJobDescriptionChange,
  onExampleOutputChange,
  onEnhance,
  enhancing,
}: AgentDescriptionInputProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Let us know the job to be done for this agent, and we'll generate it for you!</Label>
        <div className="relative">
          <Textarea
            placeholder="Enter job description or add images..."
            className="min-h-[100px] pr-12"
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={() => {/* TODO: Implement image upload */}}
          >
            <ImagePlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground">(Optional) Provide an example output of this job</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onEnhance}
            disabled={enhancing}
          >
            <RefreshCcw className={`h-3 w-3 mr-1 ${enhancing ? 'animate-spin' : ''}`} />
            A.I Enhance
          </Button>
        </div>
        <Textarea
          placeholder="Enter example output..."
          value={exampleOutput}
          onChange={(e) => onExampleOutputChange(e.target.value)}
        />
      </div>
    </div>
  );
}
