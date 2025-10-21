"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUEUE_OPTIONS = exports.JOB_NAMES = exports.QUEUE_NAMES = void 0;
exports.QUEUE_NAMES = {
    EVALUATION: 'evaluation',
};
exports.JOB_NAMES = {
    PROCESS_EVALUATION: 'process-evaluation',
};
exports.QUEUE_OPTIONS = {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100,
            age: 24 * 3600,
        },
        removeOnFail: {
            count: 500,
            age: 7 * 24 * 3600,
        },
    },
};
//# sourceMappingURL=queue.constant.js.map