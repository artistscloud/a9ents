
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { APIConfigurationForm } from "./APIConfigurationForm";
import { InitialToolForm } from "./InitialToolForm";
import { ApiConfig, CustomTool, GenerateToolResponse } from "./types";

export function CreateCustomToolSheet() {
  const [step, setStep] = useState<'initial' | 'configuration'>('initial');
  const [sampleRequest, setSampleRequest] = useState('');
  const [purpose, setPurpose] = useState('');
  const { toast } = useToast();
  const [tool, setTool] = useState<Partial<CustomTool>>({});
  const queryClient = useQueryClient();

  const handleGenerateWithAI = async () => {
    try {
      const response = await supabase.functions.invoke('generate-tool-config', {
        body: { sampleRequest, purpose },
      });
      
      if (response.error) throw new Error('Failed to generate configuration');
      
      const data = response.data as GenerateToolResponse;
      setTool(data);
      setStep('configuration');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tool configuration",
        variant: "destructive",
      });
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        setTool(config);
        setStep('configuration');
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid JSON file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCreate = async (apiConfig: ApiConfig) => {
    try {
      const toolData = {
        name: tool.name || '',
        description: tool.description || '',
        icon_url: tool.iconUrl,
        instruction: tool.instruction || '',
        tags: tool.tags || [],
        api_config: apiConfig,
      };

      const { error } = await supabase.from('tools').insert(toolData);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tools'] });
      
      toast({
        title: "Success",
        description: "Tool created successfully",
      });
      
      setStep('initial');
      setTool({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tool",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (step === 'initial') {
      return (
        <InitialToolForm
          sampleRequest={sampleRequest}
          purpose={purpose}
          onSampleRequestChange={setSampleRequest}
          onPurposeChange={setPurpose}
          onGenerateWithAI={handleGenerateWithAI}
          onImportJSON={handleImportJSON}
        />
      );
    }

    if (step === 'configuration' && tool) {
      return (
        <APIConfigurationForm
          tool={tool}
          onCreate={handleCreate}
          onBack={() => setStep('initial')}
        />
      );
    }

    return null;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Tool
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>New custom API tool</SheetTitle>
          <SheetDescription>
            Configure a new API tool by providing its details and specifications.
          </SheetDescription>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
