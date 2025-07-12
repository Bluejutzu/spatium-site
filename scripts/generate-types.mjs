import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url'
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONVEX_DIR = join(__dirname, '..', 'convex');
const TYPES_PACKAGE_DIR = join(__dirname, '..', 'packages', 'spatium-types');
const CONVEX_GENERATED_DIR = join(CONVEX_DIR, '_generated');
const LOGS_DIR = join(__dirname, '..', 'logs');
const convexSchemaPath = join(__dirname, '..', 'convex', 'schema.ts');
const spatiumTypesSchemaPath = join(__dirname, '..', 'packages', 'spatium-types', 'src', 'schema.ts');

async function main() {
  try {
    console.log('Generating types from Convex schema...');
    await execAsync('npx convex codegen', { cwd: join(__dirname, '..') });

    console.log('Types generated successfully.');
    console.log('Copying generated types to spatium-types package...');

    const sourceFile = join(CONVEX_GENERATED_DIR, 'dataModel.d.ts');
    const destinationFile = join(TYPES_PACKAGE_DIR, 'src', 'schema.ts');

    let content = await readFile(sourceFile, 'utf-8');
    content = content.replace(
      /from "..\/schema.js";/g,
      'from "../../../convex/schema.js";'
    );

    await writeFile(destinationFile, content);

    console.log("Content written! Copying convex schema to spatium-types package...")
    await fs.copyFile(convexSchemaPath, spatiumTypesSchemaPath);
    console.log("Content written! Copying convex schema to spatium-types package...")

    console.log('Types copied and modified successfully.');
  } catch (error) {
    const logFile = join(LOGS_DIR, 'generate-types-error.txt');
    const errorMessage = `Error generating or copying types:\n${error instanceof Error ? error.stack : String(error)}`;

    try {
      await mkdir(LOGS_DIR, { recursive: true });
      await writeFile(logFile, errorMessage, 'utf-8');
      console.error(
        `Error generating or copying types. See ${logFile} for details.`
      );
      console.error(errorMessage);
    } catch (logError) {
      console.error('Failed to write to log file:', logError);
      console.error('Original error:', error);
    }

    process.exit(1);
  }
}

main();
