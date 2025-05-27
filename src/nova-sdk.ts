import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { Buffer } from 'node:buffer';
import {
	ApiResponse,
	FileResponseDTO,
	DirectoryResponseDTO,
	DirectoryFilters,
} from './types';

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
	private baseUrl: string;
	private token: string;
	private api_caller: AxiosInstance;

	constructor(baseUrl?: string, token?: string) {
		this.baseUrl = (baseUrl || process.env.FILEUPLOAD_URL) as string;
		this.token = (token || process.env.FILEUPLOAD_TOKEN) as string;

		if (!this.baseUrl) {
			throw new Error(
				'NovaSDK: baseUrl must be provided or set in process.env.FILEUPLOAD_URL'
			);
		}

		if (!this.token) {
			throw new Error(
				'NovaSDK: token must be provided or set in process.env.FILEUPLOAD_TOKEN'
			);
		}

		this.api_caller = axios.create({
			baseURL: this.baseUrl,
			headers: {
				Authorization: this.token,
			},
		});
	}

	// Directory Management Methods
	async createDirectory(
		dirName: string,
		is_public: boolean = false
	): Promise<DirectoryResponseDTO> {
		if (!dirName || dirName.trim() === '') {
			throw new Error('NovaSDK: Directory name is required');
		}

		const res = await this.api_caller.post<
			ApiResponse<{ directory: DirectoryResponseDTO }>
		>(`/manager/directory`, {
			name: dirName,
			is_public,
		});

		if (!res.data.data?.directory) {
			throw new Error('NovaSDK: Invalid response from /manager/directory');
		}

		return res.data.data.directory;
	}

	async getDirectories(
		filters?: DirectoryFilters
	): Promise<DirectoryResponseDTO[]> {
		const params: Record<string, string> = {};

		if (filters) {
			if (filters.id !== undefined) {
				params.id = filters.id.toString();
			}
			if (filters.name) {
				params.name = filters.name;
			}
			if (filters.is_public !== undefined) {
				params.is_public = filters.is_public.toString();
			}
		}

		const res = await this.api_caller.get<
			ApiResponse<{ directories: DirectoryResponseDTO[] }>
		>(`/manager/directory`, { params });

		if (!res.data.data?.directories) {
			throw new Error('NovaSDK: Invalid response from /manager/directory');
		}

		return res.data.data.directories;
	}

	async deleteDirectory(id: number): Promise<void> {
		if (!id) {
			throw new Error('NovaSDK: Directory ID is required');
		}

		const res = await this.api_caller.delete<ApiResponse<void>>(
			`/manager/directory/${id}`
		);

		if (!res.data.success) {
			throw new Error(
				`NovaSDK: Failed to delete directory - ${res.data.message}`
			);
		}
	}

	// File Upload Methods
	async uploadFiles(
		files: UploadFile[],
		options: UploadOptions = {}
	): Promise<FileResponseDTO[]> {
		const form = new FormData();

		// Add options to form data
		if (options.directory_name) {
			form.append('namespace', options.directory_name);
		} else if (options.namespace) {
			form.append('namespace', options.namespace);
		}
		if (options.preserve_name !== undefined) {
			form.append('preserve_name', options.preserve_name.toString());
		}
		if (options.tags && options.tags.length > 0) {
			form.append('tags', options.tags.join(','));
		}

		// Add files to form data
		for (const file of files) {
			form.append(file.fieldname, file.buffer, {
				filename: file.originalname,
				contentType: file.mimetype,
			});
		}

		const headers = form.getHeaders();

		const res = await this.api_caller.post<
			ApiResponse<{ files: FileResponseDTO[] }>
		>(`/upload`, form, { headers });

		if (!res.data.data?.files) {
			throw new Error('NovaSDK: Invalid response from /upload');
		}

		return res.data.data.files;
	}
}
