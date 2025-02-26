
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AgentModelSettingsProps {
  selectedProvider: string;
  selectedModel: string;
  temperature: number[];
  maxTokens: number[];
  onProviderChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number[]) => void;
  onMaxTokensChange: (value: number[]) => void;
}

export function AgentModelSettings({
  selectedProvider,
  selectedModel,
  temperature,
  maxTokens,
  onProviderChange,
  onModelChange,
  onTemperatureChange,
  onMaxTokensChange,
}: AgentModelSettingsProps) {
  const { toast } = useToast();
  const [availableModels, setAvailableModels] = useState<string[]>([]);

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
        onModelChange(data.models[0]); // Select first model by default
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>AI Provider</Label>
        <Select value={selectedProvider} onValueChange={onProviderChange}>
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
        <Select value={selectedModel} onValueChange={onModelChange}>
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
          onValueChange={onTemperatureChange}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Max Tokens: {maxTokens}</Label>
        <Slider
          value={maxTokens}
          onValueChange={onMaxTokensChange}
          max={4000}
          step={100}
          className="w-full"
        />
      </div>
    </div>
  );
}
