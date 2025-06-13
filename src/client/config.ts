import { HttpStatusCode } from 'axios';
import { NovaError } from '../utils/errors';
import path from 'path';

const Env = process.env;

if (!Env.NOVA_URL)
	throw new NovaError(
		'baseUrl must be set in env.NOVA_URL',
		HttpStatusCode.InternalServerError,
		{ fields: { NOVA_URL: Env.NOVA_URL } }
	);
if (!Env.NOVA_TOKEN)
	throw new NovaError(
		'token must be set in env.NOVA_TOKEN',
		HttpStatusCode.InternalServerError,
		{ fields: { NOVA_TOKEN: Env.NOVA_TOKEN } }
	);

export const baseUrl = path.join(Env.NOVA_URL, '/api');
export const token = process.env.NOVA_TOKEN;
