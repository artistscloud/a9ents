
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AgentDescriptionInput } from "./agent-inputs/AgentDescriptionInput";
import { AgentModelSettings } from "./agent-inputs/AgentModelSettings";
import { AgentToolsSelection } from "./agent-inputs/AgentToolsSelection";
import { AgentActionButtons } from "./agent-inputs/AgentActionButtons";
import { useCreateAgent } from "@/hooks/use-create-agent";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentModal({ open, onOpenChange }: CreateAgentModalProps) {
  const {
    loading,
    enhancing,
    jobDescription,
    exampleOutput,
    selectedProvider,
    selectedModel,
    temperature,
    maxTokens,
    selectedKnowledgebase,
    selectedTools,
    selectedWorkflow,
    setJobDescription,
    setExampleOutput,
    setSelectedProvider,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setSelectedKnowledgebase,
    setSelectedTools,
    setSelectedWorkflow,
    handleEnhanceWithAI,
    handleGenerateWithAI,
  } = useCreateAgent();

  // Fetch data queries
  const { data: workflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('workflows').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: knowledgebases } = useQuery({
    queryKey: ['knowledgebases'],
    queryFn: async () => {
      const { data, error } = await supabase.from('knowledgebase').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tools } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tools').select('*');
      if (error) throw error;
      return data;
    }
  });

  const handleGenerate = async () => {
    const success = await handleGenerateWithAI();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-[600px] overflow-visible">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New agent</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full px-6">
          <div className="space-y-6 pb-6">
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
              selectedWorkflow={selectedWorkflow}
              onWorkflowChange={setSelectedWorkflow}
              workflows={workflows || []}
            />

            <AgentActionButtons
              onGenerate={handleGenerate}
              loading={loading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
