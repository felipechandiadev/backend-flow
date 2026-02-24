#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const seed_service_1 = require("./seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seedService = app.get(seed_service_1.SeedService);
    try {
        await seedService.seedFlowStore();
        console.log('\n✅ Seed ejecutado exitosamente\n');
    }
    catch (error) {
        console.error('\n❌ Error ejecutando seed:', error);
        process.exit(1);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=run-seed.js.map