import { Repository } from 'typeorm';
import { GoldPrice } from '../../modules/gold-prices/domain/gold-price.entity';
export interface GoldPriceDTO {
    id?: string;
    date: string;
    valueCLP: number;
    notes?: string;
    metal: string;
}
export declare class GoldPriceService {
    private readonly goldPriceRepository;
    constructor(goldPriceRepository: Repository<GoldPrice>);
    getGoldPrices(): Promise<GoldPriceDTO[]>;
    saveGoldPrice(data: GoldPriceDTO): Promise<{
        success: boolean;
        error?: string;
    }>;
}
