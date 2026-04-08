import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node-fetch', () => ({
  default: vi.fn((url: string, options: any) => {
    if (options?.signal?.aborted) {
      return Promise.reject(new Error('AbortError'));
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });
  }),
}));

describe('API Tools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getResource makes HTTP request', async () => {
    const { getResource } = await import('../src/tools/api.js');
    const result = await getResource('/test');
    expect(result).toEqual({ success: true });
  });

  it('postResource makes HTTP POST request', async () => {
    const { postResource } = await import('../src/tools/api.js');
    const result = await postResource('/test', { data: 'test' });
    expect(result).toEqual({ success: true });
  });
});
