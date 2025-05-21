import { Buffer } from 'node:buffer';
import { ApiResponse, FileResponseDTO } from './types';
export interface UploadFile {
    fieldname: string;
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}
export interface UploadOptions {
    namespace?: string;
    preserve_name?: boolean;
    tags?: string[];
    directoryId?: string;
}
export default class FileUploader {
    private baseUrl;
    private token;
    private api_caller;
    constructor(baseUrl?: string, token?: string);
    createDirectory(dirName: string): Promise<string>;
    uploadFiles(files: UploadFile[], options?: UploadOptions): Promise<ApiResponse<{
        files: FileResponseDTO[];
    }>>;
}
