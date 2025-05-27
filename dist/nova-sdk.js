"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class NovaSDK {
    constructor(baseUrl, token) {
        this.baseUrl = (baseUrl || process.env.FILEUPLOAD_URL);
        this.token = (token || process.env.FILEUPLOAD_TOKEN);
        if (!this.baseUrl) {
            throw new Error('NovaSDK: baseUrl must be provided or set in process.env.FILEUPLOAD_URL');
        }
        if (!this.token) {
            throw new Error('NovaSDK: token must be provided or set in process.env.FILEUPLOAD_TOKEN');
        }
        this.api_caller = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                Authorization: this.token,
            },
        });
    }
    // Directory Management Methods
    async createDirectory(dirName, is_public = false) {
        var _a;
        if (!dirName || dirName.trim() === '') {
            throw new Error('NovaSDK: Directory name is required');
        }
        const res = await this.api_caller.post(`/manager/directory`, {
            name: dirName,
            is_public,
        });
        if (!((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.directory)) {
            throw new Error('NovaSDK: Invalid response from /manager/directory');
        }
        return res.data.data.directory;
    }
    async getDirectories(filters) {
        var _a;
        const params = {};
        if (filters) {
            if (filters.id !== undefined) {
                params.id = filters.id.toString();
            }
            if (filters.name) {
                params.name = filters.name;
            }
            if (filters.is_public !== undefined) {
                params.is_public = filters.is_public.toString();
            }
        }
        const res = await this.api_caller.get(`/manager/directory`, { params });
        if (!((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.directories)) {
            throw new Error('NovaSDK: Invalid response from /manager/directory');
        }
        return res.data.data.directories;
    }
    async deleteDirectory(id) {
        if (!id) {
            throw new Error('NovaSDK: Directory ID is required');
        }
        const res = await this.api_caller.delete(`/manager/directory/${id}`);
        if (!res.data.success) {
            throw new Error(`NovaSDK: Failed to delete directory - ${res.data.message}`);
        }
    }
    // File Upload Methods
    async uploadFiles(files, options) {
        var _a;
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error('Files array is required');
        }
        if (!options || !options.namespace) {
            throw new Error('Namespace is required in upload options');
        }
        const form = new form_data_1.default();
        // Add options to form data
        if (options.directory_name) {
            form.append('namespace', options.directory_name);
        }
        else if (options.namespace) {
            form.append('namespace', options.namespace);
        }
        if (options.preserve_name !== undefined) {
            form.append('preserve_name', options.preserve_name.toString());
        }
        if (options.tags && options.tags.length > 0) {
            form.append('tags', options.tags.join(','));
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
        if (!((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.files)) {
            throw new Error('NovaSDK: Invalid response from /upload');
        }
        return res.data.data.files;
    }
}
exports.default = NovaSDK;
