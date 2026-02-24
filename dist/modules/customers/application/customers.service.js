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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../domain/customer.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
var PersonType;
(function (PersonType) {
    PersonType["NATURAL"] = "NATURAL";
    PersonType["BUSINESS"] = "BUSINESS";
})(PersonType || (PersonType = {}));
let CustomersService = class CustomersService {
    constructor(customerRepository, personRepository, transactionRepository) {
        this.customerRepository = customerRepository;
        this.personRepository = personRepository;
        this.transactionRepository = transactionRepository;
    }
    async create(createCustomerDto) {
        const { personType, firstName, lastName, businessName, documentNumber, documentType, email, phone, address, creditLimit, paymentDayOfMonth, notes } = createCustomerDto;
        let person = null;
        if (documentNumber) {
            person = await this.personRepository.findOne({
                where: { documentNumber },
                withDeleted: true,
            });
            if (person) {
                const existingCustomer = await this.customerRepository.findOne({
                    where: { personId: person.id },
                    withDeleted: true,
                });
                if (existingCustomer && !existingCustomer.deletedAt) {
                    throw new common_1.ConflictException('Ya existe un cliente con ese documento.');
                }
                if (existingCustomer && existingCustomer.deletedAt) {
                    existingCustomer.deletedAt = undefined;
                    existingCustomer.isActive = true;
                    existingCustomer.creditLimit = creditLimit || 0;
                    existingCustomer.paymentDayOfMonth = paymentDayOfMonth || 5;
                    existingCustomer.notes = notes || undefined;
                    await this.customerRepository.save(existingCustomer);
                    person.deletedAt = undefined;
                    person.type = personType;
                    person.firstName = firstName;
                    person.lastName = lastName || undefined;
                    person.businessName = businessName || undefined;
                    person.documentType = documentType;
                    person.email = email || undefined;
                    person.phone = phone || undefined;
                    person.address = address || undefined;
                    await this.personRepository.save(person);
                    const creditInfo = await this.calculateAvailableCredit(existingCustomer.id);
                    const displayName = this.buildDisplayName(person);
                    return {
                        success: true,
                        customer: {
                            customerId: existingCustomer.id,
                            personId: existingCustomer.personId,
                            displayName,
                            documentType: person.documentType || null,
                            documentNumber: person.documentNumber || null,
                            email: person.email || null,
                            phone: person.phone || null,
                            address: person.address || null,
                            creditLimit: creditInfo.creditLimit,
                            usedCredit: creditInfo.usedCredit,
                            availableCredit: creditInfo.availableCredit,
                            paymentDayOfMonth: existingCustomer.paymentDayOfMonth,
                            createdAt: existingCustomer.createdAt,
                            updatedAt: existingCustomer.updatedAt,
                        },
                    };
                }
            }
        }
        if (!person) {
            person = this.personRepository.create({
                type: personType,
                firstName,
                lastName: lastName || undefined,
                businessName: businessName || undefined,
                documentType: documentType || null,
                documentNumber: documentNumber || undefined,
                email: email || undefined,
                phone: phone || undefined,
                address: address || undefined,
            });
            await this.personRepository.save(person);
        }
        else {
            person.deletedAt = undefined;
            person.type = personType;
            person.firstName = firstName;
            person.lastName = lastName || undefined;
            person.businessName = businessName || undefined;
            person.documentType = documentType || null;
            person.documentNumber = documentNumber || undefined;
            person.email = email || undefined;
            person.phone = phone || undefined;
            person.address = address || undefined;
            await this.personRepository.save(person);
        }
        const customer = this.customerRepository.create({
            personId: person.id,
            creditLimit: creditLimit || 0,
            currentBalance: 0,
            paymentDayOfMonth: paymentDayOfMonth || 5,
            isActive: true,
            notes: notes || undefined,
        });
        await this.customerRepository.save(customer);
        const displayName = this.buildDisplayName(person);
        return {
            success: true,
            customer: {
                customerId: customer.id,
                personId: customer.personId,
                displayName,
                documentType: person.documentType || null,
                documentNumber: person.documentNumber || null,
                email: person.email || null,
                phone: person.phone || null,
                address: person.address || null,
                creditLimit: customer.creditLimit,
                usedCredit: 0,
                availableCredit: customer.creditLimit,
                paymentDayOfMonth: customer.paymentDayOfMonth,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
            },
        };
    }
    async update(customerId, updateData) {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
            relations: ['person'],
        });
        if (!customer) {
            return { success: false, error: 'Cliente no encontrado' };
        }
        if (updateData.creditLimit !== undefined) {
            customer.creditLimit = updateData.creditLimit;
        }
        if (updateData.paymentDayOfMonth !== undefined) {
            customer.paymentDayOfMonth = updateData.paymentDayOfMonth;
        }
        if (updateData.notes !== undefined) {
            customer.notes = updateData.notes;
        }
        if (updateData.isActive !== undefined) {
            customer.isActive = updateData.isActive;
        }
        const updated = await this.customerRepository.save(customer);
        return {
            success: true,
            customer: {
                customerId: updated.id,
                creditLimit: updated.creditLimit,
                paymentDayOfMonth: updated.paymentDayOfMonth,
                notes: updated.notes,
                isActive: updated.isActive,
                updatedAt: updated.updatedAt,
            },
        };
    }
    async delete(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
        });
        if (!customer) {
            return { success: false, error: 'Cliente no encontrado' };
        }
        customer.isActive = false;
        await this.customerRepository.save(customer);
        return {
            success: true,
            message: 'Cliente eliminado correctamente',
        };
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['person'],
            withDeleted: false,
        });
        if (!customer)
            return null;
        const creditInfo = await this.calculateAvailableCredit(customer.id);
        return {
            customerId: customer.id,
            personId: customer.personId,
            displayName: this.buildDisplayName(customer.person || null),
            documentType: customer.person?.documentType || null,
            documentNumber: customer.person?.documentNumber || null,
            email: customer.person?.email || null,
            phone: customer.person?.phone || null,
            address: customer.person?.address || null,
            creditLimit: creditInfo.creditLimit,
            usedCredit: creditInfo.usedCredit,
            availableCredit: creditInfo.availableCredit,
            paymentDayOfMonth: customer.paymentDayOfMonth,
            isActive: !!customer.isActive,
            notes: customer.notes || null,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };
    }
    async getPayments(customerId) {
        const payments = await this.transactionRepository.find({
            where: { customerId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        const mapped = payments.map((p) => ({
            id: p.id,
            documentNumber: p.documentNumber || null,
            type: p.transactionType || null,
            status: p.status || null,
            total: Number(p.total ?? 0),
            paymentMethod: p.paymentMethod || null,
            createdAt: p.createdAt,
        }));
        return {
            success: true,
            total: mapped.length,
            payments: mapped,
        };
    }
    async search(dto) {
        const { query = '', page = 1, pageSize = 10 } = dto;
        const qb = this.customerRepository
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.person', 'person')
            .where('1=1');
        if (query && query.trim().length > 0) {
            const q = `%${query.trim()}%`;
            qb.andWhere('(person.firstName LIKE :q OR person.lastName LIKE :q OR person.businessName LIKE :q OR person.documentNumber LIKE :q)', { q });
        }
        qb.orderBy('c.createdAt', 'DESC').skip((page - 1) * pageSize).take(pageSize);
        const [items, total] = await qb.getManyAndCount();
        const customers = items.map((c) => {
            const creditLimit = Number(c.creditLimit || 0);
            const currentBalance = Number(c.currentBalance || 0);
            const availableCredit = Math.max(0, creditLimit - currentBalance);
            return {
                customerId: c.id,
                personId: c.personId,
                displayName: this.buildDisplayName(c.person || null),
                documentNumber: c.person?.documentNumber || null,
                email: c.person?.email || null,
                phone: c.person?.phone || null,
                creditLimit,
                currentBalance,
                availableCredit,
                paymentDayOfMonth: c.paymentDayOfMonth || null,
                isActive: !!c.isActive,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            };
        });
        return { success: true, page, pageSize, total, customers };
    }
    async getPendingPayments(customerId) {
        const pending = await this.transactionRepository.find({
            where: { customerId, paymentStatus: (0, typeorm_2.Not)(transaction_entity_1.PaymentStatus.PAID) },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        const mapped = pending.map((p) => ({
            transactionId: p.id,
            documentNumber: p.documentNumber ?? null,
            transactionDate: p.createdAt,
            total: Number(p.total || 0),
            quotas: p.quotas || [],
        }));
        return mapped;
    }
    async getPurchases(customerId, status) {
        const where = { customerId, transactionType: transaction_entity_1.TransactionType.PURCHASE };
        if (status)
            where.status = status;
        const purchases = await this.transactionRepository.find({ where, order: { createdAt: 'DESC' }, take: 100 });
        return purchases.map((p) => ({
            id: p.id,
            documentNumber: p.documentNumber ?? null,
            status: p.status,
            total: Number(p.total || 0),
            createdAt: p.createdAt,
        }));
    }
    buildDisplayName(person) {
        if (!person) {
            return 'Cliente sin nombre';
        }
        if (person.businessName && person.businessName.trim().length > 0) {
            return person.businessName.trim();
        }
        const names = [person.firstName, person.lastName].filter((value) => value && value.trim().length > 0);
        if (names.length > 0) {
            return names.join(' ').trim();
        }
        return person.firstName?.trim() || 'Cliente sin nombre';
    }
    async calculateAvailableCredit(customerId) {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
        });
        if (!customer)
            return { creditLimit: 0, usedCredit: 0, availableCredit: 0 };
        const creditLimit = Number(customer.creditLimit || 0);
        const usedCredit = Number(customer.currentBalance || 0);
        const availableCredit = Math.max(0, creditLimit - usedCredit);
        return { creditLimit, usedCredit, availableCredit };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map