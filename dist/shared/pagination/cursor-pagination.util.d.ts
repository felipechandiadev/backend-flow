export interface CursorPaginationParams {
    limit?: number;
    after?: string;
    before?: string;
}
export interface CursorPaginationResult<T> {
    data: T[];
    cursor: {
        next: string | null;
        prev: string | null;
        hasNext: boolean;
        hasPrev: boolean;
    };
    pageInfo: {
        count: number;
        limit: number;
    };
}
export declare function buildCursorQuery<T extends {
    id: string;
}>(repository: any, params: CursorPaginationParams, alias: string, orderBy?: [string, 'ASC' | 'DESC'], whereConditions?: Record<string, any>): Promise<CursorPaginationResult<T>>;
export declare function encodeCursor(id: string): string;
export declare function decodeCursor(cursor: string): string;
export declare const CursorPagination: (...dataOrPipes: unknown[]) => ParameterDecorator;
