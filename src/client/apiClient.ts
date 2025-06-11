import Axios, { AxiosResponse } from 'axios';
import { baseUrl, token } from './config';
import { NovaError } from '../utils/errors';

const apiClient = Axios.create({
	baseURL: baseUrl,
	headers: {
		Authorization: token,
	},
});

apiClient.interceptors.response.use(
	(response: AxiosResponse): any => {
		if (response.data?.success && response.data?.data)
			return response.data.data as unknown;
		return response.data as unknown;
	},
	(error) => {
		const statusCode = error.response.status;
		const message =
			error.response.data.message ?? error.response.statusText ?? error.message;
		const details = error.response.data.error ?? {};
		throw new NovaError(message, statusCode, details);
	}
);

export default apiClient;
