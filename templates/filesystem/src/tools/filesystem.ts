import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';

const ALLOWED_BASE_PATH = resolve(process.env.ALLOWED_BASE_PATH || process.cwd());

function isPathAllowed(filePath: string): boolean {
  const resolvedPath = resolve(filePath);
  return resolvedPath.startsWith(ALLOWED_BASE_PATH);
}

export function readFile(path: string): string {
  const fullPath = join(ALLOWED_BASE_PATH, path);
  
  if (!isPathAllowed(fullPath)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    return readFileSync(fullPath, 'utf-8');
  } catch (error: any) {
    throw new Error(`File read error: ${error.message}`);
  }
}

export function writeFile(path: string, content: string): void {
  const fullPath = join(ALLOWED_BASE_PATH, path);
  
  if (!isPathAllowed(fullPath)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, 'utf-8');
  } catch (error: any) {
    throw new Error(`File write error: ${error.message}`);
  }
}

export function listDirectory(path: string): string[] {
  const fullPath = join(ALLOWED_BASE_PATH, path);
  
  if (!isPathAllowed(fullPath)) {
    throw new Error('Access denied: Path outside allowed directory');
  }

  try {
    return readdirSync(fullPath);
  } catch (error: any) {
    throw new Error(`Directory read error: ${error.message}`);
  }
}
