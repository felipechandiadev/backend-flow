import { GoldPricesService } from '../application/gold-prices.service';
import { CreateGoldPriceDto } from '../application/dto/create-gold-price.dto';
import { UpdateGoldPriceDto } from '../application/dto/update-gold-price.dto';
export declare class GoldPricesController {
    private readonly goldPricesService;
    constructor(goldPricesService: GoldPricesService);
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            date: string;
            valueCLP: number;
            notes: string | undefined;
            metal: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            date: string;
            valueCLP: number;
            notes: string | undefined;
            metal: string;
        };
    }>;
    create(createDto: CreateGoldPriceDto): Promise<{
        success: boolean;
        data: {
            id: string;
            date: string;
            valueCLP: number;
            notes: string | undefined;
            metal: string;
        };
    }>;
    update(id: string, updateDto: UpdateGoldPriceDto): Promise<{
        success: boolean;
        data: {
            id: string;
            date: string;
            valueCLP: number;
            notes: string | undefined;
            metal: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
