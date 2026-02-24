"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorPagination = void 0;
exports.buildCursorQuery = buildCursorQuery;
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
async function buildCursorQuery(repository, params, alias, orderBy = ['id', 'DESC'], whereConditions) {
    const limit = Math.min(params.limit || 100, 1000);
    const [sortField, sortDirection] = orderBy;
    let queryBuilder = repository.createQueryBuilder(alias);
    if (whereConditions) {
        Object.entries(whereConditions).forEach(([key, value], index) => {
            if (index === 0) {
                queryBuilder = queryBuilder.where(`${alias}.${key} = :${key}`, { [key]: value });
            }
            else {
                queryBuilder = queryBuilder.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
            }
        });
    }
    if (params.after) {
        const cursorRecord = await repository.findOne({
            where: { id: params.after },
            select: [sortField, 'id'],
        });
        if (cursorRecord) {
            const operator = sortDirection === 'DESC' ? '<' : '>';
            queryBuilder = queryBuilder.andWhere(`(${alias}.${sortField} ${operator} :cursorValue OR (${alias}.${sortField} = :cursorValue AND ${alias}.id ${operator} :cursorId))`, {
                cursorValue: cursorRecord[sortField],
                cursorId: params.after,
            });
        }
    }
    if (params.before) {
        const cursorRecord = await repository.findOne({
            where: { id: params.before },
            select: [sortField, 'id'],
        });
        if (cursorRecord) {
            const operator = sortDirection === 'DESC' ? '>' : '<';
            queryBuilder = queryBuilder.andWhere(`(${alias}.${sortField} ${operator} :cursorValue OR (${alias}.${sortField} = :cursorValue AND ${alias}.id ${operator} :cursorId))`, {
                cursorValue: cursorRecord[sortField],
                cursorId: params.before,
            });
        }
    }
    queryBuilder = queryBuilder
        .orderBy(`${alias}.${sortField}`, sortDirection)
        .addOrderBy(`${alias}.id`, sortDirection);
    const results = await queryBuilder.take(limit + 1).getMany();
    const hasNext = results.length > limit;
    const data = hasNext ? results.slice(0, limit) : results;
    const nextCursor = hasNext && data.length > 0 ? data[data.length - 1].id : null;
    const prevCursor = data.length > 0 ? data[0].id : null;
    return {
        data: data,
        cursor: {
            next: nextCursor,
            prev: prevCursor,
            hasNext,
            hasPrev: !!params.after || !!params.before,
        },
        pageInfo: {
            count: data.length,
            limit,
        },
    };
}
function encodeCursor(id) {
    return Buffer.from(id).toString('base64url');
}
function decodeCursor(cursor) {
    return Buffer.from(cursor, 'base64url').toString('utf-8');
}
const common_1 = require("@nestjs/common");
exports.CursorPagination = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    return {
        limit: query.limit ? parseInt(query.limit, 10) : 100,
        after: query.after ? decodeCursor(query.after) : undefined,
        before: query.before ? decodeCursor(query.before) : undefined,
    };
});
//# sourceMappingURL=cursor-pagination.util.js.map