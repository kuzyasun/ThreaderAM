import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const testCasesDir = path.resolve(currentDir, "../../../test-cases/src");

export function loadFixture<T>(relativePath: string): T {
  const fullPath = path.join(testCasesDir, relativePath);
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}
