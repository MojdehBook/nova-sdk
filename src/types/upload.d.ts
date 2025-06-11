// Upload Types
export interface UploadFile {
	fieldname: string;
	originalname: string;
	buffer: Buffer;
	mimetype: string;
}

export interface UploadOptions {
	namespace: string;
	preserve_name?: boolean;
	tags?: string[];
}
