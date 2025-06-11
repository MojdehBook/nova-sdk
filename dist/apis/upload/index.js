"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = uploadFiles;
const form_data_1 = __importDefault(require("form-data"));
const apiClient_1 = __importDefault(require("../../client/apiClient"));
const errors_1 = require("../../utils/errors");
const axios_1 = require("axios");
// File Upload Methods
async function uploadFiles(files, options) {
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new errors_1.NovaError('Files array is required', axios_1.HttpStatusCode.InternalServerError, { resource: 'uploadFiles', fields: { files } });
    }
    if (!(options === null || options === void 0 ? void 0 : options.namespace)) {
        throw new errors_1.NovaError('Namespace is required in upload options', axios_1.HttpStatusCode.InternalServerError, { resource: 'uploadFiles', fields: { namespace: options.namespace } });
    }
    const form = new form_data_1.default();
    // Add options to form data
    form.append('namespace', options.namespace);
    if (options.preserve_name) {
        form.append('preserve_name', options.preserve_name.toString());
    }
    if (options.tags && options.tags.length > 0) {
        form.append('tags', options.tags.map((tag) => tag.trim()).join(','));
    }
    // Add files to form data
    for (const file of files) {
        form.append(file.fieldname, file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
    }
    const headers = form.getHeaders();
    const res = await apiClient_1.default.post(`/upload`, form, { headers });
    return res.files;
}
