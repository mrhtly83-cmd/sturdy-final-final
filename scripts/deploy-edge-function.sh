#!/bin/bash
# deploy-edge-function.sh
# Automated Edge Function deployment (requires Supabase CLI)

set -e

echo "🚀 Deploying Supabase Edge Function"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase >/dev/null 2>&1; then
    print_error "Supabase CLI is not installed"
    echo ""
    echo "Install with: npm install -g supabase"
    echo "Or see: https://supabase.com/docs/guides/cli"
    exit 1
fi

print_status "Supabase CLI found"

# Check if logged in
if ! supabase projects list >/dev/null 2>&1; then
    print_warning "Not logged in to Supabase CLI"
    echo ""
    echo "Login with: supabase login"
    exit 1
fi

print_status "Logged in to Supabase"

# Check if Edge Function exists
if [ ! -f "supabase/functions/generate-script/index.ts" ]; then
    print_error "Edge Function not found at supabase/functions/generate-script/index.ts"
    exit 1
fi

print_status "Edge Function found"

# Deploy
echo ""
echo "Deploying generate-script function..."
supabase functions deploy generate-script

print_status "Function deployed"

echo ""
echo "📝 Next steps:"
echo "============="
echo ""
echo "1. Set Edge Function secrets:"
echo "   supabase secrets set OPENAI_API_KEY=sk-your_key_here"
echo "   supabase secrets set OPENAI_MODEL=gpt-4o"
echo ""
echo "2. Test the function:"
echo "   curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/generate-script \\"
echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"childAge\": 7, \"description\": \"Test situation\", \"tone\": \"gentle\"}'"
echo ""
echo "✅ Deployment complete!"
