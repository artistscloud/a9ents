
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type LLMProvider = Database["public"]["Enums"]["llm_provider"];

interface LLMConfig {
  provider: LLMProvider;
  api_key: string;
  is_enabled: boolean;
}

interface LLMResponse {
  content: string;
  provider: LLMProvider;
}

export class LLMService {
  private static instance: LLMService;
  private configCache: Map<LLMProvider, LLMConfig> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  private async refreshCache(): Promise<void> {
    const { data: configs, error } = await supabase
      .from('llm_configurations')
      .select('*')
      .eq('is_enabled', true);

    if (error) throw error;

    this.configCache.clear();
    configs.forEach((config) => {
      this.configCache.set(config.provider, config);
    });
    this.lastCacheUpdate = Date.now();
  }

  private async getEnabledProviders(): Promise<LLMConfig[]> {
    if (Date.now() - this.lastCacheUpdate > this.CACHE_TTL) {
      await this.refreshCache();
    }
    return Array.from(this.configCache.values());
  }

  public async generateResponse(prompt: string, preferredProvider?: LLMProvider): Promise<LLMResponse> {
    const enabledProviders = await this.getEnabledProviders();
    
    if (enabledProviders.length === 0) {
      throw new Error('No LLM providers are currently enabled');
    }

    let selectedProvider: LLMConfig;
    if (preferredProvider) {
      selectedProvider = enabledProviders.find(p => p.provider === preferredProvider);
      if (!selectedProvider) {
        throw new Error(`Preferred provider ${preferredProvider} is not available`);
      }
    } else {
      // Default to first available provider
      selectedProvider = enabledProviders[0];
    }

    // Call the appropriate provider's edge function
    const response = await fetch(`/functions/llm-${selectedProvider.provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${selectedProvider.api_key}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error calling LLM provider: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      content: data.content,
      provider: selectedProvider.provider,
    };
  }

  public async listAvailableProviders(): Promise<LLMProvider[]> {
    const enabledProviders = await this.getEnabledProviders();
    return enabledProviders.map(p => p.provider);
  }
}

export const llmService = LLMService.getInstance();
