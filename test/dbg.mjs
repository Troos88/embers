import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
page.on('pageerror', e => console.log('ERR', e.message)); page.on('console', m => console.log('LOG', m.type(), m.text()));
await page.goto('http://127.0.0.1:8080/index.html?f=testfam&ps=127.0.0.1:9000');
await page.waitForTimeout(800);
await page.locator('canvas').tap({ position: { x: 195, y: 468 } });
await page.waitForTimeout(6000);
console.log('talk:', await page.locator('#talkText').textContent());
await page.waitForTimeout(4000);
console.log('talk:', await page.locator('#talkText').textContent());
const r = await page.evaluate(() => {
  const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const out = [];
  const ev = (t, x, y) => { try { cv.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: y, pointerId: 1, bubbles: true, isPrimary: true })); out.push(t+' ok'); } catch (e) { out.push(t + ' ' + e.message); } };
  const fx = r.width / 2, fy = r.height * .6, k = Math.max(.8, Math.min(1.4, Math.min(r.width, r.height) / 640));
  for (const [ox, oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]) { ev('pointerdown', fx + ox * k, fy + oy * k); ev('pointermove', fx, fy - 8 * k); ev('pointerup', fx, fy - 8 * k); }
  return out.slice(0,4);
});
console.log(r);
await page.waitForTimeout(4000);
console.log('talk:', await page.locator('#talkText').textContent(), 'nameAsk', await page.locator('#nameAsk').getAttribute('class'));
await page.screenshot({ path: 'test/dbg.png' });
await browser.close();
