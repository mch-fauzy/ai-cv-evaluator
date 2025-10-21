declare const UploadQueryDto_base: import("nestjs-zod").ZodDto<import("zod").ZodObject<{
    page: import("zod").ZodPipe<import("zod").ZodTransform<number, unknown>, import("zod").ZodNumber>;
    limit: import("zod").ZodPipe<import("zod").ZodTransform<number, unknown>, import("zod").ZodNumber>;
}, import("zod/v4/core").$strip>> & {
    io: "input";
};
export declare class UploadQueryDto extends UploadQueryDto_base {
}
export {};
