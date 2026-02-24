import { CashSessionStatus } from '../../../cash-sessions/domain/cash-session.entity';
export declare class GetCashSessionsDto {
    pointOfSaleId?: string;
    status?: CashSessionStatus;
}
