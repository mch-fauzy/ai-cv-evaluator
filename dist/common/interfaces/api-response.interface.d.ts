import { PaginationMetadata } from './metadata.interface';
export interface Paginated<T> {
    metadata: PaginationMetadata;
    items: T[];
}
export interface ApiResult<T> {
    message: string;
    data: T | null;
}
