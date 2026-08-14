const mockModuleUrl = new URL("./cloudflare-workers-mock.mjs", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return { url: mockModuleUrl, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
