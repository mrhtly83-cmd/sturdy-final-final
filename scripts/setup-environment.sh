#!/bin/bash
# setup-environment.sh
# Automated environment setup script
# This automates everything that CAN be automated from code

set -e  # Exit on error

echo "🚀 Sturdy Parent App - Automated Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Check Prerequisites
echo "1️⃣  Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_status "Node.js $(node --version) installed"

if ! command_exists npm; then
    print_error "npm is not installed."
    exit 1
fi
print_status "npm $(npm --version) installed"

if command_exists supabase; then
    print_status "Supabase CLI $(supabase --version) installed"
    SUPABASE_CLI_AVAILABLE=true
else
    print_warning "Supabase CLI not installed (optional but recommended)"
    echo "  Install with: npm install -g supabase"
    SUPABASE_CLI_AVAILABLE=false
fi

echo ""

# 2. Install Dependencies
echo "2️⃣  Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_status "Dependencies installed"
else
    print_error "package.json not found"
    exit 1
fi

echo ""

# 3. Environment Setup
echo "3️⃣  Setting up environment variables..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created .env from .env.example"
        print_warning "Please edit .env and add your actual values:"
        echo "  - EXPO_PUBLIC_SUPABASE_URL"
        echo "  - EXPO_PUBLIC_SUPABASE_ANON_KEY"
        echo "  - SUPABASE_SERVICE_ROLE_KEY"
        echo "  - OPENAI_API_KEY (for Edge Functions)"
        echo "  - Stripe keys (if using payments)"
    else
        print_error ".env.example not found"
        exit 1
    fi
else
    print_status ".env file already exists"
fi

echo ""

# 4. Verify SQL Schema File
echo "4️⃣  Verifying SQL schema..."

if [ -f "supabase/phase1_schema.sql" ]; then
    print_status "SQL schema file found"
    LINE_COUNT=$(wc -l < supabase/phase1_schema.sql)
    print_status "Schema contains $LINE_COUNT lines"
    
    # Check for key tables
    if grep -q "CREATE TABLE.*profiles" supabase/phase1_schema.sql; then
        print_status "✓ profiles table definition found"
    fi
    if grep -q "CREATE TABLE.*children" supabase/phase1_schema.sql; then
        print_status "✓ children table definition found"
    fi
    if grep -q "CREATE TABLE.*scripts" supabase/phase1_schema.sql; then
        print_status "✓ scripts table definition found"
    fi
else
    print_error "SQL schema file not found at supabase/phase1_schema.sql"
    exit 1
fi

echo ""

# 5. Supabase CLI Setup (if available)
if [ "$SUPABASE_CLI_AVAILABLE" = true ]; then
    echo "5️⃣  Supabase CLI detected - additional options available..."
    
    print_warning "To deploy Edge Function, run:"
    echo "  supabase functions deploy generate-script"
    echo ""
    print_warning "To set Edge Function secrets, run:"
    echo "  supabase secrets set OPENAI_API_KEY=your_key_here"
    echo "  supabase secrets set OPENAI_MODEL=gpt-4o"
    echo ""
else
    echo "5️⃣  Skipping Supabase CLI setup (not installed)"
fi

echo ""

# 6. Generate TypeScript types from schema (if Supabase CLI available)
if [ "$SUPABASE_CLI_AVAILABLE" = true ]; then
    echo "6️⃣  TypeScript type generation..."
    print_warning "After running SQL schema in Supabase, generate types with:"
    echo "  supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts"
else
    echo "6️⃣  Skipping type generation (requires Supabase CLI)"
fi

echo ""

# 7. Create scripts directory if needed
echo "7️⃣  Setting up scripts directory..."
mkdir -p scripts
print_status "Scripts directory ready"

echo ""

# 8. Summary and Next Steps
echo "✅ Automated setup complete!"
echo ""
echo "📋 MANUAL STEPS REQUIRED:"
echo "========================"
echo ""
echo "1. Update .env file with your actual credentials"
echo ""
echo "2. Run SQL schema in Supabase:"
echo "   - Go to: https://app.supabase.com → Your Project → SQL Editor"
echo "   - Copy contents of: supabase/phase1_schema.sql"
echo "   - Paste and run"
echo "   - Verify tables in Table Editor"
echo ""
echo "3. Deploy Edge Function (if using Supabase CLI):"
echo "   - supabase functions deploy generate-script"
echo "   - supabase secrets set OPENAI_API_KEY=sk-..."
echo ""
echo "4. Configure Stripe (if using payments):"
echo "   - Create 3 products in Stripe Dashboard"
echo "   - Copy Price IDs or Payment Links to .env"
echo "   - Set up webhook endpoint"
echo "   - See NEXT_STEPS.md for detailed instructions"
echo ""
echo "5. Start development server:"
echo "   - npm run dev"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - NEXT_STEPS.md"
echo "   - IMPLEMENTATION_GUIDE.md"
echo ""
echo "🎉 Happy coding!"
