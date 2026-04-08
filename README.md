# create-mcp-forge

⚡ **The fastest way to build MCP servers**

A powerful CLI tool for scaffolding [Model Context Protocol](https://modelcontextprotocol.io) servers with production-ready templates.

[![npm version](https://img.shields.io/npm/v/create-mcp-forge.svg)](https://www.npmjs.com/package/create-mcp-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Instant Setup** - Create production-ready MCP servers in seconds
- 📦 **Multiple Templates** - PostgreSQL, REST API, FileSystem, or start from scratch
- 🔧 **TypeScript First** - Full type safety and modern tooling
- ✅ **Test Ready** - Pre-configured testing with Vitest
- 🎯 **Claude Desktop Integration** - Automatic registration with Claude Desktop
- 🛠️ **Best Practices** - Error handling, validation, and security built-in

## Quick Start

```bash
npm create mcp-forge@latest my-server
```

Follow the interactive prompts to:

1. Choose a template (empty, postgresql, rest-api, filesystem)
2. Select language (TypeScript)
3. Automatically register with Claude Desktop

Your MCP server is ready! 🎉

## Installation & Usage

Thanks to npm's `create` command, you don't need to install anything globally. Just run:

### Interactive Mode

```bash
npm create mcp-forge@latest my-server
```

The CLI will guide you through:

- Template selection
- Language preference
- Claude Desktop registration

### Non-Interactive Mode

```bash
npm create mcp-forge@latest my-server \
  --template postgresql \
  --language typescript \
  --no-register
```

### CLI Options

```bash
create-mcp-forge <project-name> [options]

Options:
  -t, --template <name>    Template to use (empty|postgresql|rest-api|filesystem)
  -l, --language <lang>    Language to use (typescript)
  --no-register           Skip Claude Desktop registration
  -h, --help              Display help
```

## Templates

### 🗂️ Empty Template

Minimal MCP server with basic structure. Perfect for custom implementations.

```bash
npm create mcp-forge@latest my-server --template empty
```

**Includes:**

- Basic MCP server setup
- TypeScript configuration
- Test scaffolding

---

### 🐘 PostgreSQL Template

Full-featured database MCP server with connection pooling and query tools.

```bash
npm create mcp-forge@latest my-db-server --template postgresql
```

**Tools Included:**

- `query_database` - Execute raw SQL queries
- `list_tables` - List all database tables
- `describe_table` - Get table schema information

**Features:**

- Connection pooling with `pg`
- Environment-based configuration
- Parameterized queries for security
- Comprehensive error handling

---

### 🌐 REST API Template

HTTP client MCP server for interacting with REST APIs.

```bash
npm create mcp-forge@latest my-api-server --template rest-api
```

**Tools Included:**

- `fetch_api` - Make HTTP requests (GET, POST, PUT, DELETE)
- `get_api_status` - Check API health

**Features:**

- Built-in HTTP client
- Request/response validation
- Timeout handling
- Error recovery

---

### 📁 FileSystem Template

Secure file operations MCP server with path traversal protection.

```bash
npm create mcp-forge@latest my-fs-server --template filesystem
```

**Tools Included:**

- `read_file` - Read file contents
- `write_file` - Write to files
- `list_directory` - List directory contents

**Features:**

- Path traversal protection
- Configurable allowed directories
- Safe file operations
- Comprehensive validation

## Project Structure

```text
my-server/
├── src/
│   ├── index.ts              # Main server entry point
│   └── tools/                # Tool implementations
│       └── *.ts
├── tests/
│   └── *.test.ts             # Test files
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Development Workflow

### 1. Create Your Server

```bash
npm create mcp-forge@latest my-server --template postgresql
cd my-server
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development

```bash
npm run dev
```

### 5. Run Tests

```bash
npm test
```

### 6. Build for Production

```bash
npm run build
```

## Claude Desktop Integration

mcp-forge automatically registers your server with Claude Desktop during initialization.

### Manual Registration

If you skipped registration or need to register later:

1. Open Claude Desktop configuration:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add your server:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/my-server/dist/index.js"]
    }
  }
}
```

3. Restart Claude Desktop

## Testing

All templates include pre-configured testing with Vitest.

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

### Example Test

```typescript
import { describe, it, expect } from "vitest";

describe("My Tool", () => {
  it("should process input correctly", () => {
    const result = myTool({ input: "test" });
    expect(result).toBe("expected");
  });
});
```

## Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

## Best Practices

### Error Handling

All templates include comprehensive error handling:

```typescript
try {
  // Tool logic
  return { content: [{ type: "text", text: result }] };
} catch (error) {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${error.message}`,
      },
    ],
    isError: true,
  };
}
```

### Input Validation

Validate all tool inputs:

```typescript
if (!input || typeof input !== "string") {
  throw new Error("Invalid input: expected string");
}
```

### Security

- Never expose sensitive data in error messages
- Use environment variables for credentials
- Validate and sanitize all user inputs
- Implement path traversal protection for file operations

## Troubleshooting

### Server Not Appearing in Claude Desktop

1. Check configuration file syntax (valid JSON)
2. Verify absolute paths in `args`
3. Ensure server is built (`npm run build`)
4. Restart Claude Desktop

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Tests Failing

```bash
# Update dependencies
npm update

# Clear cache
npm cache clean --force
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © hiyilmaz

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/desktop)

## Support

- 🐛 [Report Issues](https://github.com/hiyilmaz/mcp-forge/issues)
- 💬 [Discussions](https://github.com/hiyilmaz/mcp-forge/discussions)
- 📧 Email: mcpforge@grisis.com

---

**Built with ❤️ for the MCP community**
