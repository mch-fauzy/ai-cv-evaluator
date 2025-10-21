"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const upload_entity_1 = require("../entities/upload.entity");
let UploadRepository = class UploadRepository {
    uploadRepo;
    constructor(uploadRepo) {
        this.uploadRepo = uploadRepo;
    }
    async create(data) {
        const upload = this.uploadRepo.create(data);
        return await this.uploadRepo.save(upload);
    }
    async findById(id) {
        return await this.uploadRepo.findOneBy({ id });
    }
    async findOrFailById(id) {
        const upload = await this.uploadRepo.findOneBy({ id });
        if (!upload) {
            throw new common_1.NotFoundException(`Upload with id ${id} not found`);
        }
        return upload;
    }
    async findByIds(ids) {
        return await this.uploadRepo.findBy({ id: (0, typeorm_2.In)(ids) });
    }
    async getList(page, limit) {
        const skip = (page - 1) * limit;
        const [uploads, totalUploads] = await this.uploadRepo.findAndCount({
            skip,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
        return { uploads, totalUploads };
    }
};
exports.UploadRepository = UploadRepository;
exports.UploadRepository = UploadRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UploadRepository);
//# sourceMappingURL=upload.repository.js.map