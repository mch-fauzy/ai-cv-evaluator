import { PaginationMetadata } from '../interfaces/metadata.interface';
interface PaginationInput {
    count: number;
    page: number;
    perPage: number;
}
export declare class PaginationUtil {
    static mapMetadata(params: PaginationInput): PaginationMetadata;
}
export {};
