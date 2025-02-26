
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIProvider {
  name: string;
  models: string[];
  getModels: () => Promise<string[]>;
  enhance: (text: string) => Promise<string>;
}

// Initialize providers with their respective APIs
const providers: Record<string, AIProvider> = {
  openai: {
    name: 'OpenAI',
    models: [],
    getModels: async () => {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
      });
      const data = await response.json();
      return data.data.map((model: any) => model.id);
    },
    enhance: async (text) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert at improving and enhancing text descriptions to be more precise and detailed.' },
            { role: 'user', content: `Please enhance this text while maintaining its core meaning: ${text}` }
          ],
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  anthropic: {
    name: 'Anthropic',
    models: [],
    getModels: async () => {
      const response = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': ANTHROPIC_API_KEY }
      });
      const data = await response.json();
      return data.models.map((model: any) => model.id);
    },
    enhance: async (text) => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          messages: [
            { role: 'user', content: `Please enhance this text while maintaining its core meaning: ${text}` }
          ],
        }),
      });
      const data = await response.json();
      return data.content[0].text;
    }
  },
  gemini: {
    name: 'Google Gemini',
    models: [],
    getModels: async () => {
      return ['gemini-pro']; // Gemini currently only has one model
    },
    enhance: async (text) => {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please enhance this text while maintaining its core meaning: ${text}`
            }]
          }]
        }),
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  },
  openrouter: {
    name: 'OpenRouter',
    models: [],
    getModels: async () => {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}` }
      });
      const data = await response.json();
      return data.data.map((model: any) => model.id);
    },
    enhance: async (text) => {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'You are an expert at improving and enhancing text descriptions to be more precise and detailed.' },
            { role: 'user', content: `Please enhance this text while maintaining its core meaning: ${text}` }
          ],
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, provider, text } = await req.json();

    if (action === 'getModels') {
      const selectedProvider = providers[provider];
      if (!selectedProvider) {
        throw new Error('Invalid provider');
      }
      const models = await selectedProvider.getModels();
      return new Response(JSON.stringify({ models }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'enhance') {
      const selectedProvider = providers[provider];
      if (!selectedProvider) {
        throw new Error('Invalid provider');
      }
      const enhancedText = await selectedProvider.enhance(text);
      return new Response(JSON.stringify({ enhancedText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
