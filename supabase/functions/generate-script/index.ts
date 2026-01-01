import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o"; // Phase 5: Use GPT-4o
const OPENAI_TEMPERATURE = Number(
  Deno.env.get("OPENAI_TEMPERATURE") ?? "0.7",
);
const MAX_INPUT_LENGTH = 800;
const MAX_CHILD_NAME_LENGTH = 120;

// Keep in sync with src/types ScenarioType
type ScenarioType = "SOS" | "ExecutiveFunction" | "Rupture";

interface ScriptRequest {
  childAge?: number;
  childAgeYears?: number;
  childName?: string;
  neurotype?: string;
  struggle?: string;
  tone?: "gentle" | "moderate" | "firm";
  context?: string;
  scenarioType?: ScenarioType;
  description?: string;
}

// Phase 5: OpenAI GPT-4o Integration with Attachment Theory System Prompt
const SYSTEM_PROMPT = `You are Sturdy. You provide scripts based on Attachment Theory. 

Always follow the 3-part format:

1. Validate the Parent
   - Acknowledge the parent's stress and feelings without judgment
   - Example: "This moment is really hard, and it makes sense you're feeling overwhelmed."

2. Reframe the Child's Identity
   - Never label a child as "bad," "lazy," or "manipulative"
   - Always frame them as: "A good kid having a hard time"
   - Separate identity from behavior
   - Example: "Your child is struggling right now, not trying to make things difficult for you."

3. Provide a Verbatim Script
   - Give the parent exact words to say, in quotation marks
   - Adjust language complexity based on the Child's Age provided in the context
   - Use age-appropriate connection strategies:
     * Ages 0-9: Focus on co-regulation, tactile connection, simple words
     * Ages 10-13: Use "side-door" approach, validate feelings, address executive function
     * Ages 14-18: Respect autonomy, be a consultant, hold safety boundaries
   - The script should promote secure attachment and emotional regulation

Core Principles:
- Identity vs. Behavior: The child is good; the behavior is the struggle
- Two Things Are True: Validate feelings AND hold boundaries
- Sturdy Leadership: Parent is the calm pilot, not reactive to turbulence
- Connection Before Correction: Build relationship before addressing behavior

Always adjust your language, tone, and approach based on the child's age for developmentally appropriate responses.`;

const DEFAULT_RESPONSE = {
  validation: "You’re carrying a lot right now, and it makes sense this feels heavy.",
  shift: "Your kid is a good kid having a hard time, not giving you a hard time.",
  script: "“I hear this is rough. I’m here with you, and we’ll figure this out together.”",
  rawModelResponse: "Fallback response: parsing or API error.",
};

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

function ageBand(age?: number | null): string {
  if (age === undefined || age === null) return "unknown (no age provided)";
  if (age <= 9) return "0-9 (co-regulation, tactile, few words)";
  if (age <= 13) return "10-13 (side-door, executive function is biology)";
  return "14-18 (consultant role, autonomy + safety boundaries)";
}

function buildUserPrompt(body: {
  description: string;
  scenarioType: ScenarioType;
  childAgeYears: number | null;
  context?: string;
  tone?: string;
  neurotype?: string;
  childName?: string;
}): string {
  const lines = [
    `Scenario Type: ${body.scenarioType}`,
    `Child Age (years): ${body.childAgeYears ?? "unknown"} — Age Band: ${ageBand(body.childAgeYears)}`,
    `Parent Description: ${body.description}`,
  ];

  if (body.context) lines.push(`Additional Context: ${body.context}`);
  if (body.neurotype) lines.push(`Neurotype: ${body.neurotype}`);
  if (body.childName) lines.push(`Child Name: ${body.childName}`);
  if (body.tone) lines.push(`Requested Tone: ${body.tone}`);

  lines.push(
    "",
    "Please respond with exactly three parts:",
    "1) Validation (one sentence validating the parent).",
    "2) Shift (one sentence reframing the child as a good kid having a hard time).",
    '3) Script (one quoted sentence the parent can say out loud, in quotes like “...” ).',
  );

  return lines.join("\n");
}

type Parsed = {
  validation: string;
  shift: string;
  script: string;
};

function parseModelResponse(text: string): Parsed {
  const validationMatch = text.match(/Validation\s*[:\-]\s*(.+)/i);
  const shiftMatch = text.match(/(?:Shift|Reframe)\s*[:\-]\s*(.+)/i);
  const scriptMatch = text.match(/Script\s*[:\-]\s*["“]?(.+?)["”]?(?:\n|$)/i);

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  const validation =
    validationMatch?.[1] || lines[0] || DEFAULT_RESPONSE.validation;
  const shift = shiftMatch?.[1] || lines[1] || DEFAULT_RESPONSE.shift;
  const quoteMatch = text.match(/[“"](.*?)[”"]/);
  const scriptRaw =
    scriptMatch?.[1] ||
    quoteMatch?.[1] ||
    lines[2] ||
    DEFAULT_RESPONSE.script;
  const script =
    scriptRaw.startsWith("“") || scriptRaw.startsWith('"')
      ? scriptRaw
      : `“${scriptRaw}”`;

  return { validation, shift, script };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "OPENAI_API_KEY is not configured",
        ...DEFAULT_RESPONSE,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body = (await req.json()) as ScriptRequest;

    const description = sanitizeInput(body.description ?? body.struggle);
    if (!description) {
      return new Response(
        JSON.stringify({ error: "description/struggle is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Prefer explicit childAgeYears; fall back to legacy childAge for callers still using the older field
    const childAgeYears = body.childAgeYears ?? body.childAge ?? null;
    const scenarioType: ScenarioType = body.scenarioType ?? "SOS";
    const context = sanitizeInput(body.context);
    const tone = body.tone;
    const neurotype = sanitizeInput(body.neurotype);
    const childName = sanitizeInput(body.childName);
    if (childName && childName.length > MAX_CHILD_NAME_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `childName must be ${MAX_CHILD_NAME_LENGTH} characters or fewer`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = buildUserPrompt({
      description,
      scenarioType,
      childAgeYears,
      context,
      tone,
      neurotype,
      childName,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: OPENAI_TEMPERATURE,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorText = data?.error?.message || "OpenAI API request failed";
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({
          ...DEFAULT_RESPONSE,
          scenarioType,
          rawModelResponse: errorText,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const rawText: string =
      data?.choices?.[0]?.message?.content || "No content returned.";
    const parsed = parseModelResponse(rawText);

    return new Response(
      JSON.stringify({
        ...parsed,
        script: parsed.script,
        scenarioType,
        rawModelResponse: rawText,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Script generation failed:", {
      message: (error as Error).message,
      name: (error as Error).name,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Failed to generate script",
        ...DEFAULT_RESPONSE,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
