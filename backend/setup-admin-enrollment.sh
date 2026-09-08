#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Admin Enrollment System Setup            ║${NC}"
echo -e "${BLUE}║  Eastern Mindoro College                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

# Step 1: Install Dependencies
echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install archiver
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}\n"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Step 2: Run Migration
echo -e "${YELLOW}🗄️  Step 2: Running database migration...${NC}"
node run-status-migration.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration completed successfully${NC}\n"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

# Step 3: Verify Setup
echo -e "${YELLOW}🔍 Step 3: Verifying setup...${NC}"
echo -e "${GREEN}✅ All setup steps completed!${NC}\n"

# Instructions
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Next Steps                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}1.${NC} Start the backend server:"
echo -e "   ${YELLOW}npm run xian${NC}\n"

echo -e "${GREEN}2.${NC} Start the frontend:"
echo -e "   ${YELLOW}cd ../frontend && npm run dev${NC}\n"

echo -e "${GREEN}3.${NC} Access admin dashboard:"
echo -e "   ${YELLOW}http://localhost:5173/admin/enrollments${NC}\n"

echo -e "${GREEN}4.${NC} Test API endpoints:"
echo -e "   ${YELLOW}bash test-admin-api.sh${NC}\n"

echo -e "${BLUE}📖 For detailed documentation, see:${NC}"
echo -e "   ${YELLOW}../ADMIN_ENROLLMENT_SETUP.md${NC}\n"

echo -e "${GREEN}🎉 Setup complete! Happy coding!${NC}"
