import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const __dirname = new URL(".", import.meta.url).pathname.replace(/^\//, "");
const CONVEX_DIR = join(__dirname, "..", "convex");
const TYPES_PACKAGE_DIR = join(__dirname, "..", "packages", "spatium-types");
const CONVEX_GENERATED_DIR = join(CONVEX_DIR, "_generated");
const LOGS_DIR = join(__dirname, "..", "logs");

async function main() {
    try {
        console.log("Generating types from Convex schema...");
        await execAsync("npx convex codegen", { cwd: join(__dirname, "..") });

        console.log("Types generated successfully.");
        console.log("Copying generated types to spatium-types package...");

        const sourceFile = join(CONVEX_GENERATED_DIR, "dataModel.d.ts");
        const destinationFile = join(TYPES_PACKAGE_DIR, "src", "schema.ts");

        let content = await readFile(sourceFile, "utf-8");
        content = content.replace(/from "..\/schema.js";/g, 'from "../../../convex/schema.js";');
        
        await writeFile(destinationFile, content);
        
        console.log("Types copied and modified successfully.");
    } catch (error) {
        const logFile = join(LOGS_DIR, "generate-types-error.txt");
        const errorMessage = `Error generating or copying types:\n${error instanceof Error ? error.stack : String(error)}`;

        try {
            await mkdir(LOGS_DIR, { recursive: true });
            await writeFile(logFile, errorMessage, "utf-8");
            console.error(`Error generating or copying types. See ${logFile} for details.`);
        } catch (logError) {
            console.error("Failed to write to log file:", logError);
            console.error("Original error:", error);
        }

        process.exit(1);
    }
}

main();