
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sampleRequest, purpose } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an API configuration expert. You analyze API requests and generate structured configurations.
            Always return valid JSON with these fields:
            - title (human-readable name)
            - name (snake_case identifier)
            - description (clear explanation)
            - instruction (how to use)
            - iconUrl (optional URL)
            - tags (array of relevant keywords)
            - apiConfig (method, url, headers, queryParams, body)
            `
          },
          {
            role: 'user',
            content: `
              Sample request: ${sampleRequest}
              ${purpose ? `Purpose: ${purpose}` : ''}
              Generate a complete API tool configuration including all required fields.
            `
          }
        ],
      }),
    });

    const data = await response.json();
    const config = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
