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
var CashSessionCoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashSessionCoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cash_session_entity_1 = require("../domain/cash-session.entity");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
let CashSessionCoreService = CashSessionCoreService_1 = class CashSessionCoreService {
    constructor(cashSessionRepository, pointOfSaleRepository, userRepository, dataSource, transactionsService) {
        this.cashSessionRepository = cashSessionRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.transactionsService = transactionsService;
        this.logger = new common_1.Logger(CashSessionCoreService_1.name);
    }
    async findOne(id) {
        const cashSession = await this.cashSessionRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['pointOfSale', 'openedBy', 'openedBy.person', 'closedBy', 'closedBy.person'],
        });
        if (!cashSession) {
            return { success: false, message: 'Sesión de caja no encontrada' };
        }
        let movements = [];
        try {
            movements = await this.transactionsService.getMovementsForSession(id);
        }
        catch (e) {
            this.logger?.warn(`No se pudieron cargar movimientos para sesión ${id}: ${e}`);
        }
        return {
            success: true,
            cashSession: {
                ...cashSession,
                openedBy: cashSession.openedBy
                    ? {
                        id: cashSession.openedBy.id,
                        userName: cashSession.openedBy.userName,
                        person: cashSession.openedBy.person
                            ? {
                                firstName: cashSession.openedBy.person.firstName,
                                lastName: cashSession.openedBy.person.lastName,
                            }
                            : null,
                    }
                    : null,
                closedBy: cashSession.closedBy
                    ? {
                        id: cashSession.closedBy.id,
                        userName: cashSession.closedBy.userName,
                        person: cashSession.closedBy.person
                            ? {
                                firstName: cashSession.closedBy.person.firstName,
                                lastName: cashSession.closedBy.person.lastName,
                            }
                            : null,
                    }
                    : null,
            },
            movements,
        };
    }
    async findAll(query) {
        const qb = this.cashSessionRepository
            .createQueryBuilder('cs')
            .leftJoinAndSelect('cs.pointOfSale', 'pointOfSale')
            .leftJoinAndSelect('pointOfSale.branch', 'pointOfSaleBranch')
            .leftJoinAndSelect('cs.openedBy', 'openedBy')
            .leftJoinAndSelect('openedBy.person', 'openedByPerson')
            .leftJoinAndSelect('cs.closedBy', 'closedBy')
            .leftJoinAndSelect('closedBy.person', 'closedByPerson');
        if (query.pointOfSaleId) {
            qb.andWhere('cs.pointOfSaleId = :pointOfSaleId', { pointOfSaleId: query.pointOfSaleId });
        }
        if (query.status) {
            qb.andWhere('cs.status = :status', { status: query.status });
        }
        qb.orderBy('cs.createdAt', 'DESC');
        const [items, total] = await qb.take(100).getManyAndCount();
        const mapped = items.map(cs => ({
            ...cs,
            pointOfSaleName: cs.pointOfSale?.name || null,
            branchName: cs.pointOfSale?.branch?.name || null,
            openedByUserName: cs.openedBy?.userName || null,
            openedByFullName: cs.openedBy?.person ?
                `${cs.openedBy.person.firstName} ${cs.openedBy.person.lastName}` : null,
            closedByUserName: cs.closedBy?.userName || null,
            closedByFullName: cs.closedBy?.person ?
                `${cs.closedBy.person.firstName} ${cs.closedBy.person.lastName}` : null,
        }));
        return { success: true, total, items: mapped };
    }
    async open(openDto) {
        const { userId, userName, pointOfSaleId, openingAmount } = openDto;
        const pointOfSale = await this.pointOfSaleRepository.findOne({
            where: { id: pointOfSaleId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['branch'],
        });
        if (!pointOfSale) {
            throw new common_1.NotFoundException('El punto de venta especificado no existe.');
        }
        const companyId = pointOfSale.branch?.companyId;
        if (!companyId) {
            throw new common_1.BadRequestException('No se pudo determinar la empresa asociada al punto de venta.');
        }
        let validatedUser = null;
        if (userId) {
            validatedUser = await this.userRepository.findOne({ where: { id: userId, deletedAt: (0, typeorm_2.IsNull)() } });
        }
        if (!validatedUser && userName) {
            validatedUser = await this.userRepository.findOne({ where: { userName, deletedAt: (0, typeorm_2.IsNull)() } });
        }
        if (!validatedUser) {
            throw new common_1.NotFoundException('El usuario especificado no existe.');
        }
        const result = await this.dataSource.transaction(async (manager) => {
            const cashSessionRepo = manager.getRepository(cash_session_entity_1.CashSession);
            const existingOpenSession = await cashSessionRepo.findOne({
                where: {
                    pointOfSaleId: pointOfSale.id,
                    status: cash_session_entity_1.CashSessionStatus.OPEN,
                },
            });
            if (existingOpenSession) {
                if (existingOpenSession.openedById !== validatedUser.id) {
                    throw new common_1.ConflictException('El punto de venta ya tiene una sesión abierta por otro usuario. Cierre la sesión existente primero.');
                }
                return existingOpenSession;
            }
            const openedAt = new Date();
            const newSession = cashSessionRepo.create({
                pointOfSaleId: pointOfSale.id,
                openedById: validatedUser.id,
                openingAmount,
                openedAt,
                status: cash_session_entity_1.CashSessionStatus.OPEN,
            });
            return await cashSessionRepo.save(newSession);
        });
        try {
            const txDto = new create_transaction_dto_1.CreateTransactionDto();
            txDto.transactionType = transaction_entity_1.TransactionType.CASH_SESSION_OPENING;
            txDto.branchId = pointOfSale.branchId || '';
            txDto.userId = validatedUser.id;
            txDto.pointOfSaleId = pointOfSale.id;
            txDto.cashSessionId = result.id;
            txDto.subtotal = openingAmount;
            txDto.taxAmount = 0;
            txDto.discountAmount = 0;
            txDto.total = openingAmount;
            txDto.paymentMethod = transaction_entity_1.PaymentMethod.CASH;
            txDto.amountPaid = openingAmount;
            txDto.changeAmount = 0;
            txDto.documentType = 'TICKET';
            txDto.notes = undefined;
            txDto.metadata = {};
            await this.transactionsService.createTransaction(txDto);
        }
        catch (txErr) {
            this.logger.warn(`Opening transaction for session ${result.id} failed: ${txErr}`);
        }
        const userWithPerson = await this.userRepository.findOne({
            where: { id: validatedUser.id },
            relations: ['person'],
        });
        return {
            success: true,
            cashSession: {
                id: result.id,
                pointOfSaleId: result.pointOfSaleId,
                openedById: result.openedById,
                status: result.status,
                openingAmount: Number(result.openingAmount),
                openedAt: result.openedAt,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                expectedAmount: result.expectedAmount ? Number(result.expectedAmount) : null,
                closingAmount: result.closingAmount ? Number(result.closingAmount) : null,
                closedAt: result.closedAt || null,
                difference: result.difference ? Number(result.difference) : null,
                notes: result.notes || null,
                closingDetails: result.closingDetails || null,
                openedBy: userWithPerson
                    ? {
                        id: userWithPerson.id,
                        userName: userWithPerson.userName,
                        person: userWithPerson.person
                            ? {
                                id: userWithPerson.person.id,
                                firstName: userWithPerson.person.firstName,
                                lastName: userWithPerson.person.lastName,
                            }
                            : null,
                    }
                    : null,
            },
            pointOfSale: {
                id: pointOfSale.id,
                name: pointOfSale.name,
                deviceId: pointOfSale.deviceId || null,
                branchId: pointOfSale.branchId || null,
                branchName: pointOfSale.branch?.name || null,
                priceLists: Array.isArray(pointOfSale.priceLists) ? pointOfSale.priceLists : [],
            },
        };
    }
    async closeByUserName(sessionId, userName) {
        const trimmedUserName = userName?.trim();
        if (!trimmedUserName) {
            throw new common_1.BadRequestException('userName es requerido para cerrar la sesión');
        }
        const user = await this.userRepository.findOne({
            where: { userName: trimmedUserName },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario ${trimmedUserName} no encontrado`);
        }
        return this.close(sessionId, user.id);
    }
    async close(sessionId, userId) {
        const session = await this.cashSessionRepository.findOne({
            where: { id: sessionId },
            relations: ['pointOfSale'],
        });
        if (!session) {
            throw new common_1.NotFoundException(`Sesión ${sessionId} no encontrada`);
        }
        if (session.status !== cash_session_entity_1.CashSessionStatus.OPEN) {
            throw new common_1.ConflictException(`No se puede cerrar sesión en estado ${session.status}`);
        }
        const expectedAmount = await this.transactionsService.getTotalSalesForSession(sessionId);
        const closedBy = await this.userRepository.findOne({ where: { id: userId } });
        if (!closedBy) {
            throw new common_1.NotFoundException('Usuario que cierra no encontrado');
        }
        let branchId = session.pointOfSale?.branchId;
        if (!branchId && session.pointOfSaleId) {
            const pos = await this.pointOfSaleRepository.findOne({
                where: { id: session.pointOfSaleId },
                relations: ['branch'],
            });
            branchId = pos?.branchId || pos?.branch?.id || undefined;
        }
        if (!branchId) {
            throw new common_1.BadRequestException('No se pudo determinar la sucursal (branchId) para la sesión de caja.');
        }
        let closingTxId = null;
        if (Number(expectedAmount) >= 0.01) {
            const txDto = new create_transaction_dto_1.CreateTransactionDto();
            txDto.transactionType = transaction_entity_1.TransactionType.CASH_SESSION_CLOSING;
            txDto.branchId = branchId;
            txDto.userId = closedBy.id;
            txDto.pointOfSaleId = session.pointOfSaleId;
            txDto.cashSessionId = session.id;
            txDto.subtotal = expectedAmount;
            txDto.taxAmount = 0;
            txDto.discountAmount = 0;
            txDto.total = expectedAmount;
            txDto.paymentMethod = transaction_entity_1.PaymentMethod.CASH;
            txDto.amountPaid = expectedAmount;
            txDto.lines = [];
            txDto.notes = 'Cierre automático de sesión de caja';
            const closingTx = await this.transactionsService.createTransaction(txDto);
            closingTxId = closingTx.id;
        }
        session.status = cash_session_entity_1.CashSessionStatus.CLOSED;
        session.closedAt = new Date();
        session.closedById = closedBy.id;
        session.expectedAmount = expectedAmount;
        session.closingAmount = expectedAmount;
        session.difference = 0;
        await this.cashSessionRepository.save(session);
        return {
            success: true,
            message: 'Sesión cerrada correctamente',
            sessionId,
            closingTransactionId: closingTxId,
            expectedAmount,
        };
    }
    async reconcile(sessionId, physicalAmount) {
        const session = await this.cashSessionRepository.findOne({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Sesión ${sessionId} no encontrada`);
        }
        const expectedAmount = session.expectedAmount ?? 0;
        const discrepancy = physicalAmount - Number(expectedAmount);
        return {
            success: true,
            reconciliation: {
                sessionId,
                expectedAmount: Number(expectedAmount),
                physicalAmount,
                discrepancy,
                requiresAdjustment: Math.abs(discrepancy) > 0,
            },
        };
    }
    async getStats(sessionId) {
        const session = await this.cashSessionRepository.findOne({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Sesión ${sessionId} no encontrada`);
        }
        return {
            success: true,
            stats: {
                sessionId,
                openedAt: session.openedAt,
                closedAt: session.closedAt,
                status: session.status,
                expectedAmount: session.expectedAmount,
                closingAmount: session.closingAmount,
                difference: session.difference,
            },
        };
    }
};
exports.CashSessionCoreService = CashSessionCoreService;
exports.CashSessionCoreService = CashSessionCoreService = CashSessionCoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cash_session_entity_1.CashSession)),
    __param(1, (0, typeorm_1.InjectRepository)(point_of_sale_entity_1.PointOfSale)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => transactions_service_1.TransactionsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        transactions_service_1.TransactionsService])
], CashSessionCoreService);
//# sourceMappingURL=cash-session-core.service.js.map