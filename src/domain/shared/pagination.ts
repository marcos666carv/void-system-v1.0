export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SortParams {
    field: string;
    order: 'asc' | 'desc';
}

export function paginate<T>(items: T[], params: PaginationParams): PaginatedResult<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / params.limit);
    const start = (params.page - 1) * params.limit;
    const data = items.slice(start, start + params.limit);

    return { data, total, page: params.page, limit: params.limit, totalPages };
}
