#!/bin/bash

# Manual test script for POST /api/enrollments endpoint
# Make sure the server is running before executing this script

API_URL="http://localhost:3000"

echo "🧪 Testing POST /api/enrollments endpoint..."
echo ""

# Step 1: Register/Login to get token
echo "1️⃣ Logging in to get authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "   ⚠️  Login failed, trying to register..."
  REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123"
    }')
  
  TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  if [ -z "$TOKEN" ]; then
    echo "   ❌ Failed to get authentication token"
    exit 1
  fi
  echo "   ✅ User registered successfully"
else
  echo "   ✅ Logged in successfully"
fi

echo ""

# Step 2: Create enrollment
echo "2️⃣ Creating enrollment record..."
ENROLLMENT_RESPONSE=$(curl -s -X POST "${API_URL}/api/enrollments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "studentType": "New",
    "course": "BSIS",
    "semester": "First Semester",
    "academicYear": "2024-2025",
    "dateEnrolled": "2025-01-15",
    "familyName": "Doe",
    "firstName": "John",
    "middleName": "Smith",
    "sex": "Male",
    "dateOfBirth": "2000-01-01",
    "email": "test@example.com",
    "mobileNumber": "09123456789"
  }')

echo "   📄 Response:"
echo "$ENROLLMENT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ENROLLMENT_RESPONSE"

echo ""
echo "=================================================="
echo "✅ Test completed!"
echo "=================================================="
echo ""
echo "Verify the following in the response:"
echo "  ✓ Has 'id' field"
echo "  ✓ Has 'userId' field"
echo "  ✓ status is 'submitted'"
echo "  ✓ studentType is 'New'"
echo "  ✓ course is 'BSIS'"
echo "  ✓ Has 'createdAt' and 'updatedAt' timestamps"
