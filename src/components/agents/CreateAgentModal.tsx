
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgentDescriptionInput } from "./AgentDescriptionInput";
import { AgentModelSettings } from "./AgentModelSettings";
import { AgentToolsSelection } from "./AgentToolsSelection";
import { AgentActionButtons } from "./AgentActionButtons";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentModal({ open, onOpenChange }: CreateAgentModalProps) {
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2000]);
  const [selectedKnowledgebase, setSelectedKnowledgebase] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEnhanceWithAI = async () => {
    if (!jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide a job description first.",
        variant: "destructive",
      });
      return;
    }

    setEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhance-agent-prompt', {
        body: { 
          action: 'enhance',
          provider: selectedProvider,
          text: jobDescription 
        },
      });

      if (error) throw error;
      
      setJobDescription(data.enhancedText);
      toast({
        title: "Enhanced successfully",
        description: "Your description has been enhanced.",
      });
    } catch (error) {
      console.error('Error enhancing text:', error);
      toast({
        title: "Error",
        description: "Failed to enhance the description.",
        variant: "destructive",
      });
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide a job description for the agent.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Call AI generation endpoint
      toast({
        title: "Generating agent configuration...",
        description: "Please wait while we process your request.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate agent configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New agent</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AgentDescriptionInput
            jobDescription={jobDescription}
            exampleOutput={exampleOutput}
            onJobDescriptionChange={setJobDescription}
            onExampleOutputChange={setExampleOutput}
            onEnhance={handleEnhanceWithAI}
            enhancing={enhancing}
          />

          <Separator />

          <AgentModelSettings
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            temperature={temperature}
            maxTokens={maxTokens}
            onProviderChange={setSelectedProvider}
            onModelChange={setSelectedModel}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
          />

          <AgentToolsSelection
            selectedKnowledgebase={selectedKnowledgebase}
            selectedTools={selectedTools}
            onKnowledgebaseChange={setSelectedKnowledgebase}
            onToolsChange={setSelectedTools}
          />

          <AgentActionButtons
            onGenerate={handleGenerateWithAI}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
