import { NextRequest, NextResponse } from "next/server";

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_TEMPERATURE = Number(process.env.OPENAI_TEMPERATURE || "0.7");

// System prompt based on Internal Family Systems and Attachment Theory
const SYSTEM_PROMPT = `You are Sturdy, a parenting coach based on Internal Family Systems (IFS) and Attachment Theory.

Core Principles:
- Never label a child as "bad," "lazy," or "manipulative"
- Always reframe behavior as a struggle or unmet need
- The child is a good kid having a hard time, not giving a hard time
- Behavior is communication about an internal struggle

Your response must follow this exact 3-part format:

1. VALIDATE THE PARENT (1-2 sentences)
   - Acknowledge the parent's stress and feelings without judgment
   - Show empathy for how hard this moment is
   - Example: "This moment is really hard, and it makes sense you're feeling overwhelmed."

2. PROVIDE A SCRIPT (in quotation marks)
   - Give the parent exact words to say to their child
   - Adjust language complexity based on the child's age:
     * Ages 0-9: Use simple, concrete words. Focus on co-regulation and physical connection.
       Example: "I see you're having a hard time. Let's take some deep breaths together."
     * Ages 10-13: Use "side-door" approach. Validate feelings, address executive function as biology.
       Example: "I know homework feels really tough right now. Your brain is working hard, and that's exhausting."
     * Ages 14-18: Respect autonomy, be a consultant. Hold safety boundaries while honoring independence.
       Example: "I hear that you're frustrated. I'm here if you want to talk about what's going on."
   - The script should promote secure attachment and emotional regulation
   - Put the entire script in quotation marks

3. PSYCHOLOGICAL REFRAME (1 sentence)
   - Explain the underlying psychology or attachment principle
   - Help the parent understand what's really happening beneath the behavior
   - Example: "When children act out, they're often seeking connection and co-regulation from a trusted adult."

Remember: Connection before correction. The parent is the calm, sturdy leader.`;

type ScriptRequest = {
  childName?: string;
  childAge?: number;
  childAgeYears?: number;
  neurotype?: string;
  struggle?: string;
  tone?: "gentle" | "moderate" | "firm";
  context?: string;
  scenarioType?: "SOS" | "ExecutiveFunction" | "Rupture";
  description?: string;
};

type ScriptResponse = {
  validation: string;
  script: string;
  reframe: string;
  error?: string;
};

// Sanitize user input to prevent prompt injection
function sanitizeInput(input: string | undefined | null, maxLength: number = 800): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

// Determine age-appropriate guidance
function getAgeGuidance(age?: number | null): string {
  if (age === undefined || age === null) return "age-appropriate";
  if (age <= 9) return "simple, concrete language for ages 0-9";
  if (age <= 13) return "side-door approach for ages 10-13";
  return "consultant approach for ages 14-18";
}

// Build the user prompt
function buildUserPrompt(body: ScriptRequest): string {
  const childAge = body.childAgeYears ?? body.childAge;
  const description = sanitizeInput(body.description ?? body.struggle);
  
  const lines = [
    `Scenario: ${description}`,
    `Child Age: ${childAge ?? "unknown"} years (use ${getAgeGuidance(childAge)})`,
  ];

  if (body.childName) {
    lines.push(`Child Name: ${sanitizeInput(body.childName, 120)}`);
  }
  if (body.neurotype) {
    lines.push(`Neurotype: ${sanitizeInput(body.neurotype)}`);
  }
  if (body.tone) {
    lines.push(`Requested Tone: ${body.tone}`);
  }
  if (body.context) {
    lines.push(`Additional Context: ${sanitizeInput(body.context)}`);
  }
  if (body.scenarioType) {
    lines.push(`Scenario Type: ${body.scenarioType}`);
  }

  lines.push(
    "",
    "Please respond with exactly three parts:",
    "1. Validation (acknowledge the parent's feelings)",
    "2. Script (exact words to say in quotes)",
    "3. Reframe (one sentence psychological explanation)",
  );

  return lines.join("\n");
}

// Parse the model's response
function parseModelResponse(text: string): Omit<ScriptResponse, "error"> {
  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Try to extract validation
  const validationMatch = text.match(/(?:1\.|Validation)[:\s]*(.+?)(?=(?:2\.|Script|"|$))/is);
  const validation = validationMatch?.[1]?.trim() || lines[0] || "You're doing your best in a difficult moment.";

  // Try to extract script (look for quoted text)
  const scriptMatch = text.match(/[""]([^"""]+)[""]/) || text.match(/"([^"]+)"/);
  const scriptRaw = scriptMatch?.[1] || lines.find((l) => l.includes('"'))?.replace(/"/g, "") || "I'm here with you.";
  const script = `"${scriptRaw.replace(/^[""]|[""]$/g, "")}"`;

  // Try to extract reframe
  const reframeMatch = text.match(/(?:3\.|Reframe|Psychology)[:\s]*(.+?)$/is);
  const reframe = reframeMatch?.[1]?.trim() || lines[lines.length - 1] || "Connection helps children feel safe and regulated.";

  return { validation, script, reframe };
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is not configured",
          validation: "We're experiencing a technical issue.",
          script: '"I\'m here with you, and we\'ll get through this together."',
          reframe: "Sometimes technology needs a moment too.",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = (await request.json()) as ScriptRequest;

    // Validate required fields
    const description = sanitizeInput(body.description ?? body.struggle);
    if (!description) {
      return NextResponse.json(
        { error: "description or struggle is required" },
        { status: 400 }
      );
    }

    // Build prompts
    const userPrompt = buildUserPrompt(body);

    // Call OpenAI API
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
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      const errorText = data?.error?.message || "OpenAI API request failed";
      console.error("OpenAI API error:", errorText);
      return NextResponse.json(
        {
          error: errorText,
          validation: "You're handling something really challenging right now.",
          script: '"I\'m here. We\'re safe. Let\'s breathe together."',
          reframe: "In tough moments, your presence is the most powerful tool you have.",
        },
        { status: 200 }
      );
    }

    // Parse response
    const rawText: string = data?.choices?.[0]?.message?.content || "No content returned.";
    const parsed = parseModelResponse(rawText);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Script generation failed:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to generate script",
        validation: "You're doing your best in a difficult moment.",
        script: '"I\'m here with you, and we\'ll figure this out together."',
        reframe: "Parenting is hard, and seeking support shows strength.",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
