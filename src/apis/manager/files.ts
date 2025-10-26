import { HttpStatusCode } from 'axios';
import apiClient from '../../client/apiClient';
import { FileResponseDTO } from '../../types';
import { NovaError } from '../../utils/errors';
import { IncomingMessage } from 'http';

// File Management Methods
export async function getFile(fileId: string, variant?: string) {
	if (!fileId?.trim().length) {
		throw new NovaError(
			'File id is required',
			HttpStatusCode.InternalServerError,
			{ resource: 'getFile', fields: { fileId } }
		);
	}
	const res = await apiClient.get<IncomingMessage>(`/manager/file/${fileId}`, {
		responseType: 'stream',
		params: { v: variant },
	});
	return {
		contentType: res.headers['content-type'] ?? 'application/octet-stream',
		contentDisposition:
			res.headers['content-disposition'] ?? 'attachment; filename=file.bin',
		data: res.data,
	};
}

export async function getMetadata(fileId: string): Promise<FileResponseDTO> {
	if (!fileId?.trim().length) {
		throw new NovaError(
			'File id is required',
			HttpStatusCode.InternalServerError,
			{ resource: 'getFile', fields: { fileId } }
		);
	}
	const res = await apiClient.get<any, { file: FileResponseDTO }>(
		`/manager/file/${fileId}/metadata`
	);
	return res.file;
}

export async function deleteFile(fileId: string): Promise<void> {
	if (!fileId?.trim().length) {
		throw new NovaError(
			'File id is required',
			HttpStatusCode.InternalServerError,
			{ resource: 'getFile', fields: { fileId } }
		);
	}
	await apiClient.delete(`/manager/file/${fileId}`);
	return;
}
