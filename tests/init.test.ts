import { describe, it, expect, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('TC-INT-FR001-01: Init Command - Directory Creation', () => {
  const testProject = 'test-project-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('creates project directory with all required files', () => {
    execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe' }
    );

    // Directory exists
    expect(existsSync(testDir)).toBe(true);
    
    // Required files exist
    expect(existsSync(join(testDir, 'package.json'))).toBe(true);
    expect(existsSync(join(testDir, 'tsconfig.json'))).toBe(true);
    expect(existsSync(join(testDir, 'README.md'))).toBe(true);
    expect(existsSync(join(testDir, 'src', 'index.ts'))).toBe(true);
    expect(existsSync(join(testDir, 'tests'))).toBe(true);
  });
  
  it('replaces {{PROJECT_NAME}} token in files', () => {
    execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    const pkgContent = readFileSync(join(testDir, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgContent);
    
    expect(pkg.name).toBe(testProject);
    expect(pkgContent).not.toContain('{{PROJECT_NAME}}');
    
    const srcContent = readFileSync(join(testDir, 'src', 'index.ts'), 'utf-8');
    expect(srcContent).toContain(testProject);
    expect(srcContent).not.toContain('{{PROJECT_NAME}}');
  });
});

describe('TC-INT-FR001-02: Init Command - Directory Exists Error', () => {
  const testProject = 'test-existing-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('exits with error when directory already exists', () => {
    // Create directory first
    execSync(`mkdir ${testProject}`, { stdio: 'pipe' });

    // Try to init with same name - should fail
    expect(() => {
      execSync(
        `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
        { stdio: 'pipe' }
      );
    }).toThrow();
    
    // Directory should still be empty (not overwritten)
    const files = readdirSync(testDir);
    expect(files.length).toBe(0);
  });
});

describe('TC-UNIT-FR001-01: Init Command - Invalid Name Validation', () => {
  it('rejects project name with spaces', () => {
    expect(() => {
      execSync(
        'node dist/index.js init "my project" --template empty --language typescript --no-register',
        { stdio: 'pipe' }
      );
    }).toThrow();
  });

  it('rejects project name too short', () => {
    expect(() => {
      execSync(
        'node dist/index.js init "a" --template empty --language typescript --no-register',
        { stdio: 'pipe' }
      );
    }).toThrow();
  });
  
  it('rejects project name with special characters', () => {
    expect(() => {
      execSync(
        'node dist/index.js init "my@project!" --template empty --language typescript --no-register',
        { stdio: 'pipe' }
      );
    }).toThrow();
  });
});

describe('TC-INT-FR001-03: Init Command - Non-Interactive Flags', () => {
  const testProject = 'test-flags-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('completes successfully with all flags provided', () => {
    const result = execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );

    expect(result).toContain('ready');
    expect(existsSync(testDir)).toBe(true);
  });
});

describe('TC-INT-FR002-01: Empty Template - Server Runs', () => {
  const testProject = 'test-empty-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('generated server compiles without errors', () => {
    execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    // Install dependencies
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    // Compile TypeScript
    const compileResult = execSync('npx tsc --noEmit', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    // Should compile without errors (empty output)
    expect(compileResult.trim()).toBe('');
  });
});

describe('TC-UNIT-FR007-01: Built-in Best Practices - Tests', () => {
  const testProject = 'test-practices-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('generated template has passing tests', () => {
    execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });
    
    const testResult = execSync('npm test', { 
      cwd: testDir, 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    
    expect(testResult).toContain('passed');
    expect(testResult).not.toContain('failed');
  });
});

describe('TC-PERF-NFR001-01: CLI Startup Time', () => {
  it('--help responds in under 2 seconds', () => {
    const start = Date.now();
    execSync('node dist/index.js --help', { stdio: 'pipe' });
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(2000);
  });
});

describe('TC-E2E-FR008-01: Terminal UX — Step-by-Step User Flow', () => {
  const testProject = 'test-ux-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('displays banner with mcp-forge branding', () => {
    const result = execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    expect(result).toMatch(/mcp-forge/i);
  });

  it('displays success message with project name and next steps', () => {
    const result = execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    expect(result).toContain(testProject);
    expect(result).toContain('npm install');
    expect(result).toContain('npm run dev');
  });

  it('displays correct docs URL in success message', () => {
    const result = execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    expect(result).toContain('https://github.com/hiyilmaz/mcp-forge');
  });

  it('completes full init flow in under 5 seconds', () => {
    const start = Date.now();
    execSync(
      `node dist/index.js init ${testProject} --template empty --language typescript --no-register`,
      { stdio: 'pipe' }
    );
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  });
});
