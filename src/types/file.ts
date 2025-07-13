// File Types
export interface ProcessedFile {
	variant: string;
	file_name: string;
	file_size: number;
	path: string | null;
	url: string | null;
}

export interface FileResponseDTO {
	id: string;
	app_id: number;
	dir_id: string;
	file_name: string;
	original_name: string;
	mime_type: string | null;
	tags: string[] | null;
	file_size: number;
	path: string | null;
	url: string | null;
	processed_files: ProcessedFile[];
	uploaded_at: string;
}
