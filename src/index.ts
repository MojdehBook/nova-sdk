import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { Buffer } from 'node:buffer';
import { ApiResponse, FileResponseDTO } from './types';

export interface UploadFile {
	fieldname: string;
	originalname: string;
	buffer: Buffer;
	mimetype: string;
}

export interface UploadOptions {
	namespace?: string;
	preserve_name?: boolean;
	tags?: string[];
	directoryId?: string;
}

export default class FileUploader {
	private baseUrl: string;
	private token: string;
	private api_caller: AxiosInstance;

	constructor(baseUrl?: string, token?: string) {
		this.baseUrl = (baseUrl || process.env.FILEUPLOAD_URL) as string;
		this.token = (token || process.env.FILEUPLOAD_TOKEN) as string;

		if (!this.baseUrl) {
			throw new Error(
				'FileUploader: baseUrl must be provided or set in process.env.FILEUPLOAD_URL'
			);
		}

		if (!this.token) {
			throw new Error(
				'FileUploader: token must be provided or set in process.env.FILEUPLOAD_TOKEN'
			);
		}

		this.api_caller = axios.create({
			baseURL: this.baseUrl,
			headers: {
				Authorization: this.token,
			},
		});
	}

	async createDirectory(dirName: string): Promise<string> {
		const res = await this.api_caller.post<
			ApiResponse<{ directory: { id: string } }>
		>(`/manager/directory`, {
			name: dirName,
			is_public: false,
		});
		if (!res.data || !res.data.data?.directory?.id) {
			throw new Error('FileUploader: Invalid response from /manager/directory');
		}
		return res.data.data.directory.id;
	}

	async uploadFiles(
		files: UploadFile[],
		options: UploadOptions = {}
	): Promise<ApiResponse<{ files: FileResponseDTO[] }>> {
		const form = new FormData();

		// Add options to form data
		if (options.namespace) {
			form.append('namespace', options.namespace);
		}
		if (options.preserve_name !== undefined) {
			form.append('preserve_name', options.preserve_name.toString());
		}
		if (options.tags && options.tags.length > 0) {
			form.append('tags', options.tags.join(','));
		}
		if (options.directoryId) {
			form.append('directoryId', options.directoryId);
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
		return res.data;
	}
}
