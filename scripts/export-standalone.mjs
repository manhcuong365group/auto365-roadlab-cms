import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(new URL("..", import.meta.url).pathname);
const outputPath = resolve(process.argv[2] ?? join(projectRoot, "outputs", "Auto365_Case_Lab_Studio_V2.0_Standalone_Review.html"));
const workerPath = join(projectRoot, "dist", "server", "index.js");
const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("standalone", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
let response = await worker.fetch(new Request("http://localhost/studio"), env, ctx);
if (response.status >= 300 && response.status < 400) {
  const location = response.headers.get("location");
  if (!location) throw new Error("Studio redirected without a Location header");
  response = await worker.fetch(new Request(new URL(location, "http://localhost")), env, ctx);
}
if (!response.ok) throw new Error(`Studio render failed with ${response.status}`);

let html = await response.text();
const cssHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)].map((match) => match[1]);
const styles = await Promise.all(cssHrefs.map(async (href) => {
  const relative = href.replace(/^\//, "");
  return readFile(join(projectRoot, "dist", "client", relative), "utf8");
}));

html = html
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, "")
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/g, "")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
  .replace("</head>", `<style>${styles.join("\n")}</style><style>.standalone-note{position:fixed;right:12px;bottom:12px;z-index:999;padding:8px 11px;background:#0b1118;color:#fff;font:700 10px/1.3 Arial,sans-serif;box-shadow:0 5px 18px #0003}.zero-mobile-action{display:none!important}</style></head>`)
  .replace("</body>", '<div class="standalone-note">Bản HTML duyệt giao diện · thao tác thật nằm trong gói source</div></body>');

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html);
console.log(outputPath);
