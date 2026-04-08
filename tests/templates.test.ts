import { describe, it, expect, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';

describe('TC-CONTRACT-FR003-01: PostgreSQL Template - TypeScript Compilation', () => {
  const testProject = 'test-pg-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('compiles without TypeScript errors', () => {
    execSync(
      `node dist/index.js init ${testProject} --template postgresql --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const result = execSync('npx tsc --noEmit', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(result.trim()).toBe('');
  });
});

describe('TC-UNIT-FR003-01: PostgreSQL Template - Tests Pass', () => {
  const testProject = 'test-pg-tests-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('has passing unit tests with mocked DB', () => {
    execSync(
      `node dist/index.js init ${testProject} --template postgresql --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const testResult = execSync('npm test', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(testResult).toContain('passed');
    expect(testResult).not.toContain('0 passed');
  });
});

describe('TC-CONTRACT-FR004-01: REST API Template - TypeScript Compilation', () => {
  const testProject = 'test-api-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('compiles without TypeScript errors', () => {
    execSync(
      `node dist/index.js init ${testProject} --template rest-api --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const result = execSync('npx tsc --noEmit', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(result.trim()).toBe('');
  });
});

describe('TC-UNIT-FR004-01: REST API Template - Tests Pass', () => {
  const testProject = 'test-api-tests-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('has passing unit tests with mocked HTTP', () => {
    execSync(
      `node dist/index.js init ${testProject} --template rest-api --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const testResult = execSync('npm test', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(testResult).toContain('passed');
    expect(testResult).not.toContain('0 passed');
  });
});

describe('TC-CONTRACT-FR005-01: FileSystem Template - TypeScript Compilation', () => {
  const testProject = 'test-fs-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('compiles without TypeScript errors', () => {
    execSync(
      `node dist/index.js init ${testProject} --template filesystem --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const result = execSync('npx tsc --noEmit', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(result.trim()).toBe('');
  });
});

describe('TC-UNIT-FR005-01: FileSystem Template - Path Traversal Security', () => {
  const testProject = 'test-fs-security-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('blocks path traversal attacks in tests', () => {
    execSync(
      `node dist/index.js init ${testProject} --template filesystem --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const testResult = execSync('npm test', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(testResult).toContain('passed');
    
    // Verify test file actually tests path traversal
    const testFile = readFileSync(join(testDir, 'tests', 'filesystem.test.ts'), 'utf-8');
    expect(testFile).toContain('../../');
    expect(testFile).toContain('Access denied');
  });
});

describe('TC-INT-FR007-02: Error Handling in Templates', () => {
  const testProject = 'test-error-handling-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('templates with tools have try-catch error handling', () => {
    const templatesWithTools = ['postgresql', 'rest-api', 'filesystem'];
    
    for (const template of templatesWithTools) {
      execSync(
        `node dist/index.js init ${testProject}-${template} --template ${template} --language typescript --no-register`,
        { stdio: 'pipe' }
      );
      
      const indexPath = join(process.cwd(), `${testProject}-${template}`, 'src', 'index.ts');
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should have try-catch in request handler
      expect(content).toContain('try');
      expect(content).toContain('catch');
      
      // Should return MCP error response
      expect(content).toContain('isError: true');
      
      // Clean up
      rmSync(join(process.cwd(), `${testProject}-${template}`), { recursive: true, force: true });
    }
  });
  
  it('all templates have error handling in main function', () => {
    const templates = ['empty', 'postgresql', 'rest-api', 'filesystem'];
    
    for (const template of templates) {
      execSync(
        `node dist/index.js init ${testProject}-${template} --template ${template} --language typescript --no-register`,
        { stdio: 'pipe' }
      );
      
      const indexPath = join(process.cwd(), `${testProject}-${template}`, 'src', 'index.ts');
      const content = readFileSync(indexPath, 'utf-8');
      
      // Should have .catch() on main function
      expect(content).toContain('main().catch');
      expect(content).toContain('process.exit(1)');
      
      // Clean up
      rmSync(join(process.cwd(), `${testProject}-${template}`), { recursive: true, force: true });
    }
  });
});
