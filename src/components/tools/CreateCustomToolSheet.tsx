
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileJson, Wand2, FileUp } from "lucide-react";
import { APIConfigurationForm } from "./APIConfigurationForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApiConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Array<{ key: string; value: string; description?: string }>;
  queryParams: Array<{ key: string; value: string; description?: string }>;
  body: Array<{ key: string; value: string; description?: string }>;
  isFormData: boolean;
}

interface CustomTool {
  title: string;
  name: string;
  description: string;
  instruction: string;
  iconUrl: string;
  tags: string[];
  apiConfig: ApiConfig;
}

export function CreateCustomToolSheet() {
  const [step, setStep] = useState<'initial' | 'form' | 'configuration'>('initial');
  const [sampleRequest, setSampleRequest] = useState('');
  const [purpose, setPurpose] = useState('');
  const { toast } = useToast();
  const [tool, setTool] = useState<Partial<CustomTool>>({});

  const handleGenerateWithAI = async () => {
    try {
      const response = await fetch('/api/generate-tool-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleRequest, purpose }),
      });
      
      if (!response.ok) throw new Error('Failed to generate configuration');
      
      const data = await response.json();
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

  const handleCreate = async (config: ApiConfig) => {
    try {
      const { error } = await supabase.from('tools').insert({
        name: tool.name,
        description: tool.description,
        icon_url: tool.iconUrl,
        instruction: tool.instruction,
        tags: tool.tags,
        api_config: config,
      });

      if (error) throw error;

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
    switch (step) {
      case 'initial':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Provide a sample API request (curl, Python, JavaScript) <span className="text-red-500">*</span></Label>
              <Textarea 
                value={sampleRequest}
                onChange={(e) => setSampleRequest(e.target.value)}
                placeholder="curl -H 'Authorization: YOUR_API_KEY' https://api.example.com/v1/endpoint"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>(Optional) What's the purpose of this API?</Label>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Enter purpose..."
              />
            </div>
            <div className="space-y-4 pt-4">
              <Button 
                className="w-full"
                onClick={handleGenerateWithAI}
                disabled={!sampleRequest}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => handleImportJSON(e as any);
                  input.click();
                }}
              >
                <FileJson className="w-4 h-4 mr-2" />
                Import from JSON
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep('configuration')}
              >
                <FileUp className="w-4 h-4 mr-2" />
                Start from scratch
              </Button>
            </div>
          </div>
        );
      case 'configuration':
        return (
          <APIConfigurationForm
            initialData={tool}
            onSubmit={handleCreate}
            onBack={() => setStep('initial')}
          />
        );
      default:
        return null;
    }
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
