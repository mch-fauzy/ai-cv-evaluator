"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIEmbeddingFunction = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIEmbeddingFunction {
    openai;
    model;
    constructor(apiKey, model) {
        this.openai = new openai_1.default({ apiKey });
        this.model = model;
    }
    async generate(texts) {
        const response = await this.openai.embeddings.create({
            model: this.model,
            input: texts,
        });
        return response.data.map((item) => item.embedding);
    }
}
exports.OpenAIEmbeddingFunction = OpenAIEmbeddingFunction;
//# sourceMappingURL=chromadb-openai-embedding.util.js.map