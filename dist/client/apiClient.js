"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const errors_1 = require("../utils/errors");
const apiClient = axios_1.default.create({
    baseURL: config_1.baseUrl,
    headers: {
        Authorization: config_1.token,
    },
});
apiClient.interceptors.response.use((response) => {
    var _a, _b;
    if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.success) && ((_b = response.data) === null || _b === void 0 ? void 0 : _b.data))
        return response.data.data;
    return response.data;
}, (error) => {
    var _a, _b, _c;
    const statusCode = error.response.status;
    const message = (_b = (_a = error.response.data.message) !== null && _a !== void 0 ? _a : error.response.statusText) !== null && _b !== void 0 ? _b : error.message;
    const details = (_c = error.response.data.error) !== null && _c !== void 0 ? _c : {};
    throw new errors_1.NovaError(message, statusCode, details);
});
exports.default = apiClient;
