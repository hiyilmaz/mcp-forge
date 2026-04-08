#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { queryDatabase, listTables, describeTable } from './tools/database.js';

export const server = new Server(
  {
    name: '{{PROJECT_NAME}}',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'query_database': {
        const result = await queryDatabase((args?.sql as string) || '');
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }
      case 'list_tables': {
        const tables = await listTables();
        return { content: [{ type: 'text', text: JSON.stringify(tables, null, 2) }] };
      }
      case 'describe_table': {
        const columns = await describeTable((args?.tableName as string) || '');
        return { content: [{ type: 'text', text: JSON.stringify(columns, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('PostgreSQL MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
