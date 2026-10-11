import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:390,height:780}, isMobile:true, hasTouch:true });
const errs=[]; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.cwd() + '/index.html?f=wowtest');
await p.waitForTimeout(1500);
await p.screenshot({path:'test/wow-0.png'});
// hold the ember for a moment, then let go
await p.evaluate(() => { const cv = document.getElementById('c'); cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:195,clientY:468,pointerId:1,bubbles:true})); });
await p.waitForTimeout(700); await p.screenshot({path:'test/wow-1-charge.png'});
await p.evaluate(() => { const cv = document.getElementById('c'); cv.dispatchEvent(new PointerEvent('pointerup',{clientX:195,clientY:468,pointerId:1,bubbles:true})); });
await p.waitForTimeout(250); await p.screenshot({path:'test/wow-2-boom.png'});
await p.waitForTimeout(1400); await p.screenshot({path:'test/wow-3-title.png'});
await p.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, {timeout:25000});
await p.waitForTimeout(1500);
// a child's single tap on the nearest stick spot (no drag)
const fed = await p.evaluate(async () => { const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const fx=r.width/2, fy=r.height*.6, k=Math.max(.8,Math.min(1.4,Math.min(r.width,r.height)/640));
  for (const [ox,oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]){ const x=fx+ox*k, y=fy+oy*k;
    cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,pointerId:2,bubbles:true})); cv.dispatchEvent(new PointerEvent('pointerup',{clientX:x,clientY:y,pointerId:2,bubbles:true})); }
  return true; });
await p.waitForTimeout(400); await p.screenshot({path:'test/wow-4-throw.png'});
const ok = await p.waitForSelector('#nameAsk.on', {timeout:20000}).then(()=>true).catch(()=>false);
console.log('tap-to-throw fed the fire and story continued:', ok);
console.log('errors:', errs);
await b.close();
