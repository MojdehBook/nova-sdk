import { HttpStatusCode } from 'axios';
import { ApiError } from '../types';

const showIfDevelopment = <T>(data: T): T | undefined => {
	return process.env.NODE_ENV === 'development' ? data : undefined;
};
export class NovaError extends Error {
	statusCode: number;
	details?: ApiError | Record<string, any>;

	constructor(
		message: string,
		statusCode = HttpStatusCode.ServiceUnavailable,
		details?: ApiError | Record<string, any>
	) {
		super(message);
		this.name = 'NovaError';
		this.statusCode = statusCode;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
	serializeError(): ApiError {
		return {
			id: this.details?.id,
			code: this.details?.code,
			fields: this.details?.fields,
			resource: showIfDevelopment(this.details?.resource),
			meta: showIfDevelopment({ ...this.details?.meta, stack: this?.stack }),
		};
	}
}
