/**
 * TC-INT-FR003-01: PostgreSQL Template Integration Test
 *
 * PRD: FR-003 - PostgreSQL MCP Template
 * Evidence: list_tables returns array of table names from real DB
 *
 * Requires: DATABASE_URL environment variable pointing to a PostgreSQL instance.
 * Skipped locally when DATABASE_URL is not set.
 * Runs in CI via GitHub Actions with postgres service container.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const HAS_DB = !!process.env.DATABASE_URL;

describe.skipIf(!HAS_DB)('TC-INT-FR003-01: PostgreSQL Template - Real DB Integration', () => {
  const testProject = 'test-pg-integration-' + Date.now();
  const testDir = join(process.cwd(), testProject);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('list_tables returns array of table names from real PostgreSQL database', async () => {
    // Scaffold project
    execSync(
      `node dist/index.js init ${testProject} --template postgresql --language typescript --no-register`,
      { stdio: 'pipe' }
    );

    // Install dependencies
    execSync('npm install --silent', { cwd: testDir, stdio: 'pipe' });

    // Write an integration test file that uses the real DATABASE_URL
    const integrationTest = `
import { describe, it, expect } from 'vitest';
import { listTables } from '../src/tools/database.js';

describe('Real DB - list_tables', () => {
  it('returns an array from a real PostgreSQL connection', async () => {
    const tables = await listTables();
    // Result should be an array (may be empty on a fresh DB)
    expect(Array.isArray(tables)).toBe(true);
  });
});
`;
    writeFileSync(join(testDir, 'tests', 'db-real.test.ts'), integrationTest, 'utf-8');

    // Run only the real integration test with DATABASE_URL injected
    const testResult = execSync('npm test -- --reporter=verbose db-real', {
      cwd: testDir,
      stdio: 'pipe',
      encoding: 'utf-8',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });

    expect(testResult).toContain('passed');
    expect(testResult).not.toContain('failed');
  });
});
