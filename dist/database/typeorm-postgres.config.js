"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const config_1 = require("../config");
exports.typeOrmConfig = {
    type: 'postgres',
    host: config_1.postgresConfig.HOST,
    port: config_1.postgresConfig.PORT,
    database: config_1.postgresConfig.DATABASE,
    username: config_1.postgresConfig.USERNAME,
    password: config_1.postgresConfig.PASSWORD,
    ssl: config_1.postgresConfig.SSL
        ? {
            rejectUnauthorized: config_1.postgresConfig.SSL_REJECT_UNAUTHORIZED,
        }
        : false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: config_1.postgresConfig.SYNCHRONIZE,
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    extra: {
        options: `-c timezone=${config_1.postgresConfig.TIMEZONE}`,
    },
};
exports.default = new typeorm_1.DataSource(exports.typeOrmConfig);
//# sourceMappingURL=typeorm-postgres.config.js.map