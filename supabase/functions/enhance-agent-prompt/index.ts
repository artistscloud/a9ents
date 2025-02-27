
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, provider, action, enhanceOutput } = await req.json();

    if (action !== 'enhance') {
      throw new Error('Invalid action');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an AI expert at creating detailed and comprehensive agent descriptions. 
    Your task is to enhance the given job description by:
    1. Adding specific technical capabilities and requirements
    2. Including clear success criteria and performance metrics
    3. Defining input/output formats and data structures
    4. Specifying any necessary API integrations or external services
    5. Adding context about the business domain and use cases
    6. Incorporating security considerations and best practices
    7. Detailing error handling and edge cases
    8. Suggesting potential optimizations and improvements

    Structure the description in clear sections with headings. 
    Keep the tone professional and technical while maintaining readability.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
      }),
    });

    const data = await response.json();
    const enhancedText = data.choices[0].message.content;

    let exampleOutput = null;
    if (enhanceOutput) {
      const outputPrompt = `Create a comprehensive example output that demonstrates:
      1. The exact format and structure of the agent's response
      2. All relevant data fields and their values
      3. Any metadata or processing information
      4. Success/error status indicators
      5. Performance metrics or timing data
      6. Any relevant logs or debug information
      
      Base this on the following agent description:\n${enhancedText}`;

      const outputResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are an expert at generating detailed, realistic example outputs for AI agents.' 
            },
            { role: 'user', content: outputPrompt }
          ],
        }),
      });

      const outputData = await outputResponse.json();
      exampleOutput = outputData.choices[0].message.content;
    }

    return new Response(
      JSON.stringify({ 
        enhancedText,
        exampleOutput
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
