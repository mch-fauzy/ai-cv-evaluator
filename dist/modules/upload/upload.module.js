"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cloudinary_module_1 = require("../externals/cloudinary/cloudinary.module");
const upload_controller_1 = require("./controllers/v1/upload.controller");
const upload_entity_1 = require("./entities/upload.entity");
const upload_repository_1 = require("./repositories/upload.repository");
const upload_service_1 = require("./services/upload.service");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([upload_entity_1.Upload]), cloudinary_module_1.CloudinaryModule],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService, upload_repository_1.UploadRepository],
        exports: [upload_service_1.UploadService, upload_repository_1.UploadRepository],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map