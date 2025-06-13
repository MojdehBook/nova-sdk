export * as NovaTypes from './types';
export * from './utils/errors';
import * as Directory from './apis/manager/directories';
//import * as File from './apis/manager/files';
import * as Upload from './apis/upload';

const NovaSDK = {
	...Directory,
	//...File,
	...Upload,
};

export default NovaSDK;
