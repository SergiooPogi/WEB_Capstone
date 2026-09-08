#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Admin Enrollment API${NC}\n"

# Base URL
BASE_URL="http://localhost:3000/api/admin"

# You need to replace this with a valid admin token
# Get it by logging in as admin first
ADMIN_TOKEN="your-admin-token-here"

echo -e "${GREEN}1. Testing: Get All Enrollments${NC}"
curl -X GET "$BASE_URL/enrollments" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo -e "${GREEN}2. Testing: Get Enrollment Statistics${NC}"
curl -X GET "$BASE_URL/enrollments/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo -e "${GREEN}3. Testing: Filter by Status (submitted)${NC}"
curl -X GET "$BASE_URL/enrollments?status=submitted" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo -e "${GREEN}4. Testing: Search Enrollments${NC}"
curl -X GET "$BASE_URL/enrollments?search=john" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo -e "${GREEN}5. Testing: Approve Enrollment (ID: 1)${NC}"
curl -X POST "$BASE_URL/enrollments/1/approve" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "All requirements met. Approved for enrollment."
  }'
echo -e "\n"

echo -e "${GREEN}6. Testing: Reject Enrollment (ID: 2)${NC}"
curl -X POST "$BASE_URL/enrollments/2/reject" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Missing required documents. Please resubmit with complete credentials."
  }'
echo -e "\n"

echo -e "${GREEN}7. Testing: Bulk Export (IDs: 1, 2, 3)${NC}"
curl -X POST "$BASE_URL/enrollments/bulk-export" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": [1, 2, 3]
  }' \
  --output enrollments-export.zip
echo -e "\n"

echo -e "${BLUE}✅ All tests completed!${NC}"
echo -e "${BLUE}Note: Replace 'your-admin-token-here' with actual admin JWT token${NC}"
