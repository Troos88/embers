import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',  args: ['--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
const errs = [];
async function phone(name) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push(name + ': ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(name + ' console: ' + m.text()); });
  await page.goto('http://127.0.0.1:8080/index.html?f=testfam&ps=127.0.0.1:9000&local=1');
  return page;
}
async function lightAndStart(page, name) {
  await page.waitForTimeout(800);
  if (await page.locator('#whoAsk.on').count()) { console.log(name, 'picker:', await page.locator('#whoAsk').innerText()); await page.locator('#whoAsk button', { hasText: 'Someone new' }).click(); }
  await page.locator('canvas').tap({ position: { x: 195, y: 468 } });
  await page.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, { timeout: 20000 });
  await page.waitForTimeout(1800);
  // drag the closest stick into the fire by dispatching pointer events
  await page.evaluate(() => {
    const cv = document.getElementById('c'), r = cv.getBoundingClientRect();
    const ev = (t, x, y) => cv.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: y, pointerId: 1, bubbles: true }));
    const fx = r.width / 2, fy = r.height * .6, k = Math.max(.8, Math.min(1.4, Math.min(r.width, r.height) / 640));
    for (const [ox, oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]) { ev('pointerdown', fx + ox * k, fy + oy * k); ev('pointermove', fx, fy - 8 * k); ev('pointerup', fx, fy - 8 * k); }
  });
  await page.waitForSelector('#nameAsk.on', { timeout: 20000 });
  await page.fill('#nameIn', name); await page.click('#nameAsk button[type=submit]');
  await page.waitForSelector('#seedAsk.on', { timeout: 30000 });
  await page.click('#pickApple');
  await page.waitForSelector('#foot.on', { timeout: 20000 });
}
const a = await phone('A');
await lightAndStart(a, 'Tobias');
console.log('A done:', await a.locator('#footLine').textContent());
const b = await phone('B');
await b.waitForTimeout(2500);
console.log('B players before play:', await b.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('ember.v2') || '{"players":{}}').players)));
await lightAndStart(b, 'Elina');
console.log('B done:', await b.locator('#footLine').textContent());
await a.waitForTimeout(2000);
console.log('A sees:', await a.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('ember.v2')).players)));
console.log('A hint:', await a.locator('#ridgeHint').textContent());
// B walks over to Tobias's fire and warms it
const warmed = await b.evaluate(async () => {
  // fires are module-private; tap where Tobias's fire is drawn by hashing like the page does
  const r = document.getElementById('c').getBoundingClientRect();
  const hashf = (s, salt) => { let h = 2166136261 ^ salt; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };
  const k = Math.max(.8, Math.min(1.4, Math.min(r.width, r.height) / 640));
  const x = r.width * (.06 + .88 * hashf('tobias', 7)), y = r.height * .47 - (6 + 30 * (.3 + .7 * hashf('tobias', 13))) * k;
  document.getElementById('c').dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y, pointerId: 2, bubbles: true }));
  document.getElementById('c').dispatchEvent(new PointerEvent('pointerup', { clientX: x, clientY: y, pointerId: 2, bubbles: true }));
  return [x, y];
});
console.log('B tapped', warmed.map(Math.round));
await b.waitForSelector('#visitAsk.on', { timeout: 30000 });
console.log('B talk:', await b.locator('#talkText').textContent());
await b.click('#visitWarm');
await a.waitForFunction(() => document.getElementById('talkText').textContent.includes('sat down'), null, { timeout: 15000 });
console.log('A live moment:', await a.locator('#talkText').textContent());
await a.screenshot({ path: 'test/a.png' }); await b.screenshot({ path: 'test/b.png' });
console.log('errors:', errs);
await browser.close();
