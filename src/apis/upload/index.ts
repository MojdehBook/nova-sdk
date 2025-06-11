import FormData from 'form-data';
import { FileResponseDTO, UploadFile, UploadOptions } from '../../types';
import apiClient from '../../client/apiClient';
import { NovaError } from '../../utils/errors';
import { HttpStatusCode } from 'axios';

// File Upload Methods
export async function uploadFiles(
	files: UploadFile[],
	options: UploadOptions
): Promise<FileResponseDTO[]> {
	if (!files || !Array.isArray(files) || files.length === 0) {
		throw new NovaError(
			'Files array is required',
			HttpStatusCode.InternalServerError,
			{ resource: 'uploadFiles', fields: { files } }
		);
	}
	if (!options?.namespace) {
		throw new NovaError(
			'Namespace is required in upload options',
			HttpStatusCode.InternalServerError,
			{ resource: 'uploadFiles', fields: { namespace: options.namespace } }
		);
	}
	const form = new FormData();
	// Add options to form data
	form.append('namespace', options.namespace);
	if (options.preserve_name) {
		form.append('preserve_name', options.preserve_name.toString());
	}
	if (options.tags && options.tags.length > 0) {
		form.append('tags', options.tags.map((tag) => tag.trim()).join(','));
	}
	// Add files to form data
	for (const file of files) {
		form.append(file.fieldname, file.buffer, {
			filename: file.originalname,
			contentType: file.mimetype,
		});
	}
	const headers = form.getHeaders();
	const res = await apiClient.post<any, { files: FileResponseDTO[] }>(
		`/upload`,
		form,
		{ headers }
	);
	return res.files;
}
