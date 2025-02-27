
import { useState } from 'react';
import { llmService } from '@/services/llm/LLMService';
import { Database } from "@/integrations/supabase/types";

type LLMProvider = Database["public"]["Enums"]["llm_provider"];

interface UseLLMOptions {
  preferredProvider?: LLMProvider;
}

export function useLLM(options: UseLLMOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = async (prompt: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await llmService.generateResponse(prompt, options.preferredProvider);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableProviders = async () => {
    try {
      return await llmService.listAvailableProviders();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
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
