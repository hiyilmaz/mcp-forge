# {{PROJECT_NAME}}

PostgreSQL MCP server built with mcp-forge.

## Setup

1. Copy `.env.example` to `.env` and configure your database:
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

- `query_database`: Execute raw SQL queries
- `list_tables`: List all tables in the database
- `describe_table`: Get column information for a table
