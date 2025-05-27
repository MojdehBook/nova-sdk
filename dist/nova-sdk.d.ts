import { Buffer } from 'node:buffer';
import { FileResponseDTO, DirectoryResponseDTO, DirectoryFilters } from './types';
export interface UploadFile {
    fieldname: string;
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}
export interface UploadOptions {
    namespace?: string;
    directory_name?: string;
    preserve_name?: boolean;
    tags?: string[];
}
export default class NovaSDK {
    private baseUrl;
    private token;
    private api_caller;
    constructor(baseUrl?: string, token?: string);
    createDirectory(dirName: string, is_public?: boolean): Promise<DirectoryResponseDTO>;
    getDirectories(filters?: DirectoryFilters): Promise<DirectoryResponseDTO[]>;
    deleteDirectory(id: number): Promise<void>;
    uploadFiles(files: UploadFile[], options?: UploadOptions): Promise<FileResponseDTO[]>;
}
