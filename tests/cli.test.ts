import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

describe('TC-CONTRACT-AR001-01: CLI Dependencies', () => {
  it('package.json includes required dependencies', () => {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    
    // Must have @clack/prompts and commander
    expect(pkg.dependencies).toHaveProperty('@clack/prompts');
    expect(pkg.dependencies).toHaveProperty('commander');
    
    // Must NOT have inquirer or prompts (wrong libraries)
    expect(pkg.dependencies).not.toHaveProperty('inquirer');
    expect(pkg.dependencies).not.toHaveProperty('prompts');
  });
});

describe('TC-CONTRACT-AR004-01: TypeScript-First', () => {
  it('no .js source files in src/ directory', () => {
    const srcPath = join(process.cwd(), 'src');
    
    function getAllFiles(dir: string, fileList: string[] = []): string[] {
      const files = readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = join(dir, file.name);
        if (file.isDirectory()) {
          getAllFiles(fullPath, fileList);
        } else {
          fileList.push(fullPath);
        }
      }
      return fileList;
    }
    
    const allFiles = getAllFiles(srcPath);
    const jsFiles = allFiles.filter(f => f.endsWith('.js'));
    
    expect(jsFiles).toHaveLength(0);
  });
  
  it('all source files are TypeScript', () => {
    const srcPath = join(process.cwd(), 'src');
    
    function getAllFiles(dir: string, fileList: string[] = []): string[] {
      const files = readdirSync(dir, { withFileTypes: true });
      for (const file of files) {
        const fullPath = join(dir, file.name);
        if (file.isDirectory()) {
          getAllFiles(fullPath, fileList);
        } else {
          fileList.push(fullPath);
        }
      }
      return fileList;
    }
    
    const allFiles = getAllFiles(srcPath);
    const codeFiles = allFiles.filter(f => !f.includes('node_modules'));
    
    expect(codeFiles.length).toBeGreaterThan(0);
    expect(codeFiles.every(f => f.endsWith('.ts'))).toBe(true);
  });
});

describe('TC-CONTRACT-AR002-01: Template Rendering', () => {
  it('templates directory exists with static files', () => {
    const templatesPath = join(process.cwd(), 'templates');
    expect(existsSync(templatesPath)).toBe(true);
    
    const templates = readdirSync(templatesPath);
    expect(templates).toContain('empty');
    expect(templates).toContain('postgresql');
    expect(templates).toContain('rest-api');
    expect(templates).toContain('filesystem');
  });
  
  it('no eval() or Function() in scaffold code', () => {
    const scaffoldPath = join(process.cwd(), 'src', 'utils', 'scaffold.ts');
    const content = readFileSync(scaffoldPath, 'utf-8');
    
    expect(content).not.toContain('eval(');
    expect(content).not.toContain('new Function(');
  });
});

describe('TC-CONTRACT-AR003-01: MCP SDK Dependency', () => {
  it('all templates use @modelcontextprotocol/sdk', () => {
    const templatesPath = join(process.cwd(), 'templates');
    const templates = readdirSync(templatesPath);
    
    for (const template of templates) {
      const pkgPath = join(templatesPath, template, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      
      expect(pkg.dependencies).toHaveProperty('@modelcontextprotocol/sdk');
    }
  });
});
