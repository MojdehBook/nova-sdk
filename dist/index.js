"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class FileUploader {
    constructor(baseUrl, token) {
        this.baseUrl = (baseUrl || process.env.FILEUPLOAD_URL);
        this.token = (token || process.env.FILEUPLOAD_TOKEN);
        if (!this.baseUrl) {
            throw new Error('FileUploader: baseUrl must be provided or set in process.env.FILEUPLOAD_URL');
        }
        if (!this.token) {
            throw new Error('FileUploader: token must be provided or set in process.env.FILEUPLOAD_TOKEN');
        }
        this.api_caller = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.token,
            },
        });
    }
    async createDirectory(dirName) {
        var _a, _b;
        const res = await this.api_caller.post(`/manager/directory`, {
            name: dirName,
            is_public: false,
        });
        if (!res.data || !((_b = (_a = res.data.data) === null || _a === void 0 ? void 0 : _a.directory) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new Error('FileUploader: Invalid response from /manager/directory');
        }
        return res.data.data.directory.id;
    }
    async uploadFiles(files, options = {}) {
        const form = new form_data_1.default();
        // Add options to form data
        if (options.namespace) {
            form.append('namespace', options.namespace);
        }
        if (options.preserve_name !== undefined) {
            form.append('preserve_name', options.preserve_name.toString());
        }
        if (options.tags && options.tags.length > 0) {
            form.append('tags', options.tags.join(','));
        }
        if (options.directoryId) {
            form.append('directoryId', options.directoryId);
        }
        // Add files to form data
        for (const file of files) {
            form.append(file.fieldname, file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
        }
        const headers = form.getHeaders();
        const res = await this.api_caller.post(`/upload`, form, { headers });
        return res.data;
    }
}
exports.default = FileUploader;
