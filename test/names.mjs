import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport:{width:390,height:780}, isMobile:true, hasTouch:true });
const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
const url = 'file://' + process.cwd() + '/index.html?f=names';
await p.goto(url);
// Ida's phone already knows Tobias's fire (synced), but she has made none herself
await p.evaluate(() => localStorage.setItem('ember.v2', JSON.stringify({players:{tobias:{name:'Tobias', seed:'apple', plantedAt:Date.now()-864e5, lastSeen:Date.now(), note:'', visits:[], updatedAt:Date.now()}}})));
await p.reload(); await p.waitForTimeout(5000);
console.log('1) new phone shows a name picker:', await p.locator('#whoAsk.on').count() === 1);
await p.locator('canvas').tap({position:{x:195,y:468}});
await p.waitForFunction(() => document.getElementById('talkText').textContent.includes('May I sit'), null, {timeout:25000});
await p.waitForTimeout(1200);
await p.evaluate(() => { const cv = document.getElementById('c'), r = cv.getBoundingClientRect(); const fx=r.width/2, fy=r.height*.6, k=Math.max(.8,Math.min(1.4,Math.min(r.width,r.height)/640));
  for (const [ox,oy] of [[-38,92],[58,100],[150,62],[-168,64],[8,128],[-96,118]]){ const x=fx+ox*k, y=fy+oy*k; cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,pointerId:2,bubbles:true})); cv.dispatchEvent(new PointerEvent('pointerup',{clientX:x,clientY:y,pointerId:2,bubbles:true})); } });
await p.waitForSelector('#nameAsk.on', {timeout:20000}); await p.fill('#nameIn','Ida'); await p.click('#nameAsk button[type=submit]');
for (let i=0;i<60 && !(await p.locator('#seedAsk.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(150); }
await p.click('#pickLantern');
await p.waitForTimeout(1500);
await p.reload(); await p.waitForTimeout(5000);
console.log('2) reopening goes straight to Ida, no picker:', await p.locator('#whoAsk.on').count() === 0);
await p.locator('canvas').tap({position:{x:195,y:468}});
await p.waitForFunction(() => /Ida/.test(document.getElementById('talkText').textContent), null, {timeout:25000}).then(()=>console.log('   Maren greets:', 'yes')).catch(()=>console.log('   Maren greets: no'));
for (let i=0;i<40 && !(await p.locator('#foot.on').count()); i++){ await p.locator('canvas').tap({position:{x:20,y:200}}); await p.waitForTimeout(200); }
await p.click('#swapBtn'); await p.waitForTimeout(5000);
console.log('3) Switch player offers:', (await p.locator('#whoAsk').innerText()).replace(/\n/g,' | '));
console.log('errors:', errs);
await b.close();
