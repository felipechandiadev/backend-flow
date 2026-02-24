import 'reflect-metadata';
import { UnitDimension } from './unit-dimension.enum';
export declare class Unit {
    id: string;
    name: string;
    symbol: string;
    dimension: UnitDimension;
    conversionFactor: number;
    allowDecimals: boolean;
    isBase: boolean;
    baseUnitId?: string | null;
    baseUnit?: Unit | null;
    derivedUnits: Unit[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
