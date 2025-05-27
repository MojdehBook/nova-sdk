# Express.js with Multer Integration

This guide shows how to integrate the Nova SDK with Express.js and Multer for handling file uploads in both JavaScript and TypeScript.

## Setup

First, install the required dependencies:

```bash
# For JavaScript
npm install express multer

# For TypeScript (additional dependencies)
npm install express multer typescript @types/express @types/multer
```

## Basic Setup

### JavaScript Example

```javascript
const express = require('express');
const multer = require('multer');
const NovaSDK = require('@mojdeh/nova-sdk');

const app = express();
const nova = new NovaSDK();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
});
```

### TypeScript Example

```typescript
import express from 'express';
import multer from 'multer';
import NovaSDK from '@mojdeh/nova-sdk';

const app = express();
const nova = new NovaSDK();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
});
```

## Basic Integration

### JavaScript Example

```javascript
const express = require('express');
const multer = require('multer');
const NovaSDK = require('@mojdeh/nova-sdk');

const app = express();
const upload = multer();
const nova = new NovaSDK();

// Single file upload
app.post('/upload', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const files = await nova.uploadFiles([
			{
				fieldname: req.file.fieldname,
				originalname: req.file.originalname,
				buffer: req.file.buffer,
				mimetype: req.file.mimetype,
			},
		]);

		res.json(files[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Multiple files upload
app.post('/upload-multiple', upload.array('files'), async (req, res) => {
	try {
		if (!req.files || !Array.isArray(req.files)) {
			return res.status(400).json({ error: 'No files uploaded' });
		}

		const files = await nova.uploadFiles(
			req.files.map((file) => ({
				fieldname: file.fieldname,
				originalname: file.originalname,
				buffer: file.buffer,
				mimetype: file.mimetype,
			}))
		);

		res.json(files);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
```

### TypeScript Example

```typescript
import express, { Request, Response } from 'express';
import multer from 'multer';
import NovaSDK from '@mojdeh/nova-sdk';

const app = express();
const upload = multer();
const nova = new NovaSDK();

// Single file upload
app.post(
	'/upload',
	upload.single('file'),
	async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).json({ error: 'No file uploaded' });
			}

			const files = await nova.uploadFiles([
				{
					fieldname: req.file.fieldname,
					originalname: req.file.originalname,
					buffer: req.file.buffer,
					mimetype: req.file.mimetype,
				},
			]);

			res.json(files[0]);
		} catch (error) {
			res.status(500).json({
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}
);

// Multiple files upload
app.post(
	'/upload-multiple',
	upload.array('files'),
	async (req: Request, res: Response) => {
		try {
			if (!req.files || !Array.isArray(req.files)) {
				return res.status(400).json({ error: 'No files uploaded' });
			}

			const files = await nova.uploadFiles(
				req.files.map((file) => ({
					fieldname: file.fieldname,
					originalname: file.originalname,
					buffer: file.buffer,
					mimetype: file.mimetype,
				}))
			);

			res.json(files);
		} catch (error) {
			res.status(500).json({
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}
);
```

## Advanced Integration

### Multiple Files with Specific Fields

#### JavaScript Example

```javascript
app.post(
	'/upload/fields',
	upload.fields([
		{ name: 'profile', maxCount: 1 },
		{ name: 'documents', maxCount: 5 },
	]),
	async (req, res) => {
		try {
			if (!req.files) {
				return res.status(400).json({ error: 'No files uploaded' });
			}

			const files = Object.entries(req.files).flatMap(([fieldname, files]) =>
				files.map((file) => ({
					fieldname,
					originalname: file.originalname,
					buffer: file.buffer,
					mimetype: file.mimetype,
				}))
			);

			const response = await nova.uploadFiles(files, {
				preserve_name: true,
				tags: ['multiple-upload'],
			});

			res.json(response);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
);
```

#### TypeScript Example

```typescript
app.post(
	'/upload/fields',
	upload.fields([
		{ name: 'profile', maxCount: 1 },
		{ name: 'documents', maxCount: 5 },
	]),
	async (req: Request, res: Response) => {
		try {
			if (!req.files) {
				return res.status(400).json({ error: 'No files uploaded' });
			}

			const files = Object.entries(req.files).flatMap(([fieldname, files]) =>
				files.map((file) => ({
					fieldname,
					originalname: file.originalname,
					buffer: file.buffer,
					mimetype: file.mimetype,
				}))
			);

			const response = await nova.uploadFiles(files, {
				preserve_name: true,
				tags: ['multiple-upload'],
			});

			res.json(response);
		} catch (error) {
			res.status(500).json({
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}
);
```

### Any Number of Files

#### JavaScript Example

```javascript
app.post('/upload/any', upload.any(), async (req, res) => {
	try {
		if (!req.files || !Array.isArray(req.files)) {
			return res.status(400).json({ error: 'No files uploaded' });
		}

		const files = req.files.map((file) => ({
			fieldname: file.fieldname,
			originalname: file.originalname,
			buffer: file.buffer,
			mimetype: file.mimetype,
		}));

		const response = await nova.uploadFiles(files, {
			preserve_name: true,
			tags: ['any-upload'],
		});

		res.json(response);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
```

#### TypeScript Example

```typescript
app.post('/upload/any', upload.any(), async (req: Request, res: Response) => {
	try {
		if (!req.files || !Array.isArray(req.files)) {
			return res.status(400).json({ error: 'No files uploaded' });
		}

		const files = req.files.map((file) => ({
			fieldname: file.fieldname,
			originalname: file.originalname,
			buffer: file.buffer,
			mimetype: file.mimetype,
		}));

		const response = await nova.uploadFiles(files, {
			preserve_name: true,
			tags: ['any-upload'],
		});

		res.json(response);
	} catch (error) {
		res.status(500).json({
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});
```

## Error Handling

### JavaScript Error Middleware

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err);

	if (err instanceof multer.MulterError) {
		// Handle Multer errors
		switch (err.code) {
			case 'LIMIT_FILE_SIZE':
				return res.status(400).json({
					error: 'File too large',
					details: 'Maximum file size is 5MB',
				});
			case 'LIMIT_FILE_COUNT':
				return res.status(400).json({
					error: 'Too many files',
					details: 'Maximum number of files exceeded',
				});
			case 'LIMIT_UNEXPECTED_FILE':
				return res.status(400).json({
					error: 'Unexpected file field',
					details: 'Invalid field name in form data',
				});
			default:
				return res.status(400).json({
					error: 'File upload error',
					details: err.message,
				});
		}
	}

	// Handle Nova SDK errors
	if (err.name === 'NovaSDKError') {
		return res.status(500).json({
			error: 'Upload service error',
			details: err.message,
		});
	}

	// Handle other errors
	res.status(500).json({
		error: 'Internal server error',
		message: err.message,
	});
});
```

### TypeScript Error Middleware

```typescript
import { ErrorRequestHandler } from 'express';

interface NovaSDKError extends Error {
	name: 'NovaSDKError';
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	console.error(err);

	if (err instanceof multer.MulterError) {
		// Handle Multer errors
		switch (err.code) {
			case 'LIMIT_FILE_SIZE':
				return res.status(400).json({
					error: 'File too large',
					details: 'Maximum file size is 5MB',
				});
			case 'LIMIT_FILE_COUNT':
				return res.status(400).json({
					error: 'Too many files',
					details: 'Maximum number of files exceeded',
				});
			case 'LIMIT_UNEXPECTED_FILE':
				return res.status(400).json({
					error: 'Unexpected file field',
					details: 'Invalid field name in form data',
				});
			default:
				return res.status(400).json({
					error: 'File upload error',
					details: err.message,
				});
		}
	}

	// Handle Nova SDK errors
	if (err instanceof Error && err.name === 'NovaSDKError') {
		return res.status(500).json({
			error: 'Upload service error',
			details: err.message,
		});
	}

	// Handle other errors
	res.status(500).json({
		error: 'Internal server error',
		message: err instanceof Error ? err.message : 'Unknown error',
	});
};

app.use(errorHandler);
```

### Custom Error Classes

#### JavaScript

```javascript
class NovaSDKError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NovaSDKError';
	}
}

// Usage in route handlers
app.post('/upload', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) {
			throw new NovaSDKError('No file uploaded');
		}

		// ... rest of the code
	} catch (error) {
		if (error instanceof NovaSDKError) {
			return res.status(400).json({ error: error.message });
		}
		throw error; // Let the error middleware handle other errors
	}
});
```

#### TypeScript

```typescript
class NovaSDKError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NovaSDKError';
	}
}

// Usage in route handlers
app.post(
	'/upload',
	upload.single('file'),
	async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				throw new NovaSDKError('No file uploaded');
			}

			// ... rest of the code
		} catch (error) {
			if (error instanceof NovaSDKError) {
				return res.status(400).json({ error: error.message });
			}
			throw error; // Let the error middleware handle other errors
		}
	}
);
```

## File Size Limits

### JavaScript Configuration

```javascript
const upload = multer({
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
		files: 10, // Maximum 10 files
	},
});
```

### TypeScript Configuration

```typescript
const upload = multer({
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
		files: 10, // Maximum 10 files
	},
});
```

## Security Considerations

### File Type Validation

#### JavaScript

```javascript
const upload = multer({
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
		if (!allowedTypes.includes(file.mimetype)) {
			cb(new Error('Invalid file type'));
			return;
		}
		cb(null, true);
	},
});
```

#### TypeScript

```typescript
const upload = multer({
	fileFilter: (
		req: Express.Request,
		file: Express.Multer.File,
		cb: multer.FileFilterCallback
	) => {
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'application/pdf',
		] as const;
		if (
			!allowedTypes.includes(file.mimetype as (typeof allowedTypes)[number])
		) {
			cb(new Error('Invalid file type'));
			return;
		}
		cb(null, true);
	},
});
```

### Environment Configuration

#### JavaScript

```javascript
const nova = new NovaSDK(process.env.NOVA_API_URL, process.env.NOVA_API_TOKEN);
```

#### TypeScript

```typescript
const nova = new NovaSDK(
	process.env.NOVA_API_URL as string,
	process.env.NOVA_API_TOKEN as string
);
```

Remember to implement rate limiting for your upload endpoints to prevent abuse.
