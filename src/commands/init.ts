import * as clack from '@clack/prompts';
import { existsSync } from 'fs';
import { join } from 'path';
import { scaffoldProject } from '../utils/scaffold.js';
import { registerWithClaudeDesktop } from '../utils/claude-config.js';

export interface InitOptions {
  template?: string;
  language?: string;
  register?: boolean;
}

export async function init(projectName: string, options: InitOptions) {
  clack.intro('⚡  mcp-forge  v0.1.1');

  // Validate project name
  if (!projectName || projectName.length < 2 || !/^[a-z0-9-]+$/i.test(projectName)) {
    clack.outro('❌ Invalid project name. Use alphanumeric characters and hyphens only (min 2 chars).');
    process.exit(1);
  }

  // Check if directory exists
  const targetDir = join(process.cwd(), projectName);
  if (existsSync(targetDir)) {
    clack.outro(`❌ Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  // Interactive prompts (if not provided via flags)
  const template = options.template || await clack.select({
    message: 'Which template would you like to use?',
    options: [
      { value: 'empty', label: 'Empty MCP (clean starting point)' },
      { value: 'postgresql', label: 'PostgreSQL MCP (database tools)' },
      { value: 'rest-api', label: 'REST API Wrapper MCP (HTTP tools)' },
      { value: 'filesystem', label: 'Local FileSystem MCP (file tools)' },
    ],
  }) as string;

  if (clack.isCancel(template)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const language = options.language || await clack.select({
    message: 'Which language?',
    options: [
      { value: 'typescript', label: 'TypeScript' },
    ],
  }) as string;

  if (clack.isCancel(language)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const autoRegister = options.register !== undefined 
    ? options.register 
    : await clack.confirm({
        message: 'Auto-register with Claude Desktop? (recommended)',
        initialValue: true,
      });

  if (clack.isCancel(autoRegister)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const spinner = clack.spinner();
  spinner.start('Creating your MCP server...');

  // Scaffold project
  scaffoldProject(projectName, template as string);

  spinner.stop('✔  Project scaffolded');

  // Register with Claude Desktop
  if (autoRegister) {
    await registerWithClaudeDesktop(projectName, targetDir);
  }

  clack.outro(`✅  ${projectName} is ready!

Next steps:
  cd ${projectName}
  npm install
  npm run dev

Docs: https://github.com/hiyilmaz/mcp-forge`);
}
