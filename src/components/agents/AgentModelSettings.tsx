
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useLLM } from "@/hooks/use-llm";
import { Database } from "@/integrations/supabase/types";

type LLMProvider = Database["public"]["Enums"]["llm_provider"];

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
  const { getAvailableProviders } = useLLM();
  const [providers, setProviders] = useState<LLMProvider[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const availableProviders = await getAvailableProviders();
        setProviders(availableProviders);
        
        // Set first available provider as default if none selected
        if (!selectedProvider && availableProviders.length > 0) {
          onProviderChange(availableProviders[0]);
        }
      } catch (error) {
        console.error('Error loading providers:', error);
        toast({
          title: "Error",
          description: "Failed to load available LLM providers",
          variant: "destructive",
        });
      }
    };

    loadProviders();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedProvider) return;

      try {
        const response = await fetch(`/functions/llm-${selectedProvider}/models`);
        if (!response.ok) throw new Error('Failed to fetch models');
        
        const data = await response.json();
        setAvailableModels(data.models);
        
        // Set first available model as default if none selected
        if (data.models.length > 0 && !selectedModel) {
          onModelChange(data.models[0]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available models",
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
              <SelectItem key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
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
