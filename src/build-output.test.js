import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = '/pilgrims-predestined-path/';
const VITE_BIN = join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
let out;

beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), 'ppp-dist-'));
  // Child process, not vite.build(): Vitest sets NODE_ENV=test, which would ship the dev React bundle.
  execFileSync(process.execPath, [VITE_BIN, 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'silent'], {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'pipe',
  });
}, 120_000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

const htmlUrls = () => {
  const html = readFileSync(join(out, 'index.html'), 'utf8');
  return [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
};

const cssUrls = () =>
  walk(out)
    .filter((p) => p.endsWith('.css'))
    .flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map((m) => m[1]));

describe('production build output', () => {
  it('index.html references only base-prefixed local URLs', () => {
    const urls = htmlUrls();
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u.startsWith(BASE), u).toBe(true);
  });

  it('no built file mentions fonts.googleapis.com or a root-absolute asset URL', () => {
    for (const f of walk(out).filter((p) => /\.(html|css|js)$/.test(p))) {
      const t = readFileSync(f, 'utf8');
      expect(t.includes('fonts.googleapis.com'), f).toBe(false);
      expect(/url\(\s*["']?\/(?!pilgrims-predestined-path\/)/.test(t), f).toBe(false);
    }
  });

  it('every base-prefixed URL in index.html and built CSS names a file in the build output', () => {
    const urls = [...htmlUrls(), ...cssUrls()].filter((u) => u.startsWith(BASE));
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(existsSync(join(out, u.slice(BASE.length))), u).toBe(true);
  });

  it('index.html loads its script and stylesheet from content-hashed names', () => {
    const urls = htmlUrls();
    expect(urls.some((u) => /^\/pilgrims-predestined-path\/assets\/index-[A-Za-z0-9_-]+\.js$/.test(u))).toBe(true);
    expect(urls.some((u) => /^\/pilgrims-predestined-path\/assets\/index-[A-Za-z0-9_-]+\.css$/.test(u))).toBe(true);
  });
});
