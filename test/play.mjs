import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
async function phone(name){ const ctx = await browser.newContext({ viewport:{width:390,height:780}, isMobile:true, hasTouch:true }); const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(name+': '+e.message)); await p.goto('http://127.0.0.1:8080/index.html?f=playfam&ps=127.0.0.1:9000'); return p; }
async function start(page, name){
  await page.waitForTimeout(800);
  if (await page.locator('#whoAsk.on').count()) await page.locator('#whoAsk button', { hasText: 'Someone new' }).click();
  await page.locator('canvas').tap({ position:{x:195,y:468} });
  await page.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, {timeout:20000});
  await page.waitForTimeout(1200);
  await page.evaluate(() => { const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const ev = (t,x,y) => cv.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:y,pointerId:1,bubbles:true}));
    const fx=r.width/2, fy=r.height*.6, k=Math.max(.8,Math.min(1.4,Math.min(r.width,r.height)/640));
    for (const [ox,oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]){ ev('pointerdown',fx+ox*k,fy+oy*k); ev('pointermove',fx,fy-8*k); ev('pointerup',fx,fy-8*k); } });
  await page.waitForSelector('#nameAsk.on', {timeout:20000}); await page.fill('#nameIn', name); await page.click('#nameAsk button[type=submit]');
  // tap through dialogue quickly
  for (let i=0;i<40 && !(await page.locator('#seedAsk.on').count()); i++){ await page.locator('canvas').tap({position:{x:20,y:200}}); await page.waitForTimeout(150); }
  await page.click('#pickLantern');
  for (let i=0;i<40 && !(await page.locator('#foot.on').count()); i++){ await page.locator('canvas').tap({position:{x:20,y:200}}); await page.waitForTimeout(150); }
}
const a = await phone('A'); const t0 = Date.now(); await start(a, 'Tobias'); console.log('first minute with taps took', ((Date.now()-t0)/1000).toFixed(1)+'s');
// play: wait for fireflies, catch them by tapping where the page draws glows (sample canvas pixels)
let caught = 0;
for (let round=0; round<60 && caught < 27; round++){
  await a.waitForTimeout(500);
  const spots = await a.evaluate(() => { const cv = document.getElementById('c'), x = cv.getContext('2d'), d = Math.min(2, devicePixelRatio||1);
    const img = x.getImageData(0,0,cv.width,cv.height).data, out=[];
    for (let y=0;y<cv.height;y+=6) for (let xx=0;xx<cv.width;xx+=6){ const i=(y*cv.width+xx)*4; if (img[i+1]>230 && img[i+2]>150 && img[i]>220 && img[i+1]>=img[i]-10) out.push([xx/d,y/d]); }
    return out.slice(0,3); });
  for (const [x,y] of spots){ await a.locator('canvas').tap({position:{x:Math.round(x),y:Math.round(y)}}).catch(()=>{}); }
  const n = await a.locator('#hud').textContent(); caught = parseInt(n)||0;
}
console.log('HUD:', await a.locator('#hud').textContent());
console.log('talk:', await a.locator('#talkText').textContent());
await a.waitForTimeout(3000);
await a.screenshot({path:'test/play-a.png'});
const b = await phone('B'); await b.waitForTimeout(3000);
console.log('B sees Tobias fireflies:', await b.evaluate(() => (JSON.parse(localStorage.getItem('ember.v2')).players.tobias||{}).fireflies));
console.log('errors:', errs);
await browser.close();
