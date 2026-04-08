import { describe, it, expect } from 'vitest';
import { server } from '../src/index.js';

describe('MCP Server', () => {
  it('server instance is defined', () => {
    expect(server).toBeDefined();
    expect(server).toBeInstanceOf(Object);
  });
});
