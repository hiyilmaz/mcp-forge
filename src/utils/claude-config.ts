import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import * as clack from '@clack/prompts';

function getConfigPath(): string {
  const platform = process.platform;
  
  if (platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    return join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
  } else {
    return join(homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
}

export async function registerWithClaudeDesktop(projectName: string, projectPath: string): Promise<void> {
  const configPath = getConfigPath();
  
  let config: any = { mcpServers: {} };
  
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      config = JSON.parse(content);
      if (!config.mcpServers) {
        config.mcpServers = {};
      }
    } catch (error) {
      clack.log.warn('Could not parse existing config, creating new one');
    }
  }

  if (config.mcpServers[projectName]) {
    const overwrite = await clack.confirm({
      message: `Entry "${projectName}" already exists in Claude Desktop config. Overwrite?`,
      initialValue: false,
    });

    if (clack.isCancel(overwrite) || !overwrite) {
      clack.log.info('Skipped Claude Desktop registration');
      return;
    }
  }

  config.mcpServers[projectName] = {
    command: 'node',
    args: [join(projectPath, 'src', 'index.js')],
  };

  try {
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    clack.log.success('Registered with Claude Desktop');
    clack.log.warn('⚠️  Restart Claude Desktop to apply changes');
  } catch (error: any) {
    clack.log.error(`Failed to register: ${error.message}`);
  }
}
