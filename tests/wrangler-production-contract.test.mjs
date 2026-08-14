import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("cấu hình mặc định deploy đúng Worker SSR với assets và D1", async () => {
  const [config, viteConfig] = await Promise.all([
    readFile(new URL("wrangler.toml", root), "utf8"),
    readFile(new URL("vite.config.ts", root), "utf8"),
  ]);

  assert.match(config, /^main = "dist\/server\/index\.js"$/m);
  assert.match(config, /^directory = "dist\/client"$/m);
  assert.match(config, /^binding = "ASSETS"$/m);
  assert.doesNotMatch(config, /^pages_build_output_dir/m);
  assert.doesNotMatch(config, /^\[\[d1_databases\]\]/m);
  assert.match(viteConfig, /database_name: "auto365-roadlab-cms-db"/);
  assert.match(viteConfig, /database_id: "599cffe7-abf2-436b-b0bc-d893e15dfc37"/);
  assert.doesNotMatch(viteConfig, /site-creator-d1/);
});
