"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const bcrypt = require("bcryptjs");
const company_entity_1 = require("../modules/companies/domain/company.entity");
const branch_entity_1 = require("../modules/branches/domain/branch.entity");
const user_entity_1 = require("../modules/users/domain/user.entity");
const person_entity_1 = require("../modules/persons/domain/person.entity");
const customer_entity_1 = require("../modules/customers/domain/customer.entity");
const supplier_entity_1 = require("../modules/suppliers/domain/supplier.entity");
const shareholder_entity_1 = require("../modules/shareholders/domain/shareholder.entity");
const tax_entity_1 = require("../modules/taxes/domain/tax.entity");
const category_entity_1 = require("../modules/categories/domain/category.entity");
const price_list_entity_1 = require("../modules/price-lists/domain/price-list.entity");
const storage_entity_1 = require("../modules/storages/domain/storage.entity");
const attribute_entity_1 = require("../modules/attributes/domain/attribute.entity");
const unit_entity_1 = require("../modules/units/domain/unit.entity");
const gold_price_entity_1 = require("../modules/gold-prices/domain/gold-price.entity");
const accounting_account_entity_1 = require("../modules/accounting-accounts/domain/accounting-account.entity");
const expense_category_entity_1 = require("../modules/expense-categories/domain/expense-category.entity");
const accounting_rule_entity_1 = require("../modules/accounting-rules/domain/accounting-rule.entity");
const transaction_entity_1 = require("../modules/transactions/domain/transaction.entity");
const organizational_unit_entity_1 = require("../modules/organizational-units/domain/organizational-unit.entity");
const employee_entity_1 = require("../modules/employees/domain/employee.entity");
let SeedService = SeedService_1 = class SeedService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async seedFlowStore() {
        this.logger.log('💎 FlowStore Joyería - Seed Inicial');
        this.logger.log('═══════════════════════════════════════════════════════════');
        await this.cleanCorruptData();
        await this.verifyConnection();
        await this.resetDatabase();
        await this.createSeedData();
        this.logger.log('✅ Seed completado exitosamente');
    }
    async cleanCorruptData() {
        this.logger.log('🧹 Limpiando datos corruptos...');
        try {
            await this.dataSource.query("DELETE FROM permissions WHERE ability IS NULL OR ability = ''");
            this.logger.log('   ✓ Datos corruptos limpiados');
        }
        catch (error) {
            this.logger.warn('   ⚠ No se pudieron limpiar datos (tabla puede no existir aún)');
        }
    }
    async verifyConnection() {
        this.logger.log('🔄 Verificando conexión a base de datos...');
        try {
            await this.dataSource.query('SELECT 1');
            this.logger.log('   ✓ Conexión verificada correctamente');
        }
        catch (error) {
            this.logger.error('   ✗ Error verificando conexión:', error);
            throw error;
        }
    }
    async resetDatabase() {
        this.logger.log('🧨 Reiniciando base de datos...');
        const queryRunner = this.dataSource.createQueryRunner();
        let foreignKeysDisabled = false;
        try {
            await queryRunner.connect();
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
            foreignKeysDisabled = true;
            const tables = await queryRunner.query(`SELECT table_name AS tableName 
           FROM information_schema.tables 
           WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'`);
            const tablesToSkip = new Set(['migrations', 'typeorm_metadata']);
            for (const { tableName } of tables) {
                if (!tableName || tablesToSkip.has(tableName)) {
                    continue;
                }
                await queryRunner.query(`TRUNCATE TABLE \`${tableName}\``);
            }
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
            foreignKeysDisabled = false;
            this.logger.log('   ✓ Base de datos reiniciada');
        }
        catch (error) {
            this.logger.warn('   ⚠ No se pudo reiniciar la base de datos:', error);
            throw error;
        }
        finally {
            if (foreignKeysDisabled) {
                try {
                    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
                }
                catch (fkError) {
                    this.logger.warn('   ⚠ No se pudieron restaurar llaves foráneas automáticamente');
                }
            }
            await queryRunner.release();
        }
    }
    async createSeedData() {
        this.logger.log('🏢 Creando datos iniciales...');
        try {
            const companies = await this.readSeedJson('companies.json');
            const users = await this.readSeedJson('users.json');
            const shareholders = await this.readSeedJson('shareholders.json');
            const units = await this.readSeedJson('units.json');
            const customers = await this.readSeedJson('customers.json');
            const suppliers = await this.readSeedJson('suppliers.json');
            const employees = await this.readSeedJson('employees.json');
            const branches = await this.readSeedJson('branches.json');
            const storages = await this.readSeedJson('storages.json');
            const organizationalUnits = await this.readSeedJson('organizational-units.json');
            const priceLists = await this.readSeedJson('price-lists.json');
            const taxes = await this.readSeedJson('taxes.json');
            const goldPrices = await this.readSeedJson('gold-prices.json');
            const accountingAccounts = await this.readSeedJson('accounting-accounts.json');
            const accountingRules = await this.readSeedJson('accounting-rules.json');
            const productCategories = await this.readSeedJson('categories.json');
            const expenseCategories = await this.readSeedJson('expense-categories.json');
            const companyMap = new Map();
            const branchMap = new Map();
            const categoryMap = new Map();
            const accountMap = new Map();
            const taxMap = new Map();
            const organizationalUnitMap = new Map();
            const expenseCategoryMap = new Map();
            if (companies && companies.length > 0) {
                for (const companyData of companies) {
                    const company = this.dataSource.manager.create(company_entity_1.Company, {
                        name: companyData.businessName || companyData.name || 'Default Company',
                        defaultCurrency: companyData.defaultCurrency || 'CLP',
                        fiscalYearStart: companyData.fiscalYearStart,
                        isActive: true,
                        bankAccounts: companyData.bankAccounts || [],
                    });
                    const savedCompany = await this.dataSource.manager.save(company);
                    companyMap.set(companyData.name || 'joyarte-spa', savedCompany);
                    this.logger.log(`   ✓ Empresa '${savedCompany.name}' creada`);
                }
            }
            const defaultCompany = companyMap.values().next().value;
            if (taxes && taxes.length > 0 && defaultCompany) {
                for (const taxData of taxes) {
                    const tax = this.dataSource.manager.create(tax_entity_1.Tax, {
                        companyId: defaultCompany.id,
                        name: taxData.name,
                        code: taxData.code,
                        taxType: taxData.taxType
                            ? this.parseEnum(tax_entity_1.TaxType, taxData.taxType, 'tax.taxType')
                            : tax_entity_1.TaxType.IVA,
                        rate: taxData.rate ?? 0,
                        description: taxData.description ?? undefined,
                        isDefault: !!taxData.isDefault,
                        isActive: taxData.isActive !== false,
                    });
                    const savedTax = await this.dataSource.manager.save(tax);
                    if (taxData.code) {
                        taxMap.set(taxData.code, savedTax);
                    }
                    this.logger.log(`   ✓ Impuesto '${taxData.name}' creado`);
                }
            }
            if (goldPrices && goldPrices.length > 0) {
                for (const priceData of goldPrices) {
                    const goldPrice = this.dataSource.manager.create(gold_price_entity_1.GoldPrice, {
                        metal: priceData.metal || 'Oro 18K',
                        date: new Date(priceData.date),
                        valueCLP: priceData.valueCLP,
                        notes: priceData.notes ?? undefined,
                    });
                    await this.dataSource.manager.save(goldPrice);
                    this.logger.log(`   ✓ Precio metal '${goldPrice.metal}' creado`);
                }
            }
            if (accountingAccounts && accountingAccounts.length > 0 && defaultCompany) {
                for (const accountData of accountingAccounts) {
                    const parent = accountData.parentRef ? accountMap.get(accountData.parentRef) : null;
                    const account = this.dataSource.manager.create(accounting_account_entity_1.AccountingAccount, {
                        companyId: defaultCompany.id,
                        code: accountData.code,
                        name: accountData.name,
                        type: this.parseEnum(accounting_account_entity_1.AccountType, accountData.type, `accountingAccounts.${accountData.code}`),
                        parentId: parent?.id ?? null,
                        isActive: accountData.isActive !== false,
                    });
                    const savedAccount = await this.dataSource.manager.save(account);
                    if (accountData.ref) {
                        accountMap.set(accountData.ref, savedAccount);
                    }
                    this.logger.log(`   ✓ Cuenta contable '${accountData.code} ${accountData.name}' creada`);
                }
            }
            if (accountingRules && accountingRules.length > 0 && defaultCompany) {
                for (const ruleData of accountingRules) {
                    const debitAccount = accountMap.get(ruleData.debitAccountRef);
                    const creditAccount = accountMap.get(ruleData.creditAccountRef);
                    if (!debitAccount || !creditAccount) {
                        this.logger.warn(`   ⚠ Regla contable '${ruleData.ref ?? ruleData.transactionType}' omitida: cuenta no encontrada`);
                        continue;
                    }
                    const tax = ruleData.taxCode ? taxMap.get(ruleData.taxCode) : null;
                    const rule = this.dataSource.manager.create(accounting_rule_entity_1.AccountingRule, {
                        companyId: defaultCompany.id,
                        appliesTo: this.parseEnum(accounting_rule_entity_1.RuleScope, ruleData.appliesTo, 'accountingRules.appliesTo'),
                        transactionType: this.parseEnum(transaction_entity_1.TransactionType, ruleData.transactionType, 'accountingRules.transactionType'),
                        paymentMethod: ruleData.paymentMethod
                            ? this.parseEnum(transaction_entity_1.PaymentMethod, ruleData.paymentMethod, 'accountingRules.paymentMethod')
                            : null,
                        debitAccountId: debitAccount.id,
                        creditAccountId: creditAccount.id,
                        taxId: tax?.id ?? null,
                        expenseCategoryId: null,
                        priority: ruleData.priority ?? 0,
                        isActive: ruleData.isActive !== false,
                    });
                    await this.dataSource.manager.save(rule);
                    this.logger.log(`   ✓ Regla contable '${ruleData.ref ?? ruleData.transactionType}' creada`);
                }
            }
            if (expenseCategories && expenseCategories.length > 0 && defaultCompany) {
                for (const categoryData of expenseCategories) {
                    const category = this.dataSource.manager.create(expense_category_entity_1.ExpenseCategory, {
                        companyId: defaultCompany.id,
                        code: categoryData.code,
                        name: categoryData.name,
                        groupName: categoryData.groupName ?? undefined,
                        description: categoryData.description ?? undefined,
                        requiresApproval: categoryData.requiresApproval ?? false,
                        approvalThreshold: categoryData.approvalThreshold?.toString() ?? '0',
                        defaultResultCenterId: null,
                        isActive: categoryData.isActive !== false,
                        examples: categoryData.examples ?? [],
                        metadata: categoryData.metadata ?? null,
                    });
                    const savedCategory = await this.dataSource.manager.save(category);
                    if (categoryData.ref) {
                        expenseCategoryMap.set(categoryData.ref, savedCategory);
                    }
                    this.logger.log(`   ✓ Categoría de gasto '${categoryData.name}' creada`);
                }
            }
            if (productCategories && productCategories.length > 0) {
                for (const categoryData of productCategories) {
                    if (!categoryData.parentRef) {
                        const category = this.dataSource.manager.create(category_entity_1.Category, {
                            name: categoryData.name,
                            description: categoryData.description ?? undefined,
                            parentId: undefined,
                            sortOrder: categoryData.sortOrder ?? 0,
                            isActive: categoryData.isActive !== false,
                            imagePath: categoryData.imagePath ?? undefined,
                            resultCenterId: undefined,
                        });
                        const savedCategory = await this.dataSource.manager.save(category);
                        if (categoryData.ref) {
                            categoryMap.set(categoryData.ref, savedCategory);
                        }
                        this.logger.log(`   ✓ Categoría de producto '${categoryData.name}' creada`);
                    }
                }
                for (const categoryData of productCategories) {
                    if (categoryData.parentRef) {
                        const parent = categoryMap.get(categoryData.parentRef);
                        if (parent) {
                            const category = this.dataSource.manager.create(category_entity_1.Category, {
                                name: categoryData.name,
                                description: categoryData.description ?? undefined,
                                parentId: parent.id,
                                sortOrder: categoryData.sortOrder ?? 0,
                                isActive: categoryData.isActive !== false,
                                imagePath: categoryData.imagePath ?? undefined,
                                resultCenterId: undefined,
                            });
                            const savedCategory = await this.dataSource.manager.save(category);
                            if (categoryData.ref) {
                                categoryMap.set(categoryData.ref, savedCategory);
                            }
                            this.logger.log(`   ✓ Categoría de producto '${categoryData.name}' (hijo de ${categoryData.parentRef}) creada`);
                        }
                        else {
                            this.logger.warn(`   ⚠ Categoría '${categoryData.name}' omitida: categoría padre '${categoryData.parentRef}' no encontrada`);
                        }
                    }
                }
            }
            if (branches && branches.length > 0) {
                for (const branchData of branches) {
                    const branch = this.dataSource.manager.create(branch_entity_1.Branch, {
                        companyId: defaultCompany?.id,
                        name: branchData.name,
                        address: branchData.address ?? null,
                        phone: branchData.phone ?? null,
                        location: branchData.location ?? null,
                        isActive: true,
                        isHeadquarters: !!branchData.isHeadquarters,
                    });
                    const savedBranch = await this.dataSource.manager.save(branch);
                    if (branchData.ref) {
                        branchMap.set(branchData.ref, savedBranch);
                    }
                    this.logger.log(`   ✓ Sucursal '${branchData.name}' creada`);
                }
            }
            if (organizationalUnits && organizationalUnits.length > 0 && defaultCompany) {
                for (const unitData of organizationalUnits) {
                    const branch = unitData.branchRef ? branchMap.get(unitData.branchRef) : null;
                    const parent = unitData.parentRef ? organizationalUnitMap.get(unitData.parentRef) : null;
                    const unit = this.dataSource.manager.create(organizational_unit_entity_1.OrganizationalUnit, {
                        companyId: defaultCompany.id,
                        code: unitData.code,
                        name: unitData.name,
                        description: unitData.description ?? undefined,
                        unitType: unitData.unitType
                            ? this.parseEnum(organizational_unit_entity_1.OrganizationalUnitType, unitData.unitType, 'organizationalUnit.unitType')
                            : organizational_unit_entity_1.OrganizationalUnitType.OTHER,
                        parentId: parent?.id ?? null,
                        branchId: branch?.id ?? null,
                        resultCenterId: null,
                        isActive: unitData.isActive !== false,
                        metadata: unitData.metadata ?? undefined,
                    });
                    const savedUnit = await this.dataSource.manager.save(unit);
                    if (unitData.ref) {
                        organizationalUnitMap.set(unitData.ref, savedUnit);
                    }
                    this.logger.log(`   ✓ Unidad organizacional '${unitData.name}' creada`);
                }
            }
            if (storages && storages.length > 0) {
                for (const storageData of storages) {
                    const branch = storageData.branchRef ? branchMap.get(storageData.branchRef) : null;
                    const storage = this.dataSource.manager.create(storage_entity_1.Storage, {
                        branchId: branch?.id ?? null,
                        name: storageData.name,
                        code: storageData.code ?? undefined,
                        type: storageData.type
                            ? this.parseEnum(storage_entity_1.StorageType, storageData.type, 'storage.type')
                            : storage_entity_1.StorageType.WAREHOUSE,
                        category: storageData.category
                            ? this.parseEnum(storage_entity_1.StorageCategory, storageData.category, 'storage.category')
                            : storage_entity_1.StorageCategory.IN_BRANCH,
                        capacity: storageData.capacity ?? null,
                        location: storageData.location ?? null,
                        isDefault: !!storageData.isDefault,
                        isActive: storageData.isActive !== false,
                    });
                    await this.dataSource.manager.save(storage);
                    this.logger.log(`   ✓ Almacen '${storageData.name}' creado`);
                }
            }
            if (priceLists && priceLists.length > 0) {
                for (const priceListData of priceLists) {
                    const priceList = this.dataSource.manager.create(price_list_entity_1.PriceList, {
                        name: priceListData.name,
                        priceListType: priceListData.priceListType
                            ? this.parseEnum(price_list_entity_1.PriceListType, priceListData.priceListType, 'priceList.priceListType')
                            : price_list_entity_1.PriceListType.RETAIL,
                        currency: priceListData.currency || 'CLP',
                        validFrom: priceListData.validFrom ? new Date(priceListData.validFrom) : undefined,
                        validUntil: priceListData.validUntil ? new Date(priceListData.validUntil) : undefined,
                        priority: priceListData.priority ?? 0,
                        isDefault: !!priceListData.isDefault,
                        isActive: priceListData.isActive !== false,
                        description: priceListData.description ?? undefined,
                    });
                    await this.dataSource.manager.save(priceList);
                    this.logger.log(`   ✓ Lista de precios '${priceListData.name}' creada`);
                }
            }
            if (shareholders && shareholders.length > 0 && defaultCompany) {
                for (const shareholderData of shareholders) {
                    const person = this.dataSource.manager.create(person_entity_1.Person, {
                        type: person_entity_1.PersonType.NATURAL,
                        firstName: shareholderData.person?.firstName,
                        lastName: shareholderData.person?.lastName,
                        documentType: (shareholderData.person?.documentType || 'RUT'),
                        documentNumber: shareholderData.person?.documentNumber,
                        email: shareholderData.person?.email,
                        phone: shareholderData.person?.phone,
                    });
                    const savedPerson = await this.dataSource.manager.save(person);
                    const shareholder = this.dataSource.manager.create(shareholder_entity_1.Shareholder, {
                        company: defaultCompany,
                        person: savedPerson,
                        role: shareholderData.role,
                        ownershipPercentage: shareholderData.ownershipPercentage,
                        notes: shareholderData.notes,
                        isActive: true,
                    });
                    await this.dataSource.manager.save(shareholder);
                    this.logger.log(`   ✓ Socio '${shareholderData.person?.firstName} ${shareholderData.person?.lastName}' creado (${shareholderData.ownershipPercentage}%)`);
                }
            }
            if (users && users.length > 0) {
                for (const userData of users) {
                    const personType = userData.person?.type === 'COMPANY' ? person_entity_1.PersonType.COMPANY : person_entity_1.PersonType.NATURAL;
                    const person = this.dataSource.manager.create(person_entity_1.Person, {
                        type: personType,
                        firstName: userData.person?.firstName || 'Admin',
                        lastName: userData.person?.lastName || 'User',
                        businessName: userData.person?.businessName,
                        documentType: (userData.person?.documentType || 'RUT'),
                        documentNumber: userData.person?.documentNumber || '0000000-0',
                        email: userData.person?.email || `${userData.userName}@flowstore.local`,
                        phone: userData.person?.phone,
                        address: userData.person?.address,
                    });
                    const savedPerson = await this.dataSource.manager.save(person);
                    const user = this.dataSource.manager.create(user_entity_1.User, {
                        userName: userData.userName,
                        pass: this.hashPassword(userData.password),
                        mail: userData.person?.email || `${userData.userName}@flowstore.local`,
                        rol: (userData.role || userData.rol || 'ADMIN'),
                        person: savedPerson,
                    });
                    await this.dataSource.manager.save(user);
                    this.logger.log(`   ✓ Usuario '${userData.userName}' creado exitosamente`);
                }
            }
            if (units && units.length > 0) {
                for (const unitData of units) {
                    const unit = this.dataSource.manager.create(unit_entity_1.Unit, {
                        name: unitData.name,
                        symbol: unitData.symbol,
                        dimension: unitData.dimension,
                        conversionFactor: unitData.conversionFactor || 1,
                        allowDecimals: unitData.allowDecimals || false,
                        isBase: unitData.isBase || false,
                        active: true,
                    });
                    await this.dataSource.manager.save(unit);
                    this.logger.log(`   ✓ Unidad de medida '${unitData.symbol}' creada`);
                }
            }
            const attributes = await this.readSeedJson('attributes.json');
            if (attributes && attributes.length > 0) {
                for (const attrData of attributes) {
                    try {
                        const attribute = this.dataSource.manager.create(attribute_entity_1.Attribute, {
                            name: attrData.name,
                            description: attrData.description ?? undefined,
                            options: Array.isArray(attrData.options) ? attrData.options : [],
                            displayOrder: typeof attrData.displayOrder === 'number' ? attrData.displayOrder : 0,
                            isActive: attrData.isActive !== false,
                        });
                        await this.dataSource.manager.save(attribute);
                        this.logger.log(`   ✓ Atributo '${attrData.name}' creado`);
                    }
                    catch (err) {
                        this.logger.warn(`   ⚠ No se pudo crear atributo '${attrData.name}': ${err?.message || err}`);
                    }
                }
            }
            if (customers && customers.length > 0) {
                for (const customerData of customers) {
                    const personType = customerData.person?.type === 'COMPANY' ? person_entity_1.PersonType.COMPANY : person_entity_1.PersonType.NATURAL;
                    const person = this.dataSource.manager.create(person_entity_1.Person, {
                        type: personType,
                        firstName: customerData.person?.firstName || (personType === person_entity_1.PersonType.COMPANY ? 'Company' : 'Cliente'),
                        lastName: customerData.person?.lastName || (personType === person_entity_1.PersonType.COMPANY ? 'Business' : ''),
                        businessName: customerData.person?.businessName,
                        documentType: (customerData.person?.documentType || 'RUT'),
                        documentNumber: customerData.person?.documentNumber,
                        email: customerData.person?.email,
                        phone: customerData.person?.phone,
                    });
                    const savedPerson = await this.dataSource.manager.save(person);
                    const customer = this.dataSource.manager.create(customer_entity_1.Customer, {
                        person: savedPerson,
                        customerType: customerData.customerType || 'RETAIL',
                        paymentTerms: customerData.paymentTerms,
                        creditLimit: customerData.creditLimit || 0,
                        notes: customerData.notes,
                        isActive: true,
                    });
                    await this.dataSource.manager.save(customer);
                    const customerName = customerData.person?.businessName || `${customerData.person?.firstName} ${customerData.person?.lastName}`;
                    this.logger.log(`   ✓ Cliente '${customerName}' creado`);
                }
            }
            if (suppliers && suppliers.length > 0) {
                for (const supplierData of suppliers) {
                    const personType = supplierData.person?.type === 'COMPANY' ? person_entity_1.PersonType.COMPANY : person_entity_1.PersonType.NATURAL;
                    const person = this.dataSource.manager.create(person_entity_1.Person, {
                        type: personType,
                        firstName: supplierData.person?.firstName || (personType === person_entity_1.PersonType.COMPANY ? 'Company' : 'Proveedor'),
                        lastName: supplierData.person?.lastName || (personType === person_entity_1.PersonType.COMPANY ? 'Business' : ''),
                        businessName: supplierData.person?.businessName,
                        documentType: (supplierData.person?.documentType || 'RUT'),
                        documentNumber: supplierData.person?.documentNumber,
                        email: supplierData.person?.email,
                        phone: supplierData.person?.phone,
                        address: supplierData.person?.address,
                        bankAccounts: supplierData.bankAccounts ? supplierData.bankAccounts.map((account) => ({
                            bankName: account.bankName,
                            accountTypeName: account.accountTypeName,
                            accountNumber: account.accountNumber,
                            currency: account.currency || 'CLP',
                        })) : [],
                    });
                    const savedPerson = await this.dataSource.manager.save(person);
                    const supplier = this.dataSource.manager.create(supplier_entity_1.Supplier, {
                        person: savedPerson,
                        supplierType: supplierData.supplierType || 'GENERAL',
                        creditTerms: supplierData.creditTerms,
                        creditLimit: supplierData.creditLimit || 0,
                        paymentTerms: supplierData.paymentTerms,
                        notes: supplierData.notes,
                        isActive: true,
                    });
                    await this.dataSource.manager.save(supplier);
                    const supplierName = supplierData.person?.businessName || `${supplierData.person?.firstName} ${supplierData.person?.lastName}`;
                    this.logger.log(`   ✓ Proveedor '${supplierName}' creado con cuentas bancarias`);
                }
            }
            if (employees && employees.length > 0 && defaultCompany) {
                for (const employeeData of employees) {
                    const person = this.dataSource.manager.create(person_entity_1.Person, {
                        type: person_entity_1.PersonType.NATURAL,
                        firstName: employeeData.person?.firstName || 'Empleado',
                        lastName: employeeData.person?.lastName || '',
                        documentType: (employeeData.person?.documentType || 'RUT'),
                        documentNumber: employeeData.person?.documentNumber,
                        email: employeeData.person?.email,
                        phone: employeeData.person?.phone,
                        address: employeeData.person?.address,
                    });
                    const savedPerson = await this.dataSource.manager.save(person);
                    const branch = employeeData.branchRef ? branchMap.get(employeeData.branchRef) : null;
                    const employee = this.dataSource.manager.create(employee_entity_1.Employee, {
                        companyId: defaultCompany.id,
                        personId: savedPerson.id,
                        branchId: branch?.id || null,
                        employmentType: this.parseEnum(employee_entity_1.EmploymentType, employeeData.employmentType || 'FULL_TIME', 'employee.employmentType'),
                        status: this.parseEnum(employee_entity_1.EmployeeStatus, employeeData.status || 'ACTIVE', 'employee.status'),
                        hireDate: employeeData.hireDate,
                        terminationDate: employeeData.terminationDate || null,
                        baseSalary: employeeData.baseSalary?.toString() || null,
                        metadata: {
                            position: employeeData.position,
                            department: employeeData.department,
                        },
                    });
                    await this.dataSource.manager.save(employee);
                    const employeeName = `${employeeData.person?.firstName} ${employeeData.person?.lastName}`;
                    this.logger.log(`   ✓ Empleado '${employeeName}' creado (${employeeData.position || 'Sin cargo'})`);
                }
            }
            this.logger.log('✅ Seed completado exitosamente');
        }
        catch (error) {
            this.logger.error('❌ Error ejecutando seed:', error.message);
            throw error;
        }
    }
    async readSeedJson(fileName) {
        try {
            const filePath = (0, path_1.join)(__dirname, 'data', fileName);
            const raw = await (0, promises_1.readFile)(filePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 12);
    }
    parseEnum(enumObject, raw, context) {
        const enumRecord = enumObject;
        if (Object.prototype.hasOwnProperty.call(enumRecord, raw)) {
            return enumRecord[raw];
        }
        const normalizedRaw = raw.toLowerCase();
        for (const [key, value] of Object.entries(enumRecord)) {
            if (key.toLowerCase() === normalizedRaw ||
                value.toLowerCase() === normalizedRaw) {
                return value;
            }
        }
        throw new Error(`Valor inválido para ${context}: ${raw}`);
    }
    ensureArray(data, fileName) {
        if (!data || data.length === 0) {
            throw new Error(`El archivo ${fileName} debe contener al menos un registro.`);
        }
        return data;
    }
    buildPersonDisplayName(person) {
        if (person.type === person_entity_1.PersonType.COMPANY) {
            return person.businessName?.trim() || person.firstName || 'Empresa sin nombre';
        }
        const parts = [person.firstName, person.lastName]
            .map((value) => (typeof value === 'string' ? value.trim() : ''))
            .filter((value) => value.length > 0);
        if (parts.length > 0) {
            return parts.join(' ');
        }
        if (person.businessName && person.businessName.trim().length > 0) {
            return person.businessName.trim();
        }
        return person.documentNumber?.trim() || 'Persona sin identificación';
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SeedService);
//# sourceMappingURL=seed.service.js.map