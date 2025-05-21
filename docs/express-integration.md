# Express and Multer Integration Guide

This guide explains how to integrate the File Upload SDK with Express.js and Multer for handling file uploads in your web application.

## Prerequisites

Install the required dependencies:

```bash
npm install express multer @types/express @types/multer
```

## Basic Setup

Here's a basic setup for using the SDK with Express and Multer:

```typescript
import express from 'express';
import multer from 'multer';
import { FileUploader } from 'file-upload-sdk';

const app = express();
const uploader = new FileUploader(process.env.FILEUPLOAD_URL);

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
```

## Directory Management

### Creating a Directory

The SDK provides a method to create directories for organizing your uploads. Here's how to use it:

```typescript
// Example route for creating a directory
app.post('/manager/directory', async (req, res) => {
  try {
    const { name, is_public } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Directory name is required' });
    }

    const directoryId = await uploader.createDirectory(name);

    res.json({
      success: true,
      message: 'Directory has been created.',
      data: {
        directory: {
          id: directoryId,
          name,
          is_public: is_public || false,
          owner_id: 1, // This will be set by the server
        },
      },
    });
  } catch (error) {
    console.error('Directory creation error:', error);
    res.status(500).json({ error: 'Failed to create directory' });
  }
});
```

#### Request Format

```json
{
  "name": "test",
  "is_public": false
}
```

#### Response Format

```json
{
  "success": true,
  "message": "Directory has been created.",
  "data": {
    "directory": {
      "id": "13",
      "name": "test",
      "is_public": false,
      "owner_id": 1
    }
  }
}
```

### Using Directories with File Uploads

You can use the created directory ID when uploading files:

```typescript
app.post('/upload/with-directory', upload.single('file'), async (req, res) => {
  try {
    const { directoryId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!directoryId) {
      return res.status(400).json({ error: 'Directory ID is required' });
    }

    const file = {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
    };

    const response = await uploader.uploadFiles([file], {
      namespace: 'public',
      preserve_name: true,
      tags: ['directory-upload'],
      directoryId, // Add the directory ID to the upload options
    });

    res.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

## Upload Scenarios

### 1. Single File Upload

```typescript
app.post('/upload/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
    };

    const response = await uploader.uploadFiles([file], {
      namespace: 'public',
      preserve_name: true,
      tags: ['single-upload'],
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

### 2. Multiple Files with Specific Fields

```typescript
app.post(
  '/upload/multiple',
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

      const response = await uploader.uploadFiles(files, {
        namespace: 'private',
        preserve_name: true,
        tags: ['multiple-upload'],
      });

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);
```

### 3. Any Number of Files

```typescript
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

    const response = await uploader.uploadFiles(files, {
      namespace: 'public',
      preserve_name: true,
      tags: ['any-upload'],
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

## Error Handling

Add error handling middleware to handle Multer errors:

```typescript
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
      }
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
);
```

## Testing the Uploads

### Single File Upload

```bash
curl -X POST -F "file=@/path/to/file.jpg" http://localhost:3000/upload/single
```

### Multiple Files Upload

```bash
curl -X POST \
  -F "profile=@/path/to/profile.jpg" \
  -F "documents=@/path/to/doc1.pdf" \
  -F "documents=@/path/to/doc2.pdf" \
  http://localhost:3000/upload/multiple
```

### Any Files Upload

```bash
curl -X POST \
  -F "file1=@/path/to/file1.jpg" \
  -F "file2=@/path/to/file2.pdf" \
  -F "file3=@/path/to/file3.txt" \
  http://localhost:3000/upload/any
```

## Best Practices

1. **File Size Limits**: Always set appropriate file size limits in Multer configuration:

   ```typescript
   const upload = multer({
     limits: {
       fileSize: 5 * 1024 * 1024, // 5MB
     },
   });
   ```

2. **File Type Validation**: Add file type validation:

   ```typescript
   const upload = multer({
     fileFilter: (req, file, cb) => {
       const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
       if (!allowedTypes.includes(file.mimetype)) {
         return cb(new Error('Invalid file type'));
       }
       cb(null, true);
     },
   });
   ```

3. **Error Handling**: Always implement proper error handling for both Multer and SDK errors.

4. **Memory Management**: For large files, consider using disk storage instead of memory storage:

   ```typescript
   const storage = multer.diskStorage({
     destination: '/tmp/uploads/',
     filename: (req, file, cb) => {
       cb(null, `${Date.now()}-${file.originalname}`);
     },
   });
   ```

5. **Security**: Implement authentication and authorization before handling file uploads.
