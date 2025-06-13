"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.baseUrl = void 0;
const axios_1 = require("axios");
const errors_1 = require("../utils/errors");
const path_1 = __importDefault(require("path"));
const Env = process.env;
if (!Env.NOVA_URL)
    throw new errors_1.NovaError('baseUrl must be set in env.NOVA_URL', axios_1.HttpStatusCode.InternalServerError, { fields: { NOVA_URL: Env.NOVA_URL } });
if (!Env.NOVA_TOKEN)
    throw new errors_1.NovaError('token must be set in env.NOVA_TOKEN', axios_1.HttpStatusCode.InternalServerError, { fields: { NOVA_TOKEN: Env.NOVA_TOKEN } });
exports.baseUrl = path_1.default.join(Env.NOVA_URL, '/api');
exports.token = process.env.NOVA_TOKEN;
