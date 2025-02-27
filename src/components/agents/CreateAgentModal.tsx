
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgentDescriptionInput } from "./AgentDescriptionInput";
import { AgentModelSettings } from "./AgentModelSettings";
import { AgentToolsSelection } from "./AgentToolsSelection";
import { AgentActionButtons } from "./AgentActionButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useLLM } from "@/hooks/use-llm";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAgentModal({ open, onOpenChange }: CreateAgentModalProps) {
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2000]);
  const [selectedKnowledgebase, setSelectedKnowledgebase] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const { toast } = useToast();
  const { generate } = useLLM({ preferredProvider: selectedProvider as any });

  // Fetch available workflows
  const { data: workflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch available knowledgebases
  const { data: knowledgebases } = useQuery({
    queryKey: ['knowledgebases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledgebase')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch available tools
  const { data: tools } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

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
          text: jobDescription,
          enhanceOutput: true,
          tools: tools,
          knowledgebases: knowledgebases,
          workflows: workflows
        },
      });

      if (error) throw error;
      
      setJobDescription(data.enhancedText);
      if (data.exampleOutput) {
        setExampleOutput(data.exampleOutput);
      }
      
      // Auto-select suggested tools and workflows if provided
      if (data.suggestedTools) {
        setSelectedTools(data.suggestedTools);
      }
      if (data.suggestedWorkflow) {
        setSelectedWorkflow(data.suggestedWorkflow);
      }
      if (data.suggestedKnowledgebase) {
        setSelectedKnowledgebase(data.suggestedKnowledgebase);
      }
      
      toast({
        title: "Enhanced successfully",
        description: "Your description and configurations have been enhanced.",
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
      // First, let's create the workflow if none is selected
      let workflowId = selectedWorkflow;
      if (!workflowId) {
        const { data: newWorkflow, error: workflowError } = await supabase
          .from('workflows')
          .insert([{
            name: `${jobDescription.split('\n')[0]} Workflow`,
            steps: [],
          }])
          .select()
          .single();

        if (workflowError) throw workflowError;
        workflowId = newWorkflow.id;
      }

      // Create the agent with all configurations
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert([{
          name: jobDescription.split('\n')[0] || 'New Agent',
          description: jobDescription,
          knowledgebase_id: selectedKnowledgebase || null,
          workflow_id: workflowId,
          selected_tools: selectedTools,
          tools: {
            provider: selectedProvider,
            model: selectedModel,
            temperature: temperature[0],
            maxTokens: maxTokens[0],
            configuredTools: selectedTools // Include selected tools within the tools object
          }
        }])
        .select()
        .single();

      if (agentError) throw agentError;

      toast({
        title: "Success",
        description: "Agent created successfully with workflow and configurations.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-[600px]">
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
              onGenerate={handleGenerateWithAI}
              loading={loading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
