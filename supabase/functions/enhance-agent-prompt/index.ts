
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
    1. Adding specific technical requirements and capabilities
    2. Including clear success criteria
    3. Specifying input/output formats if relevant
    4. Adding any necessary context or background information
    5. Incorporating best practices and industry standards
    Keep the enhanced description clear, professional, and well-structured.`;

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
      // Generate example output based on the enhanced description
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
              content: 'You are an expert at generating example outputs for AI agents. Create a realistic and detailed example output that matches the given job description.' 
            },
            { 
              role: 'user', 
              content: `Generate an example output for an agent with this job description:\n${enhancedText}` 
            }
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
