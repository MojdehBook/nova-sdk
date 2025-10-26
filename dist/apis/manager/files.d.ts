import { FileResponseDTO } from '../../types';
import { IncomingMessage } from 'http';
export declare function getFile(fileId: string, variant?: string): Promise<{
    contentType: any;
    contentDisposition: any;
    data: IncomingMessage;
}>;
export declare function getMetadata(fileId: string): Promise<FileResponseDTO>;
export declare function deleteFile(fileId: string): Promise<void>;
