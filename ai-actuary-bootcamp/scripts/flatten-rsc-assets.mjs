import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("out");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next.")) {
        await flattenDirectory(dir, fullPath, entry.name);
      }

      await walk(fullPath);
    }
  }
}

async function flattenDirectory(parentDir, sourceDir, prefix) {
  const files = await listTextFiles(sourceDir);

  for (const file of files) {
    const relativePath = path.relative(sourceDir, file);
    const flattenedName = `${prefix}.${relativePath.split(path.sep).join(".")}`;
    const targetPath = path.join(parentDir, flattenedName);

    await mkdir(path.dirname(targetPath), { recursive: true });
    await cp(file, targetPath, { force: true });
  }
}

async function listTextFiles(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...(await listTextFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".txt")) {
      results.push(fullPath);
    }
  }

  return results;
}

try {
  const outStats = await stat(outDir);

  if (!outStats.isDirectory()) {
    throw new Error(`Expected build output directory at ${outDir}`);
  }

  await walk(outDir);
  console.log("Flattened RSC text assets for static hosting.");
} catch (error) {
  console.error("Failed to flatten RSC text assets.");
  throw error;
}
