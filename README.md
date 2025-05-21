# File Upload SDK

A TypeScript/JavaScript SDK for handling file uploads to the File Upload API. This SDK provides a simple and type-safe way to upload files with support for namespaces, file preservation, and tagging.

## Quick Start

```bash
npm install file-upload-sdk
# or
yarn add file-upload-sdk
```

```typescript
import { FileUploader } from 'file-upload-sdk';

const uploader = new FileUploader('https://your-api-url');

// Upload files
const response = await uploader.uploadFiles(
	[
		{
			fieldname: 'file',
			originalname: 'example.png',
			buffer: Buffer.from('...'),
			mimetype: 'image/png',
		},
	],
	{
		namespace: 'public',
		preserve_name: true,
		tags: ['example'],
	}
);
```

## Documentation

- [Usage Guide](docs/usage-guide.md) - Complete guide on how to use the SDK
- [Express Integration](docs/express-integration.md) - Guide for integrating with Express.js and Multer

## Features

- 🔒 Type-safe API
- 📁 Directory management
- 🏷️ File tagging
- 🔄 File processing variants
- 🎯 Multiple file upload support
- 🔍 Detailed error handling

## Publishing

This package is published to GitHub's npm registry. See `.github/workflows/publish.yml` for CI/CD details.

## Adding as a Submodule

To add this SDK as a submodule in your project, run:

```sh
git submodule add https://github.com/your-org/file-uploader-sdk.git file-uploader-sdk
```

Then, in your project, you can import the SDK from the submodule path.
