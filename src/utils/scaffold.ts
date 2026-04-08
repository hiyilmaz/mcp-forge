import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function scaffoldProject(projectName: string, template: string) {
  const targetDir = join(process.cwd(), projectName);
  const templateDir = join(__dirname, '../templates', template);

  // Copy template files
  mkdirSync(targetDir, { recursive: true });
  cpSync(templateDir, targetDir, { recursive: true });

  // Replace {{PROJECT_NAME}} token in all files
  replaceTokensInDirectory(targetDir, projectName);
}

function replaceTokensInDirectory(dir: string, projectName: string) {
  const files = [
    'package.json',
    'README.md',
    'src/index.ts',
    'tests/index.test.ts',
  ];

  for (const file of files) {
    const filePath = join(dir, file);
    try {
      let content = readFileSync(filePath, 'utf-8');
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      // File might not exist in all templates
    }
  }
}
