# Nova SDK Usage Guide

A comprehensive guide on how to use the Nova SDK in your TypeScript/JavaScript projects.

## Installation

### Using npm

```bash
npm install git@github.com:MojdehBook/nova-sdk.git
```

### Using git submodule

```bash
git submodule add git@github.com:MojdehBook/nova-sdk.git
```

## Updating the SDK

### For npm installations

To get the latest changes when using npm:

```bash
# Update to the latest version
npm update nova_sdk

# Force a fresh install with latest changes
npm install git@github.com:MojdehBook/nova-sdk.git --force
```

### For git submodule installations

To get the latest changes when using git submodule:

```bash
# Update to the latest version
git submodule update --remote --merge

# Force update to the latest version
git submodule update --remote --force
```

## Configuration

The SDK requires a base URL and a token for the API. You can provide it in two ways:

1. During instantiation:

```typescript
import NovaSDK from 'nova_sdk';

const nova = new NovaSDK('https://your-api-url', 'token');
```

2. Through environment variables:

```bash
FILEUPLOAD_URL=https://your-api-url
FILEUPLOAD_TOKEN=t7812638
```

## Type Definitions

### UploadFile Interface

```typescript
interface UploadFile {
	fieldname: string; // Form field name
	originalname: string; // Original file name
	buffer: Buffer; // File buffer
	mimetype: string; // MIME type
}
```

### UploadOptions Interface

```typescript
interface UploadOptions {
	namespace?: string; // Storage namespace
	preserve_name?: boolean; // Keep original filenames
	tags?: string[]; // File tags
	directory_name?: string; // Directory name for upload
}
```

### Response Types

```typescript
interface FileResponseDTO {
	id: number;
	app_id: number;
	dir_id: number;
	file_name: string;
	original_name: string;
	mime_type: string | null;
	tags: string[] | null;
	file_size: number;
	url: string | null;
	processed_files:
		| {
				variant: string;
				file_name: string;
				file_size: number;
				url: string | null;
		  }[]
		| null;
	uploaded_at: Date;
}

interface DirectoryResponseDTO {
	id: number;
	name: string;
	is_public: boolean;
	owner_id: number;
}
```

## Basic Usage

### Uploading a Single File

```typescript
import NovaSDK from 'nova_sdk';
import { Buffer } from 'node:buffer';

const nova = new NovaSDK('https://your-api-url', 'token');

// Prepare your file
const file = {
	fieldname: 'file', // The field name in the form data
	originalname: 'example.png', // Original file name
	buffer: Buffer.from('...'), // File buffer
	mimetype: 'image/png', // MIME type of the file
};

// Upload file
const response = await nova.uploadFiles([file]);
```

### Uploading with Options

```typescript
const files = [
	{
		fieldname: 'file',
		originalname: 'logo.png',
		buffer: Buffer.from('...'),
		mimetype: 'image/png',
	},
	{
		fieldname: 'avatar',
		originalname: 'profile.jpg',
		buffer: Buffer.from('...'),
		mimetype: 'image/jpeg',
	},
];

const options = {
	namespace: 'public', // Storage namespace
	preserve_name: true, // Keep original filenames
	tags: ['user_123', 'avatar'], // Tags for the files
};

const response = await nova.uploadFiles(files, options);
```

### Creating a Directory

```typescript
// Create a new directory
const directory = await nova.createDirectory('my-files', true); // true for public directory

// Use the directory name for uploads
const response = await nova.uploadFiles(files, {
	directory_name: directory.name,
	namespace: 'public',
	preserve_name: true,
});
```

## Error Handling

The SDK throws errors in the following cases:

1. Missing Configuration:

```typescript
try {
	const nova = new NovaSDK(); // Will throw if FILEUPLOAD_URL is not set
} catch (error) {
	console.error('Configuration error:', error.message);
	// Error: Base URL is required
}
```

2. Invalid Directory Creation:

```typescript
try {
	const directory = await nova.createDirectory(''); // Empty directory name
} catch (error) {
	console.error('Directory creation failed:', error.message);
	// Error: Directory name is required
}
```

3. Upload Failures:

```typescript
try {
	const response = await nova.uploadFiles(files, options);
} catch (error) {
	console.error('Upload failed:', error.message);
	// Error: Failed to upload files
}
```

4. Directory Not Found:

```typescript
try {
	const response = await nova.uploadFiles(files, {
		directory_name: 'non-existent-directory',
	});
} catch (error) {
	console.error('Directory error:', error.message);
	// Error: Directory not found
}
```

5. File Validation Errors:

```typescript
try {
	const response = await nova.uploadFiles([
		{
			fieldname: 'file',
			originalname: 'test.txt',
			buffer: Buffer.from(''), // Empty buffer
			mimetype: 'text/plain',
		},
	]);
} catch (error) {
	console.error('Validation error:', error.message);
	// Error: File buffer is required
}
```

## Best Practices

1. **Error Handling**: Always wrap SDK calls in try-catch blocks to handle potential errors.

2. **File Validation**: Validate files before upload:

   - Check file sizes
   - Verify MIME types
   - Ensure required fields are present

3. **Memory Management**: For large files, consider using streams or chunked uploads.

4. **Type Safety**: Use TypeScript for better type checking and IDE support.

5. **Environment Variables**: Use environment variables for configuration in production.

6. **Directory Organization**: Use directories to organize your uploads logically.

7. **File Naming**: Use `preserve_name: true` when you need to maintain original filenames.

8. **Tags**: Use tags to categorize and search files effectively.
