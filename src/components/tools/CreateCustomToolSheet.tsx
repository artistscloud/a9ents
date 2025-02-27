
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CustomTool {
  name: string;
  description: string;
  instruction: string;
  iconUrl: string;
  tags: string[];
  apiConfig: ApiConfig;
}

interface ApiConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
}

const apiConfigSchema = z.object({
  method: z.string().min(1, { message: "Method is required" }),
  url: z.string().url({ message: "Valid URL is required" }),
  headers: z.record(z.string(), z.string()).optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
  body: z.string().optional(),
});

const customToolSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  instruction: z
    .string()
    .min(10, { message: "Instruction must be at least 10 characters" }),
  iconUrl: z.string().url({ message: "Valid URL is required" }).optional(),
  tags: z.array(z.string()).optional(),
  apiConfig: apiConfigSchema,
});

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
      
      const data = response.data;
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
      // Ensure we have all required fields with default values
      const completeConfig: ApiConfig = {
        method: apiConfig.method || 'GET',
        url: apiConfig.url || '',
        headers: apiConfig.headers || {},
        queryParams: apiConfig.queryParams || {},
        body: apiConfig.body || '',
      };

      const { error } = await supabase.from('tools').insert({
        name: tool.name || '',
        description: tool.description || '',
        icon_url: tool.iconUrl,
        instruction: tool.instruction || '',
        tags: tool.tags || [],
        api_config: completeConfig,
      });

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
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sample-request">Sample API Request</Label>
            <Textarea
              id="sample-request"
              placeholder="e.g., GET https://api.example.com/users/123"
              value={sampleRequest}
              onChange={(e) => setSampleRequest(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purpose">Purpose (optional)</Label>
            <Input
              type="text"
              id="purpose"
              placeholder="e.g., Fetch user data"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <label htmlFor="json-upload" className="cursor-pointer">
                Import JSON
              </label>
              <input
                type="file"
                id="json-upload"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </Button>
            <Button onClick={handleGenerateWithAI}>Generate with AI</Button>
          </div>
        </div>
      );
    }

    if (step === 'configuration' && tool) {
      return <APIConfigurationForm tool={tool} onCreate={handleCreate} />;
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
