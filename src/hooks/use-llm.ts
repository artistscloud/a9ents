
import { useState } from 'react';
import { llmService } from '@/services/llm/LLMService';
import { Database } from "@/integrations/supabase/types";
import { useToast } from '@/components/ui/use-toast';

type LLMProvider = Database["public"]["Enums"]["llm_provider"];

interface UseLLMOptions {
  preferredProvider?: LLMProvider;
}

export function useLLM(options: UseLLMOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const generate = async (prompt: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await llmService.generateResponse(prompt, options.preferredProvider);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableProviders = async () => {
    try {
      return await llmService.listAvailableProviders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available providers';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    generate,
    getAvailableProviders,
    isLoading,
    error,
  };
}
