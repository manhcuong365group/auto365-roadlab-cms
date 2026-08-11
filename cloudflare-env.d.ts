declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
  }
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(): Promise<T[]>;
}

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
  error?: string;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
  dump(): Promise<ArrayBuffer>;
}

interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | Blob, options?: Record<string, unknown>): Promise<unknown>;
  get(key: string): Promise<unknown | null>;
  delete(key: string | string[]): Promise<void>;
  head(key: string): Promise<unknown | null>;
}

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
