import { FileResponseDTO } from './file';

// Directory Types
export interface DirectoryResponseDTO {
	id: number;
	name: string;
	is_public: boolean;
	owner_id: number;
	files?: FileResponseDTO[];
	files_count: string;
}

export interface DirectoryFilters {
	id?: number;
	name?: string;
	is_public?: boolean;
}
