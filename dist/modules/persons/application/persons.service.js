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
exports.PersonsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const person_entity_1 = require("../domain/person.entity");
let PersonsService = class PersonsService {
    constructor(personsRepository) {
        this.personsRepository = personsRepository;
    }
    async findAll(params) {
        const { term, limit = 50, type, includeInactive = false, } = params || {};
        const queryBuilder = this.personsRepository
            .createQueryBuilder('person');
        if (!includeInactive) {
            queryBuilder.andWhere('person.deletedAt IS NULL');
        }
        else {
            queryBuilder.withDeleted();
        }
        if (type) {
            queryBuilder.andWhere('person.type = :type', { type });
        }
        if (term && term.trim()) {
            const searchTerm = `%${term.trim()}%`;
            queryBuilder.andWhere('(person.firstName LIKE :searchTerm ' +
                'OR person.lastName LIKE :searchTerm ' +
                'OR person.businessName LIKE :searchTerm ' +
                'OR person.documentNumber LIKE :searchTerm)', { searchTerm });
        }
        if (limit && limit > 0) {
            queryBuilder.limit(limit);
        }
        queryBuilder.orderBy('person.firstName', 'ASC');
        return await queryBuilder.getMany();
    }
    async findOne(id, includeInactive = false) {
        const queryBuilder = this.personsRepository
            .createQueryBuilder('person')
            .where('person.id = :id', { id });
        if (includeInactive) {
            queryBuilder.withDeleted();
        }
        const person = await queryBuilder.getOne();
        if (!person) {
            throw new common_1.NotFoundException(`Person with ID ${id} not found`);
        }
        return person;
    }
    async create(data) {
        const person = this.personsRepository.create(data);
        return await this.personsRepository.save(person);
    }
    async update(id, data) {
        const person = await this.findOne(id);
        Object.assign(person, data);
        return await this.personsRepository.save(person);
    }
    async remove(id) {
        const person = await this.findOne(id);
        await this.personsRepository.softRemove(person);
        return { message: 'Person deleted successfully' };
    }
    async addBankAccount(personId, accountData) {
        const person = await this.findOne(personId);
        if (!person.bankAccounts) {
            person.bankAccounts = [];
        }
        const accountKey = `${accountData.bankName}_${accountData.accountNumber}_${Date.now()}`;
        const newAccount = {
            ...accountData,
            accountKey,
        };
        if (newAccount.isPrimary) {
            person.bankAccounts = person.bankAccounts.map(acc => ({
                ...acc,
                isPrimary: false,
            }));
        }
        person.bankAccounts.push(newAccount);
        const savedPerson = await this.personsRepository.save(person);
        return savedPerson;
    }
    async removeBankAccount(personId, accountKey) {
        const person = await this.findOne(personId);
        if (!person.bankAccounts || person.bankAccounts.length === 0) {
            throw new common_1.NotFoundException('No bank accounts found for this person');
        }
        const accountIndex = person.bankAccounts.findIndex(acc => acc.accountKey === accountKey);
        if (accountIndex === -1) {
            throw new common_1.NotFoundException(`Bank account with key ${accountKey} not found`);
        }
        person.bankAccounts.splice(accountIndex, 1);
        await this.personsRepository.save(person);
        return { message: 'Bank account removed successfully' };
    }
};
exports.PersonsService = PersonsService;
exports.PersonsService = PersonsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PersonsService);
//# sourceMappingURL=persons.service.js.map