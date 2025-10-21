"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionUtil = void 0;
class TransactionUtil {
    static async execute(dataSource, callback, isolationLevel) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(isolationLevel);
        try {
            const result = await callback(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.TransactionUtil = TransactionUtil;
//# sourceMappingURL=transaction.util.js.map