import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatIfRequest {
  query: string;
  tone: 'balanced' | 'optimistic' | 'pessimistic';
  scope: 'personal' | 'career' | 'financial' | 'health' | 'societal' | 'global';
}

function safeExtractJson(text: string): any {
  // Remove markdown code fences if present
  let cleaned = text.trim();
  
  // Remove ```json and ``` markers
  cleaned = cleaned.replace(/^```json?\s*/i, '').replace(/```\s*$/, '');
  
  // Try to find JSON object in the text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return JSON.parse(cleaned);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, tone, scope }: WhatIfRequest = await req.json();

    if (!query?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert scenario analyst. Analyze "what if" scenarios and provide structured, thoughtful consequences.

CRITICAL: You must respond with ONLY a valid JSON object. No markdown, no code fences, no additional text.

The JSON must exactly match this schema:
{
  "summary": "A 2-3 sentence overview of the scenario and its primary implications",
  "overall_risk": "Low" | "Medium" | "High",
  "confidence": 75,
  "timeframe": "short-term" | "mid-term" | "long-term",
  "consequences": [
    {
      "title": "Brief consequence title",
      "detail": "Detailed explanation of this consequence",
      "likelihood": "Unlikely" | "Possible" | "Likely" | "Very likely",
      "impact": "Low" | "Moderate" | "High" | "Severe",
      "mitigation": "Practical steps to reduce or manage this consequence"
    }
  ],
  "alternatives": ["Alternative action 1", "Alternative action 2", "Alternative action 3"],
  "disclaimer": "A brief disclaimer about the speculative nature of this analysis"
}

Tone: ${tone}
Scope: ${scope}

Provide 3-5 consequences. Be realistic and actionable.

User query: ${query}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('Gemini API response:', JSON.stringify(data));
      throw new Error('No content in AI response');
    }

    console.log('Raw AI response:', content);

    let result;
    try {
      result = safeExtractJson(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Content was:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the response structure
    if (!result.summary || !result.overall_risk || !result.consequences || !Array.isArray(result.consequences)) {
      console.error('Invalid response structure:', result);
      throw new Error('AI response missing required fields');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in whatif function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
