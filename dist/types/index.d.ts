export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: ApiError;
}
export interface ApiError {
    id?: string;
    code?: string;
    resource?: string;
    fields?: Record<string, string>;
    meta?: Record<string, any>;
}
export interface ProcessedFile {
    variant: string;
    file_name: string;
    file_size: number;
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
    url: string;
    processed_files: ProcessedFile[];
    uploaded_at: string;
}
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
