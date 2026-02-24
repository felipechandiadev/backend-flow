import { Repository } from 'typeorm';
import { GoldPrice } from '../domain/gold-price.entity';
import { CreateGoldPriceDto } from './dto/create-gold-price.dto';
import { UpdateGoldPriceDto } from './dto/update-gold-price.dto';
export declare class GoldPricesService {
    private readonly goldPriceRepository;
    constructor(goldPriceRepository: Repository<GoldPrice>);
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
