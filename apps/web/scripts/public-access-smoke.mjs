// Run against an isolated local database; creates two users and one pet.
// See specs/005-public-browsing/validation.md for preparation and commands.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
const base = process.env.SMOKE_BASE_URL ?? 'http://localhost:3102';
assert.equal(process.env.SMOKE_ISOLATED_DATABASE, 'true', 'Use a disposable database and set SMOKE_ISOLATED_DATABASE=true');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const secret = process.env.JWT_SECRET;
assert.ok(secret, 'JWT_SECRET must match the local server');
const request = (path, init = {}) => fetch(base + path, { redirect: 'manual', ...init });
const json = (method, body, token) => ({ method, headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
// A parent loading boundary can stream HTML before a server redirect is resolved.
const redirectDestination = async response => {
  if (response.status === 307) return new URL(response.headers.get('location'), base);
  assert.equal(response.status, 200);
  const html = await response.text();
  const match = html.match(/<meta id="__next-page-redirect"[^>]*content="\d;url=([^"<>]+)"/);
  assert.ok(match, 'Expected Next streaming redirect');
  return new URL(match[1].replaceAll('&amp;', '&'), base);
};
const suffix = Date.now();
const credentials = { name: 'Public smoke owner', email: `public-owner-${suffix}@hugg.test`, password: 'hugg-smoke-123456' };
const ownerResponse = await request('/api/auth/register', json('POST', credentials));
assert.equal(ownerResponse.status, 201);
const owner = await ownerResponse.json();
const otherResponse = await request('/api/auth/register', json('POST', { ...credentials, email: `public-other-${suffix}@hugg.test` }));
assert.equal(otherResponse.status, 201);
const other = await otherResponse.json();
const petResponse = await request('/api/pets', json('POST', {
  name: `Public Smoke Pet ${suffix}`, species: 'DOG', situation: 'SHELTER', breed: 'Sem raça definida (SRD)',
  waitingSince: '2026-01-01T00:00:00.000Z', imageUrls: ['https://example.com/pet.jpg'],
  locationPhone: '11999999999', locationNote: 'Local de teste', latitude: -23.55, longitude: -46.63,
}, owner.token));
assert.equal(petResponse.status, 201);
const pet = await petResponse.json();
const detail = `/pets/${pet.id}`;
const expired = jwt.sign({ sub: owner.user.id }, secret, { expiresIn: -10 });
const forged = jwt.sign({ sub: owner.user.id }, 'incorrect-secret', { expiresIn: '1h' });
for (const token of [undefined, 'invalid', expired, forged]) {
  const headers = token ? { cookie: `token=${token}` } : {};
  for (const path of ['/', detail, '/api/pets', `${detail.replace('/pets/', '/api/pets/')}`, '/api/pets?search=Public&waitingFilter=90%2B', '/api/pets/nearby?lat=-23.55&lng=-46.63']) {
    assert.equal((await request(path, { headers })).status, 200, `${path} public`);
  }
  for (const path of ['/pets/new', detail + '/edit']) {
    const response = await request(path, { headers });
    const dest = await redirectDestination(response);
    assert.equal(dest.pathname, '/login');
    assert.equal(dest.searchParams.get('next'), path);
  }
  assert.equal((await request('/api/pets', { ...json('POST', {}), headers: { ...headers, 'content-type': 'application/json' } })).status, 401);
  assert.equal((await request('/api/pets/' + pet.id, { ...json('PATCH', {}), headers: { ...headers, 'content-type': 'application/json' } })).status, 401);
  assert.equal((await request('/api/uploads', { method: 'POST', headers })).status, 401);
}
assert.equal((await request('/api/pets/' + pet.id, json('PATCH', { description: 'Denied' }, other.token))).status, 403);
assert.equal((await request('/api/pets/' + pet.id, json('PATCH', { description: 'Owner edit verified' }, owner.token))).status, 200);
const cookie = { cookie: `token=${owner.token}` };
assert.equal((await request('/pets/new', { headers: cookie })).status, 200);
assert.equal((await request(detail + '/edit', { headers: cookie })).status, 200);
const foreignEdit = await request(detail + '/edit', { headers: { cookie: `token=${other.token}` } });
assert.equal((await redirectDestination(foreignEdit)).pathname, detail);
for (const [next, expected] of [['/pets/new', '/pets/new'], ['https://evil.test', '/'], ['/login', '/'], ['/api/auth/me', '/']]) {
  const response = await request('/login?next=' + encodeURIComponent(next), { headers: cookie });
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get('location'), base).pathname, expected);
}
console.log('PASS HTTP: public catalog/detail/search/nearby; invalid/expired/forged sessions; 401/403; author edit; safe return');

// Native Chrome DevTools Protocol, no browser automation dependency.
const version = await fetch('http://127.0.0.1:9227/json/version').then(r => r.json());
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data);
  const task = pending.get(msg.id);
  if (!task) return;
  pending.delete(msg.id);
  msg.error ? task.reject(new Error(JSON.stringify(msg.error))) : task.resolve(msg.result);
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const { browserContextId } = await send('Target.createBrowserContext');
let maintenance;
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const until = async expression => {
    const end = Date.now() + 20000;
    while (Date.now() < end) {
      try { if (await evaluate(expression)) return; } catch { /* navigation changes execution context */ }
      await delay(100);
    }
    throw new Error('Browser timeout: ' + expression);
  };
  const go = async path => {
    await cdp('Page.navigate', { url: base + path });
    await until('document.readyState === "complete"');
    await delay(800);
  };
  const fill = async (selector, value) => evaluate(`(() => {const el = document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true}));})()`);
  const clickText = async text => evaluate(`(() => {const scope = document.querySelector('dialog[open]') ?? document; const el = [...scope.querySelectorAll('button,a')].find(el => el.textContent.trim() === ${JSON.stringify(text)} && el.getBoundingClientRect().width > 0); if (!el) throw Error('Missing button'); el.click();})()`);
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await go('/');
  await until(`!![...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Entrar')`);
  await until(`!!document.querySelector('a[href^="/pets/"]')`);
  await fill('input[placeholder="Buscar por nome ou raça..."]', pet.name);
  await delay(1600);
  assert.ok(await evaluate(`!!document.querySelector('a[href="${detail}"]')`));
  await clickText('Achei um pet!');
  await until('!!document.querySelector("dialog[open]")');
  await clickText('Entrar');
  assert.equal(await evaluate('location.pathname'), '/');
  await delay(800);
  await fill('input[name="email"]', credentials.email);
  await fill('input[name="password"]', 'incorrect-password');
  await evaluate('document.querySelector("form").requestSubmit()');
  await until('document.body.innerText.includes("Credenciais inválidas")');
  assert.equal(await evaluate('location.pathname'), '/');
  await fill('input[name="password"]', credentials.password);
  await evaluate('document.querySelector("form").requestSubmit()');
  await until('location.pathname === "/pets/new" && document.body.innerText.includes("Cadastrar pet")');
  await go('/');
  await evaluate(`document.querySelector('[aria-label="Menu do usuário"]').click()`);
  await clickText('Sair');
  await until('location.pathname === "/" && document.body.innerText.includes("Entrar")');
  console.log('PASS browser desktop: anonymous search; gated CTA; failed login retains next; successful login resumes form; logout');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await go(detail);
  assert.ok(await evaluate(`document.body.innerText.includes('11999999999') && !!document.querySelector('iframe[title="Localização no mapa"]')`));
  assert.ok(await evaluate(`!![...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Entrar' && a.getBoundingClientRect().width > 0)`));
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await writeFile('/tmp/hugg-public-mobile.png', Buffer.from((await cdp('Page.captureScreenshot')).data, 'base64'));
  await go('/');
  await clickText('Buscar');
  await until('document.body.innerText.includes("Buscar pet")');
  // Open the main mobile CTA after dismissing the search overlay by reloading.
  await go('/');
  await evaluate('document.querySelector("nav button.w-14").click()');
  await until('!!document.querySelector("dialog[open]")');
  await clickText('Entrar');
  await delay(800);
  await fill('input[name="email"]', credentials.email);
  await fill('input[name="password"]', credentials.password);
  await evaluate('document.querySelector("form").requestSubmit()');
  await until('location.pathname === "/pets/new" && document.body.innerText.includes("Cadastrar pet")');
  await delay(800);
  await fill('input[name="name"]', 'Unsaved smoke pet');
  await delay(200);
  await clickText('Home');
  await until('document.body.innerText.includes("Descartar alterações?")');
  await clickText('Continuar editando');
  assert.equal(await evaluate('location.pathname'), '/pets/new');
  await clickText('Home');
  await clickText('Descartar');
  await until('location.pathname === "/"');
  await delay(800);
  await evaluate(`[...document.querySelectorAll('[aria-label="Menu do usuário"]')].find(el => el.getBoundingClientRect().width > 0).click()`);
  await until('document.body.innerText.includes("Sair")');
  await clickText('Sair');
  await until('location.pathname === "/" && document.body.innerText.includes("Entrar")');
  console.log('PASS browser mobile: full public detail/contact/map; Enter; search; create CTA; login return; unsaved-changes confirmation; account menu and logout');

  maintenance = spawn('node_modules/.bin/next', ['start', '-p', '3103'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, MAINTENANCE_MODE: 'true', TURSO_DATABASE_URL: 'file:/tmp/hugg-public-smoke.db' },
    stdio: 'ignore',
  });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch('http://localhost:3103/health')).status === 200; } catch {}
    if (ready) break;
    await delay(100);
  }
  assert.ok(ready, 'maintenance server started');
  assert.equal((await fetch('http://localhost:3103/api/pets')).status, 503);
  const maintenanceHtml = await fetch('http://localhost:3103/').then(r => r.text());
  assert.ok(maintenanceHtml.includes('manutenção'));
  console.log('PASS maintenance: public pages rewritten, API 503, health 200');
} finally {
  maintenance?.kill('SIGTERM');
  await send('Target.disposeBrowserContext', { browserContextId });
  ws.close();
}
