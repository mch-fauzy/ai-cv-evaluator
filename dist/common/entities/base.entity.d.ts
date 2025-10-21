export declare abstract class Base {
    id: string;
    createdAt: Date;
    createdBy?: string | null;
    updatedAt: Date;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    deletedBy?: string | null;
}
