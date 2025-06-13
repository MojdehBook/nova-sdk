export interface ProcessedFile {
    variant: string;
    file_name: string;
    file_size: number;
    path: string;
    url: string;
}
export interface FileResponseDTO {
    id: string;
    app_id: number;
    dir_id: string;
    file_name: string;
    original_name: string;
    mime_type: string;
    tags: string[];
    file_size: number;
    path: string;
    url: string;
    processed_files: ProcessedFile[];
    uploaded_at: string;
}
