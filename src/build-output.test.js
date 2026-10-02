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

const ORIGIN = 'https://avocadopanic.github.io';
const MANIFEST_URL = `${ORIGIN}${BASE}manifest.webmanifest`;
const readManifest = () => JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
const underBase = (u) => u.origin === ORIGIN && u.pathname.startsWith(BASE);
const png = (file) => {
  const b = readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), colorType: b[25], hasTrns: b.includes(Buffer.from('tRNS')) };
};
const fileUnderBase = (url) => join(out, decodeURIComponent(new URL(url).pathname.slice(BASE.length)));

// An emergency kill-switch deploy flips this together with KILL_SWITCH in vite.config.js
// (the two-key procedure in docs/PWA.md), so a single accidental flip fails CI.
const EXPECT_KILL_SWITCH = false;

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

describe('PWA build output', () => {
  it('manifest scope, start_url and id stay under the base path', () => {
    const m = readManifest();
    expect(underBase(new URL(m.scope, MANIFEST_URL)), 'scope').toBe(true);
    expect(underBase(new URL(m.start_url, MANIFEST_URL)), 'start_url').toBe(true);
    // id resolves against the origin, not the manifest URL (RESEARCH Pitfall 3)
    expect(underBase(new URL(m.id, ORIGIN)), 'id').toBe(true);
    expect(m.display).toBe('standalone');
  });

  it('manifest carries the decided name, description, colors and orientation', () => {
    const m = readManifest();
    expect(m.name).toBe("The Pilgrim's Predestined Path");
    expect(m.short_name).toBe("Pilgrim's Path");
    expect(m.description).toBe('A board game of Reformed theology for 2 to 4 players on one screen');
    expect(m.theme_color).toBe('#0a0608');
    expect(m.background_color).toBe('#0a0608');
    expect(m.orientation).toBe('any');
    expect(m).not.toHaveProperty('screenshots');
  });

  it('manifest declares 192, 512 any and a separate 512 maskable icon at the right size', () => {
    const icons = readManifest().icons.map((i) => ({ ...i, url: new URL(i.src, MANIFEST_URL) }));
    for (const i of icons) expect(underBase(i.url), i.src).toBe(true);
    const pick = (size, purpose) => icons.find((i) => i.sizes === size && (i.purpose ?? 'any') === purpose);
    for (const [size, purpose] of [['192x192', 'any'], ['512x512', 'any'], ['512x512', 'maskable']]) {
      const i = pick(size, purpose);
      expect(i, `${size} ${purpose}`).toBeTruthy();
      const p = png(fileUnderBase(i.url));
      expect(`${p.w}x${p.h}`, i.src).toBe(size);
    }
  });

  it('index.html links a 180x180 opaque apple-touch-icon and the manifest under the base', () => {
    const html = readFileSync(join(out, 'index.html'), 'utf8');
    const href = html.match(/<link[^>]+rel="apple-touch-icon"[^>]+href="([^"]+)"/)?.[1];
    expect(href?.startsWith(BASE)).toBe(true);
    const p = png(join(out, href.slice(BASE.length)));
    expect([p.w, p.h]).toEqual([180, 180]);
    expect(p.hasTrns || p.colorType === 4 || p.colorType === 6).toBe(false);
    expect(html).toContain(`rel="manifest" href="${BASE}manifest.webmanifest"`);
    expect(html).toContain(`name="apple-mobile-web-app-title" content="Pilgrim's Path"`);
  });

  it('sw.js is the real generateSW worker and registers under the base scope', () => {
    const sw = readFileSync(join(out, 'sw.js'), 'utf8');
    if (EXPECT_KILL_SWITCH) {
      expect(sw).toContain('unregister');
      expect(sw).not.toContain('precacheAndRoute');
      return;
    }
    expect(sw).toContain('precacheAndRoute');
    expect(sw).toContain('cleanupOutdatedCaches');
    expect(sw).not.toContain('registration.unregister');
    const js = walk(join(out, 'assets'))
      .filter((f) => f.endsWith('.js'))
      .map((f) => readFileSync(f, 'utf8'))
      .join(' ');
    expect(js).toContain(`${BASE}sw.js`);
    expect(js).toMatch(/scope:["'\x60]\/pilgrims-predestined-path\/["'\x60]/);
  });
});
