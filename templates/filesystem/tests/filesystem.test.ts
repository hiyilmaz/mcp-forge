import { describe, it, expect } from 'vitest';
import { readFile, writeFile } from '../src/tools/filesystem.js';

describe('FileSystem Tools', () => {
  it('readFile blocks path traversal', () => {
    expect(() => readFile('../../etc/passwd')).toThrow('Access denied');
  });

  it('writeFile blocks path traversal', () => {
    expect(() => writeFile('../../etc/passwd', 'test')).toThrow('Access denied');
  });
});
