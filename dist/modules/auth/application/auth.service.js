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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const user_entity_1 = require("../../users/domain/user.entity");
let AuthService = class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(loginDto) {
        const { userName, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { userName, deletedAt: null },
            relations: ['person'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        let isValid = false;
        if (user.pass?.startsWith('$2')) {
            isValid = await bcrypt.compare(password, user.pass);
        }
        else if (user.pass) {
            const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
            if (legacyHash === user.pass) {
                isValid = true;
                try {
                    const upgradedHash = await bcrypt.hash(password, 12);
                    user.pass = upgradedHash;
                    await this.userRepository.save(user);
                }
                catch (upgradeError) {
                    console.error('Error upgrading password hash:', upgradeError);
                }
            }
        }
        if (!isValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return {
            success: true,
            user: {
                id: user.id,
                userName: user.userName,
                email: user.mail,
                rol: user.rol,
                person: user.person
                    ? {
                        id: user.person.id,
                        firstName: user.person.firstName,
                        lastName: user.person.lastName || '',
                        email: user.person.email || null,
                        phone: user.person.phone || null,
                    }
                    : null,
            },
        };
    }
    async logout(userId) {
        console.log('User logged out:', userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map