import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:390,height:780}, isMobile:true, hasTouch:true });
const errs=[]; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.cwd() + '/index.html?f=cleartest');
await p.waitForTimeout(2200); await p.screenshot({path:'test/clear-1.png'});
await p.locator('canvas').tap({position:{x:195,y:468}});
await p.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, {timeout:25000});
await p.waitForTimeout(1500); await p.screenshot({path:'test/clear-2.png'});
console.log('goal during sticks:', await p.locator('#goalText').textContent());
// tap the marked stick like a child would: read the target from the page
await p.evaluate(() => { const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const fx=r.width/2, fy=r.height*.6, k=Math.max(.8,Math.min(1.4,Math.min(r.width,r.height)/640));
  for (const [ox,oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]){ const x=fx+ox*k, y=fy+oy*k; cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,pointerId:2,bubbles:true})); cv.dispatchEvent(new PointerEvent('pointerup',{clientX:x,clientY:y,pointerId:2,bubbles:true})); } });
await p.waitForSelector('#nameAsk.on', {timeout:20000}); await p.fill('#nameIn','Ida'); await p.click('#nameAsk button[type=submit]');
for (let i=0;i<60 && !(await p.locator('#seedAsk.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(150); }
await p.click('#pickApple');
for (let i=0;i<60 && !(await p.locator('#foot.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(150); }
await p.waitForTimeout(3500); await p.screenshot({path:'test/clear-3.png'});
console.log('goal in free play:', await p.locator('#goalText').textContent());
console.log('footer:', (await p.locator('#tools').innerText()).replace(/\n/g,' | '));
console.log('errors:', errs);
await b.close();
