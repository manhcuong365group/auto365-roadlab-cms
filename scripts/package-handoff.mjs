import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(new URL("..", import.meta.url).pathname);
const outputDirectory = resolve(process.argv[2] ?? join(projectRoot, "outputs"));
const packageName = "Auto365_Case_Lab_Studio_V2.0_Production_Zero-Rekey_IT_Handoff";
const zipPath = join(outputDirectory, `${packageName}.zip`);
const temporaryRoot = await mkdtemp(join(tmpdir(), "auto365-case-lab-v20-"));
const stagingRoot = join(temporaryRoot, packageName);

const excludedTopLevel = new Set([
  ".git",
  ".next",
  ".sites-runtime",
  ".vinext",
  ".wrangler",
  "dist",
  "node_modules",
  "outputs",
  "work",
]);

try {
  await cp(projectRoot, stagingRoot, {
    recursive: true,
    filter: (source) => {
      const rel = relative(projectRoot, source);
      if (!rel) return true;
      const first = rel.split(sep)[0];
      if (excludedTopLevel.has(first)) return false;
      if (rel.endsWith(".tsbuildinfo")) return false;
      return true;
    },
  });

  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else files.push(path);
    }
  }
  await walk(stagingRoot);
  files.sort((a, b) => a.localeCompare(b));

  const checksumLines = [];
  const manifestLines = [
    "Auto365 Case Lab Studio V2.0 — clean IT handoff manifest",
    "Excluded: .git, node_modules, dist, caches, preview/runtime state and generated outputs.",
    "",
  ];
  for (const file of files) {
    const bytes = await readFile(file);
    const rel = relative(stagingRoot, file).split(sep).join("/");
    checksumLines.push(`${createHash("sha256").update(bytes).digest("hex")}  ${rel}`);
    manifestLines.push(`${String((await stat(file)).size).padStart(10, " ")}  ${rel}`);
  }
  await writeFile(join(stagingRoot, "CHECKSUMS.txt"), `${checksumLines.join("\n")}\n`);
  await writeFile(join(stagingRoot, "FILE_MANIFEST.txt"), `${manifestLines.join("\n")}\n`);

  const zip = spawnSync("zip", ["-q", "-r", zipPath, basename(stagingRoot)], {
    cwd: temporaryRoot,
    encoding: "utf8",
  });
  if (zip.status !== 0) throw new Error(zip.stderr || `zip exited ${zip.status}`);

  const zipBytes = await readFile(zipPath);
  const zipSha256 = createHash("sha256").update(zipBytes).digest("hex");
  console.log(JSON.stringify({ zipPath, zipSha256, fileCount: files.length + 2 }));
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
