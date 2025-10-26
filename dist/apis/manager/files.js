"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = getFile;
exports.getMetadata = getMetadata;
exports.deleteFile = deleteFile;
const axios_1 = require("axios");
const apiClient_1 = __importDefault(require("../../client/apiClient"));
const errors_1 = require("../../utils/errors");
// File Management Methods
async function getFile(fileId, variant) {
    var _a, _b;
    if (!(fileId === null || fileId === void 0 ? void 0 : fileId.trim().length)) {
        throw new errors_1.NovaError('File id is required', axios_1.HttpStatusCode.InternalServerError, { resource: 'getFile', fields: { fileId } });
    }
    const res = await apiClient_1.default.get(`/manager/file/${fileId}`, {
        responseType: 'stream',
        params: { v: variant },
    });
    return {
        contentType: (_a = res.headers['content-type']) !== null && _a !== void 0 ? _a : 'application/octet-stream',
        contentDisposition: (_b = res.headers['content-disposition']) !== null && _b !== void 0 ? _b : 'attachment; filename=file.bin',
        data: res.data,
    };
}
async function getMetadata(fileId) {
    if (!(fileId === null || fileId === void 0 ? void 0 : fileId.trim().length)) {
        throw new errors_1.NovaError('File id is required', axios_1.HttpStatusCode.InternalServerError, { resource: 'getFile', fields: { fileId } });
    }
    const res = await apiClient_1.default.get(`/manager/file/${fileId}/metadata`);
    return res.file;
}
async function deleteFile(fileId) {
    if (!(fileId === null || fileId === void 0 ? void 0 : fileId.trim().length)) {
        throw new errors_1.NovaError('File id is required', axios_1.HttpStatusCode.InternalServerError, { resource: 'getFile', fields: { fileId } });
    }
    await apiClient_1.default.delete(`/manager/file/${fileId}`);
    return;
}
