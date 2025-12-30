import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

interface ScriptRequest {
  childAge: number
  childName?: string
  neurotype?: string
  struggle: string
  tone: 'gentle' | 'moderate' | 'firm'
  context?: string
}

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove HTML-like tags
    .replace(/\n{3,}/g, "\n\n") // Limit excessive newlines
    .trim()
    .slice(0, 500); // Limit length
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { childAge, childName, neurotype, struggle, tone, context }: ScriptRequest = await req.json()

    // Validate input
    if (!childAge || !struggle || !tone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize all user inputs
    const sanitizedStruggle = sanitizeInput(struggle)
    const sanitizedName = childName ? sanitizeInput(childName) : ""
    const sanitizedNeurotype = neurotype ? sanitizeInput(neurotype) : ""
    const sanitizedContext = context ? sanitizeInput(context) : ""

    // Build the prompt based on the request
    const nameText = sanitizedName ? ` named ${sanitizedName}` : ""
    const neurotypeText = sanitizedNeurotype ? ` with ${sanitizedNeurotype}` : ""
    const contextText = sanitizedContext ? `\n\nAdditional context: ${sanitizedContext}` : ""

    const toneDescriptions = {
      gentle: "very warm, empathetic, and comforting",
      moderate: "balanced, supportive yet clear",
      firm: "direct, confident, and authoritative while still caring",
    }

    const systemPrompt = `You are an expert parenting coach specializing in child development and positive parenting strategies. You create personalized scripts that help parents communicate effectively with their children during challenging moments.`

    const userPrompt = `You are a parenting coach helping a parent talk to their ${childAge}-year-old child${nameText}${neurotypeText}.

The child is struggling with: ${sanitizedStruggle}${contextText}

Generate a calming parenting script with a ${toneDescriptions[tone]} tone. The script should:

1. Start with a calming opening (2-3 sentences) that acknowledges the situation
2. Validate the child's feelings with empathy
3. Provide clear, age-appropriate guidance in 3-5 concrete steps
4. End with a supportive closing that reinforces love and confidence

Make sure the language is appropriate for a ${childAge}-year-old child. Keep the script practical and actionable for the parent to use immediately.

Format the response as a natural script the parent can read or adapt.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMsg = data.error?.message || 'OpenAI API request failed'
      throw new Error(`OpenAI API error (${response.status}): ${errorMsg}`)
    }

    const generatedScript = data.choices[0].message.content

    return new Response(
      JSON.stringify({ script: generatedScript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    // Log error details for debugging (without sensitive data)
    console.error('Script generation failed:', {
      message: error.message,
      name: error.name,
      timestamp: new Date().toISOString(),
    })
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate script' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
