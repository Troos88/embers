import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:390,height:780}, isMobile:true, hasTouch:true });
const errs=[]; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + process.cwd() + '/index.html?f=remarks');
await p.waitForTimeout(600);
await p.locator('canvas').tap({position:{x:195,y:468}});
console.log('audio after tap:', await p.evaluate(() => new Promise(r => setTimeout(() => r(document.getElementById('snd').classList.contains('on')), 300))));
await p.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, {timeout:20000});
await p.waitForTimeout(1500);
await p.evaluate(() => { const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const ev = (t,x,y) => cv.dispatchEvent(new PointerEvent(t,{clientX:x,clientY:y,pointerId:1,bubbles:true}));
  const fx=r.width/2, fy=r.height*.6, k=Math.max(.8,Math.min(1.4,Math.min(r.width,r.height)/640));
  for (const [ox,oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]){ ev('pointerdown',fx+ox*k,fy+oy*k); ev('pointermove',fx,fy-8*k); ev('pointerup',fx,fy-8*k); } });
await p.waitForSelector('#nameAsk.on', {timeout:20000}); await p.fill('#nameIn','Tobias'); await p.click('#nameAsk button[type=submit]');
for (let i=0;i<60 && !(await p.locator('#seedAsk.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(150); }
await p.click('#pickApple');
for (let i=0;i<60 && !(await p.locator('#foot.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(150); }
// wait for the first eyes remark, then check the buttons are still there and tappable
await p.waitForSelector('#aside.on', {timeout:30000});
console.log('remark:', await p.locator('#asideText').textContent());
console.log('buttons still visible:', await p.locator('#foot.on').count() === 1);
await p.click('#noteBtn'); await p.waitForSelector('#textAsk.on', {timeout:8000}); console.log('note button works while Maren talks: yes');
await p.screenshot({path:'test/remarks.png'});
console.log('errors:', errs);
await b.close();
