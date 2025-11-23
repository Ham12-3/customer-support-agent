#!/bin/bash
# Seed the database with test users
# This creates:
#   - admin@testcompany.com / Admin123!
#   - test@testcompany.com / Test123!

echo "====================================="
echo " Database Seeding"
echo "====================================="
echo ""

cd backend/src/CustomerSupport.Api

echo "Seeding database with test users..."
dotnet run --seed-db

if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to seed database!"
    cd ../../..
    exit 1
fi

cd ../../..

echo ""
echo "====================================="
echo " Seeding Complete!"
echo "====================================="
echo ""
echo "Test credentials:"
echo "  Admin: admin@testcompany.com / Admin123!"
echo "  User:  test@testcompany.com / Test123!"
echo ""
