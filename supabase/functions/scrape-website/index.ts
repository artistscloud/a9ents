
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      console.error('URL not provided')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'URL is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 but with success: false
        }
      )
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    console.log('Starting scrape for URL:', url)

    if (!apiKey) {
      console.error('Firecrawl API key not found')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Firecrawl API key not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 but with success: false
        }
      )
    }

    const response = await fetch('https://api.firecrawl.xyz/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ url })
    })

    const data = await response.json()
    console.log('Firecrawl API response:', data)

    if (!response.ok) {
      console.error('Firecrawl API error:', data)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: data.message || 'Failed to scrape website'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 but with success: false
        }
      )
    }

    // Always return 200 with success: true/false
    return new Response(
      JSON.stringify({
        success: true,
        title: data.title || url,
        content: data.content || ''
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in scrape-website function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even for errors, but with success: false
      }
    )
  }
})
