# File Upload SDK Usage Guide

A comprehensive guide on how to use the File Upload SDK in your TypeScript/JavaScript projects.

## Installation

```bash
npm install file-upload-sdk
# or
yarn add file-upload-sdk
```

## Configuration

The SDK requires a base URL for the API. You can provide it in two ways:

1. During instantiation:

```typescript
import { FileUploader } from 'file-upload-sdk';

const uploader = new FileUploader('https://your-api-url');
```

2. Through environment variable:

```bash
FILEUPLOAD_URL=https://your-api-url
```

## Basic Usage

### Uploading a Single File

```typescript
import { FileUploader } from 'file-upload-sdk';
import { Buffer } from 'node:buffer';

const uploader = new FileUploader('https://your-api-url');

// Prepare your file
const file = {
  fieldname: 'file', // The field name in the form data
  originalname: 'example.png', // Original file name
  buffer: Buffer.from('...'), // File buffer
  mimetype: 'image/png', // MIME type of the file
};

// Upload file
const response = await uploader.uploadFiles([file]);
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
  directoryId: '13', // Optional: Upload to specific directory
};

const response = await uploader.uploadFiles(files, options);
```

### Creating a Directory

```typescript
// Create a new directory
const directoryId = await uploader.createDirectory('my-files');

// Use the directory ID for uploads
const response = await uploader.uploadFiles(files, {
  directoryId,
  namespace: 'public',
  preserve_name: true,
});
```

## Response Format

The SDK returns a typed response that matches the API's format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

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
```

Example response:

```typescript
{
  success: true,
  message: "3 file(s) uploaded successfully.",
  data: {
    files: [
      {
        id: 10,
        app_id: 1,
        dir_id: 10,
        file_name: "logo.png",
        original_name: "logo.png",
        mime_type: "image/png",
        tags: ["user_123", "avatar"],
        file_size: 27867,
        url: "storage/public/e6e9e993/logo.png",
        processed_files: [
          {
            variant: "100",
            file_name: "100_logo.png",
            file_size: 4410,
            url: "storage/public/e6e9e993/100_logo.png"
          },
          {
            variant: "250",
            file_name: "250_logo.png",
            file_size: 12256,
            url: "storage/public/e6e9e993/250_logo.png"
          }
        ],
        uploaded_at: "2025-05-19T00:04:47.048Z"
      }
    ]
  }
}
```

## Error Handling

The SDK throws errors in the following cases:

1. Missing base URL:

```typescript
try {
  const uploader = new FileUploader(); // Will throw if FILEUPLOAD_URL is not set
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

2. Upload failures:

```typescript
try {
  const response = await uploader.uploadFiles(files, options);
} catch (error) {
  console.error('Upload failed:', error.message);
}
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
  directoryId?: string; // Directory ID for upload
}
```

## Best Practices

1. **Error Handling**: Always wrap upload calls in try-catch blocks to handle potential errors.

2. **File Validation**: Validate files before upload:

   - Check file sizes
   - Verify MIME types
   - Ensure required fields are present

3. **Memory Management**: For large files, consider using streams or chunked uploads.

4. **Type Safety**: Use TypeScript for better type checking and IDE support.

## Examples

### Uploading Multiple Files with Different Field Names

```typescript
const files = [
  {
    fieldname: 'profile_picture',
    originalname: 'profile.jpg',
    buffer: Buffer.from('...'),
    mimetype: 'image/jpeg',
  },
  {
    fieldname: 'document',
    originalname: 'contract.pdf',
    buffer: Buffer.from('...'),
    mimetype: 'application/pdf',
  },
];

const options = {
  namespace: 'private',
  preserve_name: true,
  tags: ['user_456', 'documents'],
};

const response = await uploader.uploadFiles(files, options);
```

### Handling Processed Files

```typescript
const response = await uploader.uploadFiles(files, options);

// Access processed variants
response.data.files.forEach((file) => {
  if (file.processed_files) {
    file.processed_files.forEach((variant) => {
      console.log(`Variant ${variant.variant}: ${variant.url}`);
    });
  }
});
```
