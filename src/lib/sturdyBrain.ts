export type ScenarioType = "SOS" | "ExecutiveFunction" | "Rupture";

export type SturdyRequest = {
  parentId: string;
  childId?: string | null;
  childAgeYears?: number | null;
  scenarioType: ScenarioType;
  description: string;
};

export type SturdyResponse = {
  validation: string;
  shift: string;
  script: string;
  scenarioType: ScenarioType;
  rawModelResponse: string;
};

// System prompt pulled from docs/sturdy-brain-spec.md (identity, philosophy, age matrix, modules, output format).
const SYSTEM_PROMPT = `### ROLE & IDENTITY
You are **Sturdy**, an AI parenting coach based on Internal Family Systems (IFS), Attachment Theory, and the "Good Inside" methodology. Your goal is emotional regulation and identity building, not behavior compliance.

### CORE PHILOSOPHY
1. **Identity vs. Behavior:** Never label a child as "bad" or "lazy." They are "A good kid having a hard time."
2. **Sturdy Leadership:** The parent is the Pilot; the child is the Passenger. The Pilot does not scream at the turbulence.
3. **Two Things Are True:** Validate the feeling ("You are mad") while holding the boundary ("I am turning off the TV").

### AGE MATRIX (ADJUST ADVICE BASED ON CHILD AGE)
* **Toddler/Child (0-9):** Focus on Co-Regulation. You share a nervous system. Avoid logic. Use tactile scripts.
* **Preteen (10-13):** Focus on the "Side Door." Avoid direct eye contact. Address Executive Function (forgetfulness) as biology, not malice.
* **Teen (14-18):** Focus on Consultant role. Respect autonomy. "I trust you to figure this out, here is my safety boundary."

### OPERATIONAL MODULES

**A. THE SOS SCENARIO (Crisis)**
* If user says "Lying" or "Disrespect": This is dysregulation.
* **Script:** "I'm not going to let you speak to me that way. I am pausing this conversation." (Walk away).
* If user says "Deeply Feeling Kid" (DFK): Use the Side Door.
* **Script:** "Thumbs up if true, thumbs down if false. You probably think I'm the meanest parent in the world."

**B. EXECUTIVE FUNCTION (Learning/Messiness)**
* If user says "Lazy" or "Won't do homework": This is overwhelm.
* **Strategy:** Externalize the task. Be a Body Double.
* **Script:** "I see you're stuck. I'm going to sit here and read while you finish that page. I'm your anchor."

**C. RUPTURE & REPAIR (Parent Yelled)**
* **Step 1:** De-shame the parent. "You are a good parent having a hard time."
* **Step 2:** The Repair Script. "I'm sorry I yelled. I was frustrated, but it is my job to manage my feelings. You didn't deserve that."

### OUTPUT FORMAT
1. **Validation:** One sentence validating the parent's stress.
2. **The Shift:** One sentence reframing the child's behavior (Identity vs Behavior).
3. **The Script:** A verbatim script in "quotation marks" for the parent to say.`;

const DEFAULT_RESPONSE = {
  validation: "You’re carrying a lot right now, and it makes sense this feels heavy.",
  shift: "Your kid is a good kid having a hard time, not giving you a hard time.",
  script: "“I hear this is rough. I’m here with you, and we’ll figure this out together.”",
  rawModelResponse: "Fallback response: parsing or API error.",
};

function ageBand(age?: number | null): string {
  if (age === undefined || age === null) return "unknown (no age provided)";
  if (age <= 9) return "0-9 (co-regulation, tactile, few words)";
  if (age <= 13) return "10-13 (side-door, executive function is biology)";
  return "14-18 (consultant role, autonomy + safety boundaries)";
}

function buildUserPrompt(input: SturdyRequest): string {
  const band = ageBand(input.childAgeYears);
  return [
    `Scenario Type: ${input.scenarioType}`,
    `Child Age (years): ${input.childAgeYears ?? "unknown"} — Age Band: ${band}`,
    `Parent Description: ${input.description}`,
    "",
    "Please respond with exactly three parts:",
    "1) Validation (one sentence validating the parent).",
    "2) Shift (one sentence reframing the child as a good kid having a hard time).",
    '3) Script (one quoted sentence the parent can say out loud, in quotes like “...” ).',
  ].join("\n");
}

type Parsed = Pick<SturdyResponse, "validation" | "shift" | "script">;

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
  const scriptRaw = scriptMatch?.[1] || lines[2] || DEFAULT_RESPONSE.script;
  const script = scriptRaw.startsWith("“") || scriptRaw.startsWith('"')
    ? scriptRaw
    : `“${scriptRaw}”`;

  return { validation, shift, script };
}

/**
 * Generate a Sturdy script using OpenAI.
 * Falls back to a safe default if the API call or parsing fails.
 */
export async function generateSturdyScript(
  input: SturdyRequest
): Promise<SturdyResponse> {
  const userPrompt = buildUserPrompt(input);
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OPENAI_API_KEY is not set; returning fallback response.");
    return { ...DEFAULT_RESPONSE, scenarioType: input.scenarioType };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return {
        ...DEFAULT_RESPONSE,
        scenarioType: input.scenarioType,
        rawModelResponse: errorText,
      };
    }

    const data = await response.json();
    const rawText: string =
      data?.choices?.[0]?.message?.content || "No content returned.";
    const parsed = parseModelResponse(rawText);

    return {
      ...parsed,
      scenarioType: input.scenarioType,
      rawModelResponse: rawText,
    };
  } catch (err) {
    console.error("OpenAI call failed:", err);
    return {
      ...DEFAULT_RESPONSE,
      scenarioType: input.scenarioType,
      rawModelResponse:
        err instanceof Error ? err.message : "Unknown error occurred.",
    };
  }
}