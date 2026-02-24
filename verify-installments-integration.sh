#!/bin/bash

###############################################################################
# Fase 2: Installments Integration - Automated Verification Script
# 
# This script:
# 1. Checks if migration is ready to run
# 2. Lists all created Installments files
# 3. Verifies module imports in app.module.ts
# 4. Provides DB query commands for manual testing
#
# Usage:
#   chmod +x verify-installments-integration.sh
#   ./verify-installments-integration.sh
###############################################################################

echo "======================================================================"
echo "Fase 2: Installments Integration - Verification Script"
echo "======================================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track status
ALL_OK=true

###############################################################################
# Section 1: File Existence Checks
###############################################################################
echo -e "${YELLOW}1. Checking Created Files...${NC}"
echo ""

FILES_TO_CHECK=(
    "src/modules/installments/domain/installment.entity.ts"
    "src/modules/installments/domain/installment-status.enum.ts"
    "src/modules/installments/infrastructure/installment.repository.ts"
    "src/modules/installments/application/services/installment.service.ts"
    "src/modules/installments/presentation/installment.controller.ts"
    "src/modules/installments/presentation/dto/create-installment.dto.ts"
    "src/modules/installments/presentation/dto/installment.dto.ts"
    "src/modules/installments/installments.module.ts"
    "src/shared/listeners/create-installments.listener.ts"
    "src/shared/listeners/update-installment-from-payment.listener.ts"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (NOT FOUND)"
        ALL_OK=false
    fi
done

echo ""

###############################################################################
# Section 2: Migration Check
###############################################################################
echo -e "${YELLOW}2. Migration Status...${NC}"
echo ""

MIGRATION_FILE=$(ls migrations/*CreateInstallmentsTable.ts 2>/dev/null)
if [ -n "$MIGRATION_FILE" ]; then
    echo -e "${GREEN}✓${NC} Migration found: $MIGRATION_FILE"
    echo ""
    echo "   To run migration:"
    echo "   $ npm run typeorm -- migration:run"
else
    echo -e "${RED}✗${NC} Migration file not found"
    ALL_OK=false
fi

echo ""

###############################################################################
# Section 3: Module Import Checks
###############################################################################
echo -e "${YELLOW}3. Checking Module Imports in app.module.ts...${NC}"
echo ""

if grep -q "import.*InstallmentsModule" src/app.module.ts; then
    echo -e "${GREEN}✓${NC} InstallmentsModule imported"
else
    echo -e "${RED}✗${NC} InstallmentsModule NOT imported in app.module.ts"
    ALL_OK=false
fi

if grep -q "InstallmentsModule," src/app.module.ts; then
    echo -e "${GREEN}✓${NC} InstallmentsModule added to imports array"
else
    echo -e "${RED}✗${NC} InstallmentsModule NOT in imports array"
    ALL_OK=false
fi

echo ""

###############################################################################
# Section 4: EventsModule Updates
###############################################################################
echo -e "${YELLOW}4. Checking EventsModule Updates...${NC}"
echo ""

if grep -q "CreateInstallmentsListener" src/shared/events/events.module.ts; then
    echo -e "${GREEN}✓${NC} CreateInstallmentsListener registered"
else
    echo -e "${RED}✗${NC} CreateInstallmentsListener NOT in EventsModule"
    ALL_OK=false
fi

if grep -q "UpdateInstallmentFromPaymentListener" src/shared/events/events.module.ts; then
    echo -e "${GREEN}✓${NC} UpdateInstallmentFromPaymentListener registered"
else
    echo -e "${RED}✗${NC} UpdateInstallmentFromPaymentListener NOT in EventsModule"
    ALL_OK=false
fi

if grep -q "InstallmentsModule" src/shared/events/events.module.ts; then
    echo -e "${GREEN}✓${NC} InstallmentsModule imported in EventsModule"
else
    echo -e "${RED}✗${NC} InstallmentsModule NOT imported in EventsModule"
    ALL_OK=false
fi

echo ""

###############################################################################
# Section 5: Entity & DTOs
###############################################################################
echo -e "${YELLOW}5. Checking Entity & DTOs...${NC}"
echo ""

if grep -q "@Entity" src/modules/installments/domain/installment.entity.ts; then
    echo -e "${GREEN}✓${NC} Installment entity properly decorated"
else
    echo -e "${RED}✗${NC} Installment entity NOT properly decorated"
    ALL_OK=false
fi

if grep -q "enum.*InstallmentStatus" src/modules/installments/domain/installment-status.enum.ts; then
    echo -e "${GREEN}✓${NC} InstallmentStatus enum exists"
else
    echo -e "${RED}✗${NC} InstallmentStatus enum NOT found"
    ALL_OK=false
fi

if grep -q "createInstallments" src/modules/installments/application/services/installment.service.ts; then
    echo -e "${GREEN}✓${NC} InstallmentService has createInstallments method"
else
    echo -e "${RED}✗${NC} InstallmentService missing createInstallments method"
    ALL_OK=false
fi

echo ""

###############################################################################
# Section 6: Controllers
###############################################################################
echo -e "${YELLOW}6. Checking Controller Endpoints...${NC}"
echo ""

CONTROLLER_FILE="src/modules/installments/presentation/installment.controller.ts"
ENDPOINTS=(
    "getInstallmentsByTransaction"
    "getTransactionCarteraStatus"
    "getInstallmentById"
    "getCarteraByDueDate"
    "getOverdueReport"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if grep -q "$endpoint" "$CONTROLLER_FILE"; then
        echo -e "${GREEN}✓${NC} $endpoint"
    else
        echo -e "${RED}✗${NC} $endpoint NOT found"
        ALL_OK=false
    fi
done

echo ""

###############################################################################
# Section 7: Database Setup Guide
###############################################################################
echo -e "${YELLOW}7. Next Steps for Database Setup...${NC}"
echo ""

echo "Step 1: Run the migration"
echo "  $ npm run typeorm -- migration:run"
echo ""

echo "Step 2: Verify table was created"
echo "  $ psql -U postgres -d flow_store -c \"SELECT COUNT(*) FROM installments;\""
echo ""

echo "Step 3: Check table structure"
echo "  $ psql -U postgres -d flow_store -c \"\\d installments;\""
echo ""

echo "Step 4: Check indexes"
echo "  $ psql -U postgres -d flow_store -c \"SELECT indexname FROM pg_indexes WHERE tablename = 'installments';\""
echo ""

###############################################################################
# Section 8: Testing Guide
###############################################################################
echo -e "${YELLOW}8. Manual Testing Guide...${NC}"
echo ""

echo "Test 1: Create a 3-cuota PURCHASE transaction"
echo ""
echo "  POST http://localhost:3000/transactions"
echo ""
echo '  {
    "transactionType": "PURCHASE",
    "supplierId": "YOUR_SUPPLIER_UUID",
    "centroId": "YOUR_CENTRO_UUID",
    "total": 3000,
    "description": "Test 3-cuota purchase",
    "numberOfInstallments": 3,
    "firstDueDate": "2026-03-01T00:00:00.000Z"
  }'
echo ""

echo "Expected: 3 installments auto-created in DB"
echo ""

echo "Test 2: Get installments for a transaction"
echo ""
echo "  GET http://localhost:3000/installments/transaction/YOUR_TRANSACTION_ID"
echo ""

echo "Test 3: Get cartera summary"
echo ""
echo "  GET http://localhost:3000/installments/cartera/YOUR_SUPPLIER_ID"
echo ""

echo "Test 4: Get overdue report"
echo ""
echo "  GET http://localhost:3000/installments/reports/overdue"
echo ""

echo "Test 5: Get cartera by date range"
echo ""
echo "  GET http://localhost:3000/installments/reports/cartera-by-date?fromDate=2026-03-01&toDate=2026-05-31"
echo ""

###############################################################################
# Final Status
###############################################################################
echo ""
echo "======================================================================"

if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}✓ All checks passed! System is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: npm run typeorm -- migration:run"
    echo "  2. Start app: npm run start:dev"
    echo "  3. Test endpoints (see section 8 above)"
else
    echo -e "${RED}✗ Some checks failed. Please review and fix.${NC}"
    exit 1
fi

echo "======================================================================"
