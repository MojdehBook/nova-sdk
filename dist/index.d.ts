export * as NovaTypes from './types';
declare const NovaSDK: {
    uploadFiles(files: import("./types").UploadFile[], options: import("./types").UploadOptions): Promise<import("./types").FileResponseDTO[]>;
    createDirectory(dirName: string, is_public?: boolean): Promise<import("./types").DirectoryResponseDTO>;
};
export default NovaSDK;
