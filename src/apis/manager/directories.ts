import { HttpStatusCode } from 'axios';
import apiClient from '../../client/apiClient';
import { DirectoryFilters, DirectoryResponseDTO } from '../../types';
import { NovaError } from '../../utils/errors';

// Directory Management Methods
export async function createDirectory(
	dirName: string,
	is_public = false
): Promise<DirectoryResponseDTO> {
	if (!dirName?.trim().length) {
		throw new NovaError(
			'Directory name is required',
			HttpStatusCode.InternalServerError,
			{ resource: 'createDirectory', fields: { dirName } }
		);
	}
	const res = await apiClient.post<any, { directory: DirectoryResponseDTO }>(
		`/manager/directory`,
		{
			name: dirName,
			is_public,
		}
	);
	return res.directory;
}

export async function getDirectories(
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

	const res = await apiClient.get<any, { directories: DirectoryResponseDTO[] }>(
		`/manager/directory`,
		{ params }
	);
	return res.directories;
}
