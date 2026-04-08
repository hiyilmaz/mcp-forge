#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFile, writeFile, listDirectory } from './tools/filesystem.js';

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
      case 'read_file': {
        const content = readFile((args?.path as string) || '');
        return { content: [{ type: 'text', text: content }] };
      }
      case 'write_file': {
        writeFile((args?.path as string) || '', (args?.content as string) || '');
        return { content: [{ type: 'text', text: 'File written successfully' }] };
      }
      case 'list_directory': {
        const files = listDirectory((args?.path as string) || '');
        return { content: [{ type: 'text', text: JSON.stringify(files, null, 2) }] };
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
  console.error('FileSystem MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
