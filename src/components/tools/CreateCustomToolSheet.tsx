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
        function: JSON.stringify(config),
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
      return <ApiConfigurationForm tool={tool} onCreate={handleCreate} />;
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

interface ApiConfigurationFormProps {
  tool: Partial<CustomTool>;
  onCreate: (config: ApiConfig) => Promise<void>;
}

const ApiConfigurationForm: React.FC<ApiConfigurationFormProps> = ({
  tool,
  onCreate,
}) => {
  const form = useForm<z.infer<typeof customToolSchema>>({
    resolver: zodResolver(customToolSchema),
    defaultValues: {
      name: tool.name || '',
      description: tool.description || '',
      instruction: tool.instruction || '',
      iconUrl: tool.iconUrl || '',
      tags: tool.tags || [],
      apiConfig: {
        method: tool.apiConfig?.method || 'GET',
        url: tool.apiConfig?.url || '',
        headers: tool.apiConfig?.headers || {},
        queryParams: tool.apiConfig?.queryParams || {},
        body: tool.apiConfig?.body || '',
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof customToolSchema>) => {
    await onCreate(values.apiConfig);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tool Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the tool"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How to use this tool"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URL</FormLabel>
              <FormControl>
                <Input placeholder="URL to the tool's icon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="api_config">
            <AccordionTrigger>API Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="apiConfig.method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiConfig.url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="API Endpoint URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiConfig.headers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headers</FormLabel>
                      <FormDescription>
                        Enter headers as key-value pairs.
                      </FormDescription>
                      {Object.entries(field.value || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Input
                            placeholder="Header Key"
                            value={key}
                            onChange={() => {}}
                            disabled
                          />
                          <Input
                            placeholder="Header Value"
                            value={value}
                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Implement adding new header logic here
                        }}
                      >
                        Add Header
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiConfig.queryParams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Query Parameters</FormLabel>
                      <FormDescription>
                        Enter query parameters as key-value pairs.
                      </FormDescription>
                      {Object.entries(field.value || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Input
                            placeholder="Parameter Key"
                            value={key}
                            onChange={() => {}}
                            disabled
                          />
                          <Input
                            placeholder="Parameter Value"
                            value={value}
                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Implement adding new query parameter logic here
                        }}
                      >
                        Add Parameter
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiConfig.body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Request Body" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button type="submit">Create Tool</Button>
      </form>
    </Form>
  );
};
