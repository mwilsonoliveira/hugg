// Uses disposable local data and an isolated Chrome context; never calls Google.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { sealFlow } = require('../src/server/auth-flow.ts');
const { prisma } = await import('@hugg/database');
const base = process.env.SMOKE_BASE_URL ?? 'http://localhost:3102';
assert.equal(process.env.SMOKE_ISOLATED_DATABASE, 'true');
assert.equal(process.env.TURSO_DATABASE_URL, 'file:/tmp/hugg-auth-modal.db');
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert.ok(process.env.JWT_SECRET);
const credentials = { name: 'Modal Smoke', email: `modal-${Date.now()}@hugg.test`, password: 'hugg-modal-test-123' };
const version = await fetch('http://127.0.0.1:9227/json/version').then(r => r.json());
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const result = JSON.parse(data);
  const task = pending.get(result.id);
  if (!task) return;
  pending.delete(result.id);
  result.error ? task.reject(new Error(JSON.stringify(result.error))) : task.resolve(result.result);
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++sequence; pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, sessionId }));
});
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const { browserContextId } = await send('Target.createBrowserContext');
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable');
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + expression);
    return result.result.value;
  };
  const until = async expression => {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      try { if (await evaluate(expression)) return; } catch { /* navigation */ }
      await pause(100);
    }
    throw new Error('Timeout: ' + expression);
  };
  const go = async path => { await cdp('Page.navigate', { url: base + path }); await until('document.readyState === "complete"'); await pause(900); };
  const click = text => evaluate(`(() => { const scope = document.querySelector('dialog[open]') ?? document; const el = [...scope.querySelectorAll('button,a')].find(el => el.textContent.trim() === ${JSON.stringify(text)} && el.getBoundingClientRect().width > 0); if(!el) throw Error('Missing control'); el.click(); })()`);
  const fill = (name, value) => evaluate(`(() => { const el = document.querySelector('input[name=${name}]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input', {bubbles: true})); el.dispatchEvent(new Event('change', {bubbles: true})); })()`);
  const submit = () => evaluate('document.querySelector("form").requestSubmit()');
  const escape = async () => { await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); };
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await go('/');
  await evaluate(`document.querySelector('a[href="/pets/new"]').focus()`);
  await click('Achei um pet!');
  await until('!!document.querySelector("dialog[open]")');
  assert.equal(await evaluate('location.pathname'), '/');
  assert.ok(await evaluate(`document.querySelector('dialog').innerText.includes('Entre no Hugg para cadastrar um animal')`));
  assert.ok(await evaluate(`document.querySelector('dialog').contains(document.activeElement)`));
  for (let i = 0; i < 8; i++) {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    assert.ok(await evaluate(`document.querySelector('dialog').contains(document.activeElement)`));
  }
  await writeFile('/tmp/hugg-auth-desktop.png', Buffer.from((await cdp('Page.captureScreenshot')).data, 'base64'));
  await escape();
  await until('!document.querySelector("dialog[open]")');
  assert.equal(await evaluate('document.activeElement.getAttribute("href")'), '/pets/new');
  assert.equal(await evaluate('document.body.style.overflow'), '');
  await click('Achei um pet!'); await click('Continuar com e-mail');
  await fill('name', credentials.name); await fill('email', credentials.email); await fill('password', credentials.password);
  await submit(); await until('location.pathname === "/pets/new" && document.body.innerText.includes("Cadastrar pet")');
  await go('/');
  await evaluate(`document.querySelector('[aria-label="Menu do usuário"]').click()`); await click('Sair');
  await until('document.body.innerText.includes("Entrar")');
  await click('Achei um pet!'); await click('Continuar com e-mail');
  await fill('name', credentials.name); await fill('email', credentials.email); await fill('password', credentials.password);
  await submit(); await until('document.body.innerText.includes("E-mail já cadastrado")');
  await click('Entrar'); await fill('password', 'wrong-password'); await submit();
  await until('document.body.innerText.includes("Credenciais inválidas")');
  await fill('password', credentials.password); await submit();
  await until('location.pathname === "/pets/new"');
  console.log('PASS desktop: dialog, keyboard/focus/Escape, registration, duplicate email, login recovery and return');
  await cdp('Network.clearBrowserCookies');
  await go('/login?next=%2Fpets%2Fnew');
  await fill('email', credentials.email); await fill('password', credentials.password); await submit();
  await until('location.pathname === "/pets/new"');
  await cdp('Network.clearBrowserCookies');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await go('/');
  await evaluate(`document.querySelector('[aria-label="Cadastrar um animal"]').click()`);
  await until('!!document.querySelector("dialog[open]")');
  assert.ok(await evaluate(`(() => {const r=document.querySelector('dialog').getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.height<=innerHeight;})()`));
  await writeFile('/tmp/hugg-auth-mobile.png', Buffer.from((await cdp('Page.captureScreenshot')).data, 'base64'));
  await click('Entrar'); await fill('email', credentials.email); await fill('password', credentials.password); await submit();
  await until('location.pathname === "/pets/new"');
  console.log('PASS mobile: layout and modal login; standalone login return');
  await cdp('Network.clearBrowserCookies');
  await go('/?auth=google-cancelled&next=%2Fpets%2Fnew&intent=create');
  await until('!!document.querySelector("dialog[open]") && document.body.innerText.includes("foi cancelado")');
  await escape();
  // Browser-level confirmation uses a genuine encrypted context, prepared only in this test script.
  const user = await prisma.user.findUniqueOrThrow({ where: { email: credentials.email } });
  const id = `modal-link-${Date.now()}`;
  await prisma.authAttempt.create({ data: { id, expiresAt: new Date(Date.now() + 600000) } });
  const flow = { phase: 'link', id, userId: user.id, subject: id, email: user.email, next: '/pets/new', source: '/', intent: 'create' };
  const sealed = sealFlow(flow, process.env.JWT_SECRET);
  await cdp('Network.setCookie', { name: 'hugg_auth_flow', value: sealed, url: base, httpOnly: true, sameSite: 'Lax' });
  await go('/?auth=google-link&next=%2Fpets%2Fnew&intent=create');
  await until('document.body.innerText.includes("Confirme sua conta")');
  await fill('password', 'wrong-password'); await submit(); await until('document.body.innerText.includes("Senha incorreta")');
  await fill('password', credentials.password); await submit(); await until('location.pathname === "/pets/new"');
  assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).googleSubject, id);
  await cdp('Network.clearBrowserCookies');
  await cdp('Network.setCookie', { name: 'hugg_auth_flow', value: sealed, url: base, httpOnly: true, sameSite: 'Lax' });
  await go('/?auth=google-link&next=%2Fpets%2Fnew&intent=create');
  await fill('password', credentials.password); await submit(); await until('document.body.innerText.includes("expirou")');
  assert.equal(await evaluate('location.pathname'), '/');
  console.log('PASS Google UI: cancellation, password proof and consumed-context rejection (provider simulated)');
} finally {
  await send('Target.disposeBrowserContext', { browserContextId });
  ws.close();
  await prisma.$disconnect();
}
