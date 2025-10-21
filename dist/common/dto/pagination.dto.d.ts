import { z } from 'zod';
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    limit: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
declare const PaginationDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    page: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
    limit: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>> & {
    io: "input";
};
export declare class PaginationDto extends PaginationDto_base {
}
export {};
