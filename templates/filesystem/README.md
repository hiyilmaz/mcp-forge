# {{PROJECT_NAME}}

Local FileSystem MCP server built with mcp-forge.

## Setup

1. Copy `.env.example` to `.env` and configure allowed path:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Tools

- `read_file`: Read file contents (restricted to ALLOWED_BASE_PATH)
- `write_file`: Write file contents (restricted to ALLOWED_BASE_PATH)
- `list_directory`: List directory contents (restricted to ALLOWED_BASE_PATH)

## Security

All file operations are restricted to the path specified in `ALLOWED_BASE_PATH` environment variable. Path traversal attacks are blocked.
