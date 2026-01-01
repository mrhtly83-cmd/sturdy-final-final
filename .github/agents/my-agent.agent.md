---
# Fill in the fields below to create a basic custom agent for your repository.
# The Copilot CLI can be used for local testing: https://gh.io/customagents/cli
# To make this agent available, merge this file into the default repository branch.
# For format details, see: https://gh.io/customagents/config

name:
description:


# sturdy Agent

STURDY DASHBOARD 

+-------------------------------------------------------+
|  [Logo] STURDY                 [Profile: Emma (10) ▾] | <--- Age Toggle
+-------------------------------------------------------+
|                                                       |
|   +-----------------------------------------------+   |
|   |                                               |   |
|   |               [ PULSING ICON ]                |   |
|   |                                               |   |
|   |               I NEED HELP NOW                 |   | <--- The SOS Button
|   |         "Script me through a crisis"          |   |      (Sticky Hero)
|   |                                               |   |
|   +-----------------------------------------------+   |
|                                                       |
|  --- THE WORK --------------------------------------  |
|                                                       |
|  [ Tabs:  BEHAVIOR  |  LEARNING  |  SOCIAL  ]         | <--- Category Filters
|                                                       |
|  +---------------------+   +---------------------+    |
|  |  [Brain Icon]       |   |  [Map Icon]         |    |
|  |  Executive Function |   |  Sturdy Leadership  |    |
|  |  "Focus & Messiness"|   |  "Boundaries"       |    |
|  +---------------------+   +---------------------+    |
|                                                       |
|  +---------------------+   +---------------------+    |
|  |  [Tree Icon]        |   |  [Shield Icon]      |    |
|  |  Resilient Learner  |   |  Social Wiring      |    |
|  |  "Grades & Giving Up"|  |  "Bullying/Peers"   |    |
|  +---------------------+   +---------------------+    |
|                                                       |
|  --- DAILY PRACTICE --------------------------------  |
|                                                       |
|  [ + Log a Rupture ]  [ View Repair Streak: 12 🔥 ]   |
|                                                       |
+-------------------------------------------------------+
|  [Home]      [Chat with Sturdy]      [Profile]        |
+-------------------------------------------------------+

1. PRODUCT IDENTITY (The "Vibe")
• Name: STURDY
• Tagline: Be the Pilot, Not the Passenger.
• Philosophy: Based on "Good Inside" (Dr. Becky), Internal Family Systems (IFS), and Attachment Theory.
• Target Audience: Parents of children (0-18) who want a psychological, identity-based approach to parenting.
• Aesthetic: "Clinical Luxury." Minimalist, high whitespace, calm.
• Background: #F8FAFC (Off-White/Slate 50)
• Primary Text: #0F172A (Deep Navy)
• Accents: #94A3B8 (Muted Sage/Slate 400)
• Alert/SOS: #CA8A04 (Muted Clay/Gold - No bright reds)
• Font: Inter or Helvetica Neue.

2. THE DATABASE SCHEMA (The Backend)
You will use Supabase. Copy and paste this SQL code into the SQL Editor in your Supabase dashboard to set up the backend instantly.

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  is_premium boolean default false,
  credits_used int default 0,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Children Table (For Age-Based Logic)
create table public.children (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  name text not null,
  birth_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Ruptures Table (For the Journal)
create table public.ruptures (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  child_id uuid references public.children,
  trigger_event text not null, -- "I yelled" or "He hit me"
  ai_response text, -- The script generated
  repair_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) so users only see their own data
alter table public.users enable row level security;
alter table public.children enable row level security;
alter table public.ruptures enable row level security;

-- Create Policy (Simple version for MVP)
create policy "Users can view their own data" on public.users for all using (auth.uid() = id);
create policy "Users can view their own children" on public.children for all using (auth.uid() = user_id);
create policy "Users can view their own ruptures" on public.ruptures for all using (auth.uid() = user_id);

3. THE AI BRAIN (The System Prompt)
This is the most important part. Copy this entire block. This goes into your OpenAI API Call as the system message.
SYSTEM PROMPT START:

### ROLE & IDENTITY
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
3. **The Script:** A verbatim script in "quotation marks" for the parent to say.

SYSTEM PROMPT END
4. THE FRONTEND BLUEPRINT (For the Builder)
Copy and paste the text below into Replit Agent or Lovable to generate the UI.

BUILDER PROMPT: "I want to build a React/Supabase app called STURDY.

DESIGN SYSTEM: 

Font: Inter.

Colors: Background #F8FAFC, Text #0F172A, Button #334155.

Vibe: Clinical, Minimalist, High-end. No cartoons.

CORE FEATURES:

1. The Context Header:
 Top Right: A dropdown to switch between 'Children Profiles' (fetch from Supabase children table).

Logic: When I select a child, store their DOB/Age in state. Pass this age to the AI for every request.

2. The SOS Hero (Top Section):
A large, centered container.

Text: 'I NEED HELP NOW'.

Subtext: 'Get a script for the turbulence.'

Action: Clicking opens a Modal with a text input ('What is happening?').

Backend Logic: Send input + Child Age + System Prompt to OpenAI. Display the result clearly.
