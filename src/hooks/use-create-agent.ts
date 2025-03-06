
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLLM } from "@/hooks/use-llm";

export function useCreateAgent() {
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
          tools: selectedTools,
          knowledgebases: selectedKnowledgebase,
          workflows: selectedWorkflow
        },
      });

      if (error) throw error;
      
      setJobDescription(data.enhancedText);
      if (data.exampleOutput) {
        setExampleOutput(data.exampleOutput);
      }
      
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
            configuredTools: selectedTools
          }
        }])
        .select()
        .single();

      if (agentError) throw agentError;

      toast({
        title: "Success",
        description: "Agent created successfully with workflow and configurations.",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
