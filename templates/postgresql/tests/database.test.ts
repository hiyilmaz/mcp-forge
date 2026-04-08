import { describe, it, expect, vi } from 'vitest';
import { queryDatabase, listTables, describeTable } from '../src/tools/database.js';

vi.mock('pg', () => ({
  Pool: vi.fn(() => ({
    query: vi.fn((sql: string) => {
      if (sql.includes('pg_tables')) {
        return Promise.resolve({ rows: [{ tablename: 'users' }, { tablename: 'posts' }] });
      }
      if (sql.includes('information_schema')) {
        return Promise.resolve({ rows: [{ column_name: 'id', data_type: 'integer', is_nullable: 'NO' }] });
      }
      return Promise.resolve({ rows: [{ id: 1, name: 'test' }] });
    }),
  })),
}));

describe('Database Tools', () => {
  it('queryDatabase validates non-empty SQL', async () => {
    await expect(queryDatabase('')).rejects.toThrow('SQL query cannot be empty');
  });

  it('listTables returns array of table names', async () => {
    const tables = await listTables();
    expect(Array.isArray(tables)).toBe(true);
    expect(tables).toContain('users');
  });

  it('describeTable validates table name', async () => {
    await expect(describeTable('')).rejects.toThrow('Table name cannot be empty');
  });
});
