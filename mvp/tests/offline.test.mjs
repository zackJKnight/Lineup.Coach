import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

// Runs the actual emitted service worker against an in-memory Cache API.
// This verifies fetch/install behavior, not browser installation or iOS behavior.
async function setup() {
  const handlers = new Map();
  const stores = new Map([['other-app-cache', new Map()], ['lineup-old-build', new Map()]]);
  let networkCalls = 0;
  let claimed = false;
  const key = request => new URL(typeof request === 'string' ? request : request.url, 'https://test.example').pathname;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async addAll(paths) {
          for (const path of paths) store.set(path, await readFile(`dist${path}`, 'utf8'));
        }
      };
    },
    async match(request) {
      for (const store of stores.values()) {
        const body = store.get(key(request));
        if (body !== undefined) return new Response(body);
      }
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); }
  };
  runInNewContext(await readFile('dist/sw.js', 'utf8'), {
    self: {
      async skipWaiting() {},
      location: { origin: 'https://test.example' },
      clients: { async claim() { claimed = true; } },
      addEventListener(name, handler) { handlers.set(name, handler); }
    },
    caches,
    URL,
    fetch: async () => { networkCalls++; throw new TypeError('Network unavailable'); }
  });
  async function lifecycle(name) {
    let completion;
    handlers.get(name)({ waitUntil(promise) { completion = promise; } });
    await completion;
  }
  async function request(url, mode = 'cors', method = 'GET') {
    let response;
    handlers.get('fetch')({ request: { url, mode, method }, respondWith(promise) { response = promise; } });
    return response;
  }
  await lifecycle('install');
  return { stores, lifecycle, request, networkCalls: () => networkCalls, claimed: () => claimed };
}

test('emitted worker returns the cached app shell when navigation loses network', async () => {
  const app = await setup();
  const response = await app.request('https://test.example/', 'navigate');
  assert.equal(await response.text(), await readFile('dist/index.html', 'utf8'));
  assert.equal(app.networkCalls(), 1);
});

test('all emitted scripts, styles and generation-worker code load from cache offline', async () => {
  const app = await setup();
  const files = (await readdir('dist/assets')).filter(name => /\.(js|css)$/.test(name));
  assert.ok(files.some(name => name.startsWith('worker-')));
  for (const name of files) {
    const response = await app.request(`https://test.example/assets/${name}`);
    assert.equal(await response.text(), await readFile(`dist/assets/${name}`, 'utf8'));
  }
  assert.equal(app.networkCalls(), 0);
  assert.equal(await app.request('https://api.example/teams'), undefined);
  assert.equal(await app.request('https://test.example/teams', 'cors', 'POST'), undefined);
});

test('activation removes old lineup caches and preserves unrelated caches', async () => {
  const app = await setup();
  await app.lifecycle('activate');
  assert.equal(app.stores.has('lineup-old-build'), false);
  assert.equal(app.stores.has('other-app-cache'), true);
  assert.equal(app.claimed(), true);
});
