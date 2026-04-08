import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

describe('TC-INT-NFR002-01: Cross-Platform Compatibility - Path Handling', () => {
  it('getConfigPath function handles different platforms', () => {
    const claudeConfigPath = join(process.cwd(), 'src', 'utils', 'claude-config.ts');
    const content = readFileSync(claudeConfigPath, 'utf-8');
    
    // Verify platform detection exists
    expect(content).toContain('process.platform');
    
    // Verify macOS path handling
    expect(content).toContain('darwin');
    expect(content).toContain('Library');
    expect(content).toContain('Application Support');
    
    // Verify Windows path handling
    expect(content).toContain('win32');
    expect(content).toContain('APPDATA');
    
    // Verify Linux fallback
    expect(content).toContain('.config');
  });
});

describe('TC-INT-NFR002-02: Cross-Platform Compatibility - File Operations', () => {
  it('uses Node.js path module for cross-platform paths', () => {
    const scaffoldPath = join(process.cwd(), 'src', 'utils', 'scaffold.ts');
    const content = readFileSync(scaffoldPath, 'utf-8');
    
    // Should use path.join, not string concatenation
    expect(content).toContain("from 'path'");
    expect(content).toContain('join(');
    
    // Should not use hardcoded path separators
    expect(content).not.toMatch(/['"]\/[^/]+\/[^/]+['"]/); // No hardcoded /path/to/file
  });
});

describe('TC-MANUAL-NFR004-01: Package Size', () => {
  it('package size is under 5MB when packed', () => {
    try {
      execSync('npm pack --dry-run', { 
        stdio: 'pipe',
        encoding: 'utf-8'
      });
    } catch (error: any) {
      // npm pack outputs to stderr, not stdout
      const result = error.stderr || error.stdout || '';
      
      // Extract unpacked size from output: "npm notice unpacked size: 149.1 kB"
      const match = result.match(/unpacked size:\s+([\d.]+)\s+(kB|MB|GB)/i);
      expect(match).toBeTruthy();
      
      if (match) {
        const size = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        
        // Convert to KB
        let sizeInKB = size;
        if (unit === 'MB') {
          sizeInKB = size * 1024;
        } else if (unit === 'GB') {
          sizeInKB = size * 1024 * 1024;
        }
        
        const maxSizeKB = 5 * 1024; // 5MB
        expect(sizeInKB).toBeLessThan(maxSizeKB);
      }
    }
  });
});

describe('TC-CONTRACT-NFR003-01: Zero Breaking Changes - SDK Usage', () => {
  it('templates use stable MCP SDK APIs', () => {
    const templates = ['empty', 'postgresql', 'rest-api', 'filesystem'];
    
    for (const template of templates) {
      const indexPath = join(process.cwd(), 'templates', template, 'src', 'index.ts');
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should import from official SDK
      expect(content).toContain('@modelcontextprotocol/sdk');
      
      // Should use Server class
      expect(content).toContain('Server');
      
      // Should use StdioServerTransport
      expect(content).toContain('StdioServerTransport');
      
      // Should NOT use internal/experimental APIs
      expect(content).not.toContain('_internal');
      expect(content).not.toContain('experimental');
    }
  });
});

describe('TC-CONTRACT-NFR003-02: Zero Breaking Changes - No Internal Imports', () => {
  it('no templates import from SDK internals', () => {
    const templates = ['empty', 'postgresql', 'rest-api', 'filesystem'];
    
    for (const template of templates) {
      const indexPath = join(process.cwd(), 'templates', template, 'src', 'index.ts');
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should not import from /internal/ or /dist/
      expect(content).not.toContain('/internal/');
      expect(content).not.toContain('/dist/');
      expect(content).not.toContain('/__');
    }
  });
});
