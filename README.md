# Nova SDK

A TypeScript SDK for interacting with the Nova file management system.

## Installation

### NPM

```bash
npm install git@github.com:MojdehBook/nova-sdk.git
```

### Git Submodule

```bash
git submodule add git@github.com:MojdehBook/nova-sdk.git
```

## Configuration

The SDK requires two configuration values:

- `FILEUPLOAD_URL`: The base URL of your Nova instance
- `FILEUPLOAD_TOKEN`: Your authentication token

You can provide these values in two ways:

1. Environment variables:

```bash
export FILEUPLOAD_URL="https://your-nova-instance.com"
export FILEUPLOAD_TOKEN="your-auth-token"
```

2. Constructor parameters:

```typescript
import NovaSDK from 'nova_sdk';

const nova = new NovaSDK('https://your-nova-instance.com', 'your-auth-token');
```

## Usage

For detailed usage instructions, please refer to our documentation:

- [Basic Usage Guide](./docs/usage.md)
- [Express.js with Multer Integration](./docs/express-multer.md)

## Features

- Directory Management
  - Create directories
  - List directories with filters
  - Delete directories
- File Upload
  - Upload single or multiple files
  - Support for directory namespaces
  - File tagging
  - Preserve original filenames

## License

MIT
