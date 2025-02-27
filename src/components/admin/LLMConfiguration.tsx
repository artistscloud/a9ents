
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const LLM_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4 and other models' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude and other models' },
  { id: 'gemini', name: 'Google Gemini', description: 'Google\'s AI models' },
  { id: 'grok', name: 'Grok', description: 'X\'s AI model' },
  { id: 'openrouter', name: 'OpenRouter', description: 'Multi-model gateway' },
  { id: 'mistral', name: 'Mistral', description: 'Mistral AI models' },
  { id: 'groq', name: 'Groq', description: 'High-performance inference' },
  { id: 'llama', name: 'Llama', description: 'Meta\'s AI models' }
];

export function LLMConfiguration() {
  const { toast } = useToast();
  const [newApiKey, setNewApiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const { data: configurations, refetch } = useQuery({
    queryKey: ['llm-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('llm_configurations')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSaveApiKey = async (provider: string) => {
    if (!newApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('llm_configurations')
        .upsert({
          provider,
          api_key: newApiKey,
          created_by: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'provider',
          ignoreDuplicates: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key saved successfully",
      });

      setNewApiKey("");
      setSelectedProvider("");
      refetch();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const handleToggleProvider = async (provider: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('llm_configurations')
        .update({ is_enabled: isEnabled })
        .eq('provider', provider);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Provider ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      });

      refetch();
    } catch (error) {
      console.error('Error toggling provider:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {LLM_PROVIDERS.map((provider) => {
          const config = configurations?.find(c => c.provider === provider.id);
          const hasApiKey = !!config?.api_key;

          return (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{provider.name}</CardTitle>
                  {hasApiKey && (
                    <Switch
                      checked={config.is_enabled}
                      onCheckedChange={(checked) => handleToggleProvider(provider.id, checked)}
                    />
                  )}
                </div>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProvider === provider.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`apiKey-${provider.id}`}>API Key</Label>
                      <Input
                        id={`apiKey-${provider.id}`}
                        type="password"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Enter API key"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveApiKey(provider.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProvider("");
                          setNewApiKey("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    {hasApiKey ? 'Update API Key' : 'Add API Key'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
