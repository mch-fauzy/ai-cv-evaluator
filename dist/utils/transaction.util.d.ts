import { DataSource, QueryRunner } from 'typeorm';
export declare class TransactionUtil {
    static execute<T>(dataSource: DataSource, callback: (queryRunner: QueryRunner) => Promise<T>, isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE'): Promise<T>;
}
