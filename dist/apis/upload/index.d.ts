import { FileResponseDTO, UploadFile, UploadOptions } from '../../types';
export declare function uploadFiles(files: UploadFile[], options: UploadOptions): Promise<FileResponseDTO[]>;
