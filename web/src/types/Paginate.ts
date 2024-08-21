export type PaginatedResults<D> = {
    total: number;
    limit: number;
    pages: number;
    page: number;
    rows: D[];
};
