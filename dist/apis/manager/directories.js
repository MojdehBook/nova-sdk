"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectory = createDirectory;
const axios_1 = require("axios");
const apiClient_1 = __importDefault(require("../../client/apiClient"));
const errors_1 = require("../../utils/errors");
// Directory Management Methods
async function createDirectory(dirName, is_public = false) {
    if (!(dirName === null || dirName === void 0 ? void 0 : dirName.trim().length)) {
        throw new errors_1.NovaError('Directory name is required', axios_1.HttpStatusCode.InternalServerError, { resource: 'createDirectory', fields: { dirName } });
    }
    const res = await apiClient_1.default.post(`/manager/directory`, {
        name: dirName,
        is_public,
    });
    return res.directory;
}
async function getDirectories(filters) {
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
    const res = await apiClient_1.default.get(`/manager/directory`, { params });
    return res.directories;
}
