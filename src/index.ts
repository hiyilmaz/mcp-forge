#!/usr/bin/env node
import { Command } from 'commander';
import { init } from './commands/init.js';

const program = new Command();

program
  .name('mcp-forge')
  .description('The fastest way to build MCP servers')
  .version('0.1.0');

program
  .command('init <project-name>')
  .description('Initialize a new MCP server project')
  .option('--template <template>', 'Template to use (empty, postgresql, rest-api, filesystem)')
  .option('--language <language>', 'Language to use (typescript)')
  .option('--no-register', 'Skip Claude Desktop auto-registration')
  .action(async (projectName: string, options: any) => {
    await init(projectName, options);
  });

program.parse();
