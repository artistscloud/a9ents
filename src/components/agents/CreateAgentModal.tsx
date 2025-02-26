import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ImagePlus, Sparkles, Upload, PenLine, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const { toast } = useToast();

  const providers = [
    { id: "openai", name: "OpenAI" },
    { id: "anthropic", name: "Anthropic" },
    { id: "gemini", name: "Google Gemini" },
    { id: "openrouter", name: "OpenRouter" },
  ];

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('enhance-agent-prompt', {
          body: { action: 'getModels', provider: selectedProvider },
        });

        if (error) throw error;
        setAvailableModels(data.models);
        setSelectedModel(data.models[0]); // Select first model by default
      } catch (error) {
        console.error('Error fetching models:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available models.",
          variant: "destructive",
        });
      }
    };

    if (selectedProvider) {
      fetchModels();
    }
  }, [selectedProvider]);

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

  const availableTools = [
    { id: "1", name: "Web Search" },
    { id: "2", name: "File Processing" },
    { id: "3", name: "Data Analysis" },
    { id: "4", name: "Code Generation" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New agent</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Let us know the job to be done for this agent, and we'll generate it for you!</Label>
            <div className="relative">
              <Textarea
                placeholder="Enter job description or add images..."
                className="min-h-[100px] pr-12"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
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
                onClick={handleEnhanceWithAI}
                disabled={enhancing}
              >
                <RefreshCcw className={`h-3 w-3 mr-1 ${enhancing ? 'animate-spin' : ''}`} />
                A.I Enhance
              </Button>
            </div>
            <Textarea
              placeholder="Enter example output..."
              value={exampleOutput}
              onChange={(e) => setExampleOutput(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Temperature: {temperature}</Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {maxTokens}</Label>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4000}
                step={100}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Knowledgebase</Label>
              <Select value={selectedKnowledgebase} onValueChange={setSelectedKnowledgebase}>
                <SelectTrigger>
                  <SelectValue placeholder="Select knowledgebase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kb1">Company Guidelines</SelectItem>
                  <SelectItem value="kb2">Technical Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tools</Label>
              <div className="flex flex-wrap gap-2">
                {availableTools.map((tool) => (
                  <Badge
                    key={tool.id}
                    variant={selectedTools.includes(tool.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedTools(
                        selectedTools.includes(tool.id)
                          ? selectedTools.filter(id => id !== tool.id)
                          : [...selectedTools, tool.id]
                      );
                    }}
                  >
                    {tool.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleGenerateWithAI}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
