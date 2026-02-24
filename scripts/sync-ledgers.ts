import { rebuildFinancialBalances } from "./next/actions/http/accounting-maintenance";
import { getDb } from "./data/db";

async function main() {
    console.log("🚀 Starting database synchronization for new ERP core...");
    try {
        const result = await rebuildFinancialBalances();
        if (result.success) {
            console.log("✅ Success:", result.message);
        } else {
            console.log("❌ Error:", result.message);
        }
    } catch (error) {
        console.error("💥 Fatal error during sync:", error);
    } finally {
        const ds = await getDb();
        await ds.destroy();
    }
}

main();
