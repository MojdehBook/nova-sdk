"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovaError = void 0;
const axios_1 = require("axios");
const showIfDevelopment = (data) => {
    return process.env.NODE_ENV === 'development' ? data : undefined;
};
class NovaError extends Error {
    constructor(message, statusCode = axios_1.HttpStatusCode.ServiceUnavailable, details) {
        super(message);
        this.name = 'NovaError';
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    serializeError() {
        var _a, _b, _c, _d, _e;
        return {
            id: (_a = this.details) === null || _a === void 0 ? void 0 : _a.id,
            code: (_b = this.details) === null || _b === void 0 ? void 0 : _b.code,
            fields: (_c = this.details) === null || _c === void 0 ? void 0 : _c.fields,
            resource: showIfDevelopment((_d = this.details) === null || _d === void 0 ? void 0 : _d.resource),
            meta: showIfDevelopment({ ...(_e = this.details) === null || _e === void 0 ? void 0 : _e.meta, stack: this === null || this === void 0 ? void 0 : this.stack }),
        };
    }
}
exports.NovaError = NovaError;
