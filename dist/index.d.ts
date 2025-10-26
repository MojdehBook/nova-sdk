export * as NovaTypes from './types';
export * from './utils/errors';
declare const NovaSDK: {
    uploadFiles(files: import("./types").UploadFile[], options: import("./types").UploadOptions): Promise<import("./types").FileResponseDTO[]>;
    getFile(fileId: string, variant?: string): Promise<{
        contentType: any;
        contentDisposition: any;
        data: import("http").IncomingMessage;
    }>;
    getMetadata(fileId: string): Promise<import("./types").FileResponseDTO>;
    deleteFile(fileId: string): Promise<void>;
    createDirectory(dirName: string, is_public?: boolean): Promise<import("./types").DirectoryResponseDTO>;
    getDirectories(filters?: import("./types").DirectoryFilters): Promise<import("./types").DirectoryResponseDTO[]>;
};
export default NovaSDK;
