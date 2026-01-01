#!/bin/bash
# verify-setup.sh
# Verify that the environment is properly configured

set -e

echo "🔍 Verifying Sturdy Parent App Setup"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

ERRORS=0

# 1. Check .env file
echo "1️⃣  Checking .env file..."
if [ -f ".env" ]; then
    print_pass ".env file exists"
    
    # Check for required variables
    if grep -q "EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here" .env; then
        print_fail "EXPO_PUBLIC_SUPABASE_URL not configured"
        ((ERRORS++))
    else
        print_pass "EXPO_PUBLIC_SUPABASE_URL configured"
    fi
    
    if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here" .env; then
        print_fail "EXPO_PUBLIC_SUPABASE_ANON_KEY not configured"
        ((ERRORS++))
    else
        print_pass "EXPO_PUBLIC_SUPABASE_ANON_KEY configured"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here" .env; then
        print_warn "SUPABASE_SERVICE_ROLE_KEY not configured (optional for local dev)"
    else
        print_pass "SUPABASE_SERVICE_ROLE_KEY configured"
    fi
else
    print_fail ".env file missing"
    echo "  Run: cp .env.example .env"
    ((ERRORS++))
fi

echo ""

# 2. Check node_modules
echo "2️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    print_pass "node_modules exists"
else
    print_fail "node_modules missing"
    echo "  Run: npm install"
    ((ERRORS++))
fi

echo ""

# 3. Check SQL schema
echo "3️⃣  Checking SQL schema..."
if [ -f "supabase/phase1_schema.sql" ]; then
    print_pass "SQL schema file exists"
    
    # Verify key components
    if grep -q "CREATE TABLE.*profiles" supabase/phase1_schema.sql; then
        print_pass "profiles table defined"
    else
        print_fail "profiles table missing"
        ((ERRORS++))
    fi
    
    if grep -q "CREATE TABLE.*children" supabase/phase1_schema.sql; then
        print_pass "children table defined"
    else
        print_fail "children table missing"
        ((ERRORS++))
    fi
    
    if grep -q "CREATE TABLE.*scripts" supabase/phase1_schema.sql; then
        print_pass "scripts table defined"
    else
        print_fail "scripts table missing"
        ((ERRORS++))
    fi
    
    if grep -q "ENABLE ROW LEVEL SECURITY" supabase/phase1_schema.sql; then
        print_pass "RLS policies included"
    else
        print_warn "RLS policies may be missing"
    fi
else
    print_fail "SQL schema file missing"
    ((ERRORS++))
fi

echo ""

# 4. Check Edge Function
echo "4️⃣  Checking Edge Function..."
if [ -f "supabase/functions/generate-script/index.ts" ]; then
    print_pass "Edge Function exists"
    
    if grep -q "gpt-4o" supabase/functions/generate-script/index.ts; then
        print_pass "GPT-4o model configured"
    else
        print_warn "GPT-4o model may not be configured"
    fi
else
    print_fail "Edge Function missing"
    ((ERRORS++))
fi

echo ""

# 5. Check Components
echo "5️⃣  Checking UI components..."

COMPONENTS=(
    "components/create/ChildSelector.tsx"
    "components/create/StruggleChips.tsx"
    "components/create/ToneSlider.tsx"
    "components/create/CrisisToggle.tsx"
    "components/create/ScriptView.tsx"
    "components/premium/UsageBar.tsx"
    "components/premium/PremiumModal.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        print_pass "$(basename $component) exists"
    else
        print_fail "$(basename $component) missing"
        ((ERRORS++))
    fi
done

echo ""

# 6. Check Integrated Screens
echo "6️⃣  Checking integrated screens..."

if [ -f "app/(tabs)/create-new.tsx" ]; then
    print_pass "Integrated Create screen exists"
else
    print_fail "Integrated Create screen missing"
    ((ERRORS++))
fi

if [ -f "app/onboarding/child-setup.tsx" ]; then
    print_pass "Onboarding flow exists"
else
    print_fail "Onboarding flow missing"
    ((ERRORS++))
fi

echo ""

# 7. Check Services
echo "7️⃣  Checking backend services..."

if [ -f "src/services/databaseService.ts" ]; then
    print_pass "Database service exists"
    
    if grep -q "getUserChildren" src/services/databaseService.ts; then
        print_pass "getUserChildren function exists"
    fi
    
    if grep -q "createChild" src/services/databaseService.ts; then
        print_pass "createChild function exists"
    fi
    
    if grep -q "saveScript" src/services/databaseService.ts; then
        print_pass "saveScript function exists"
    fi
else
    print_fail "Database service missing"
    ((ERRORS++))
fi

echo ""

# Summary
echo "======================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You're ready to:"
    echo "1. Run SQL schema in Supabase Dashboard"
    echo "2. Configure Stripe (if needed)"
    echo "3. Start development: npm run dev"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo "See NEXT_STEPS.md for detailed instructions."
    exit 1
fi
