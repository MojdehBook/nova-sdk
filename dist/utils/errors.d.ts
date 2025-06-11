import { HttpStatusCode } from 'axios';
import { ApiError } from '../types';
export declare class NovaError extends Error {
    statusCode: number;
    details?: ApiError | Record<string, any>;
    constructor(message: string, statusCode?: HttpStatusCode, details?: ApiError | Record<string, any>);
    serializeError(): ApiError;
}
