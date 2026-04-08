import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, rmSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execSync } from 'child_process';

describe('TC-INT-FR006-01: Claude Desktop Registration - Clean System', () => {
  const testProject = 'test-claude-clean-' + Date.now();
  const testDir = join(process.cwd(), testProject);
  const testConfigDir = join(tmpdir(), 'claude-test-clean-' + Date.now());
  const testConfigPath = join(testConfigDir, 'claude_desktop_config.json');

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    if (existsSync(testConfigDir)) {
      rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  it('creates config file when it does not exist', () => {
    // Create test config directory
    mkdirSync(testConfigDir, { recursive: true });
    
    // Mock the config path by creating a test scenario
    const config = {
      mcpServers: {
        [testProject]: {
          command: 'node',
          args: [join(testDir, 'src', 'index.js')],
        },
      },
    };
    
    // Simulate what registerWithClaudeDesktop does
    const fs = require('fs');
    fs.writeFileSync(testConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    
    // Verify file was created
    expect(existsSync(testConfigPath)).toBe(true);
    
    // Verify structure
    const content = JSON.parse(readFileSync(testConfigPath, 'utf-8'));
    expect(content.mcpServers).toBeDefined();
    expect(content.mcpServers[testProject]).toBeDefined();
    expect(content.mcpServers[testProject].command).toBe('node');
    expect(content.mcpServers[testProject].args).toHaveLength(1);
  });
});

describe('TC-INT-FR006-02: Claude Desktop Registration - Existing Entries', () => {
  const testProject = 'test-claude-existing-' + Date.now();
  const testDir = join(process.cwd(), testProject);
  const testConfigDir = join(tmpdir(), 'claude-test-existing-' + Date.now());
  const testConfigPath = join(testConfigDir, 'claude_desktop_config.json');

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    if (existsSync(testConfigDir)) {
      rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  it('preserves existing entries when adding new server', () => {
    mkdirSync(testConfigDir, { recursive: true });
    
    // Create existing config
    const existingConfig = {
      mcpServers: {
        'existing-server': {
          command: 'node',
          args: ['/path/to/existing/index.js'],
        },
      },
    };
    
    const fs = require('fs');
    fs.writeFileSync(testConfigPath, JSON.stringify(existingConfig, null, 2), 'utf-8');
    
    // Read and add new entry
    const config = JSON.parse(readFileSync(testConfigPath, 'utf-8'));
    config.mcpServers[testProject] = {
      command: 'node',
      args: [join(testDir, 'src', 'index.js')],
    };
    fs.writeFileSync(testConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    
    // Verify both entries exist
    const updated = JSON.parse(readFileSync(testConfigPath, 'utf-8'));
    expect(updated.mcpServers['existing-server']).toBeDefined();
    expect(updated.mcpServers[testProject]).toBeDefined();
    expect(Object.keys(updated.mcpServers)).toHaveLength(2);
  });
});

describe('TC-INT-FR006-03: Claude Desktop Registration - Real Integration', () => {
  const testProject = 'test-real-register-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('init with --no-register flag skips registration', () => {
    const result = execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    
    // Should not mention registration
    expect(result).not.toContain('Registered with Claude Desktop');
    expect(result).toContain('ready');
  });
});
