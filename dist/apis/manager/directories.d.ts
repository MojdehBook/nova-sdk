import { DirectoryFilters, DirectoryResponseDTO } from '../../types';
export declare function createDirectory(dirName: string, is_public?: boolean): Promise<DirectoryResponseDTO>;
export declare function getDirectories(filters?: DirectoryFilters): Promise<DirectoryResponseDTO[]>;
