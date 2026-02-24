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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../domain/user.entity");
const person_entity_1 = require("../../persons/domain/person.entity");
let UsersService = class UsersService {
    constructor(userRepository, personRepository) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
    }
    async getAllUsers(search) {
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.person', 'person');
        if (search && search.trim().length > 0) {
            const q = `%${search.trim().toLowerCase()}%`;
            query.andWhere(`(
          LOWER(user.userName) LIKE :q OR
          LOWER(user.mail) LIKE :q OR
          LOWER(person.firstName) LIKE :q OR
          LOWER(person.lastName) LIKE :q OR
          LOWER(person.businessName) LIKE :q OR
          LOWER(person.documentNumber) LIKE :q
        )`, { q });
        }
        const users = await query.orderBy('user.userName', 'ASC').getMany();
        return users.map((user) => this.mapUser(user));
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['person'],
        });
        if (!user) {
            return null;
        }
        return this.mapUser(user);
    }
    async createUser(data) {
        let person = null;
        if (data.personId) {
            person = await this.personRepository.findOne({ where: { id: data.personId } });
        }
        else if (data.person) {
            const createdPerson = this.personRepository.create({
                type: data.person.type ?? person_entity_1.PersonType.NATURAL,
                firstName: data.person.firstName,
                lastName: data.person.lastName ?? undefined,
                businessName: data.person.businessName ?? undefined,
                documentType: data.person.documentType,
                documentNumber: data.person.documentNumber ?? undefined,
                email: data.person.email ?? undefined,
                phone: data.person.phone ?? undefined,
                address: data.person.address ?? undefined,
            });
            person = await this.personRepository.save(createdPerson);
        }
        const user = this.userRepository.create({
            userName: data.userName,
            mail: data.mail,
            pass: this.hashPassword(data.password),
            rol: data.rol ?? user_entity_1.UserRole.OPERATOR,
            person: person ?? undefined,
        });
        const saved = await this.userRepository.save(user);
        const created = await this.getUserById(saved.id);
        return { success: true, user: created };
    }
    async updateUser(id, data) {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['person'] });
        if (!user) {
            return { success: false, message: 'User not found', statusCode: 404 };
        }
        if (data.userName) {
            user.userName = data.userName;
        }
        if (data.mail) {
            user.mail = data.mail;
        }
        if (data.rol) {
            user.rol = data.rol;
        }
        if (user.person) {
            if (data.phone !== undefined) {
                user.person.phone = data.phone || undefined;
            }
            if (data.personDni !== undefined) {
                user.person.documentNumber = data.personDni || undefined;
            }
            if (data.personName !== undefined) {
                const parsed = this.splitName(data.personName);
                user.person.firstName = parsed.firstName;
                user.person.lastName = parsed.lastName ?? undefined;
            }
            await this.personRepository.save(user.person);
        }
        await this.userRepository.save(user);
        const updated = await this.getUserById(id);
        if (!updated) {
            return { success: false, message: 'User not found', statusCode: 404 };
        }
        return { success: true, user: updated };
    }
    async deleteUser(id) {
        const result = await this.userRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'User not found', statusCode: 404 };
        }
        return { success: true };
    }
    async changePassword(userId, password) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { success: false, message: 'User not found', statusCode: 404 };
        }
        user.pass = this.hashPassword(password);
        await this.userRepository.save(user);
        return { success: true };
    }
    async changeOwnPassword(payload) {
        if (!payload.currentUserId || !payload.newPassword) {
            return { success: false, message: 'Missing user or password', statusCode: 400 };
        }
        return this.changePassword(payload.currentUserId, payload.newPassword);
    }
    mapUser(user) {
        return {
            id: user.id,
            userName: user.userName,
            mail: user.mail,
            rol: user.rol,
            person: user.person
                ? {
                    name: this.buildPersonName(user.person),
                    dni: user.person.documentNumber ?? undefined,
                    phone: user.person.phone ?? undefined,
                }
                : undefined,
        };
    }
    buildPersonName(person) {
        const parts = [person.firstName, person.lastName].filter((value) => value && value.trim().length > 0);
        if (parts.length > 0) {
            return parts.join(' ').trim();
        }
        return person.businessName || person.firstName || 'Sin nombre';
    }
    splitName(value) {
        const trimmed = value.trim();
        if (!trimmed) {
            return { firstName: '', lastName: '' };
        }
        const [firstName, ...rest] = trimmed.split(' ');
        return { firstName, lastName: rest.length > 0 ? rest.join(' ') : undefined };
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 12);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map