// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
	error?: ApiError;
}

export interface ApiError {
	id?: string;
	code?: string;
	resource?: string;
	fields?: Record<string, string>;
	meta?: Record<string, any>;
}
