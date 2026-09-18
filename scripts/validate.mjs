import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import vm from 'node:vm';
import { renderSite } from '../src/render.mjs';
import { ORDER_URL, SITE_URL, products, combos, burgerLayers } from '../src/content.mjs';
const html=readFileSync('dist/index.html','utf8');
const script=readFileSync('dist/app.js','utf8');
const css=readFileSync('dist/style.css','utf8');
assert.equal(html,renderSite(),'Generated HTML is current');
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.equal(burgerLayers.length,9);
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(!match[1].startsWith('http')) assert(existsSync(`dist/${match[1]}`),`Missing ${match[1]}`);
}
for(const match of html.matchAll(/<a\b[^>]*data-order="[^>]*>/g)){
  assert(match[0].includes(`href="${ORDER_URL}"`));
  assert(match[0].includes('rel="noopener noreferrer"'));
}
for(const match of html.matchAll(/href="#([^"]+)"/g)) assert(html.includes(`id="${match[1]}"`));
for(const item of [...products,...combos]) assert(html.includes(item.name));
for(const layer of burgerLayers) assert(html.includes(`data-layer="${layer.id}"`));
assert(html.includes(`rel="canonical" href="${SITE_URL}"`));
assert(html.includes('og:image:width" content="1200"'));
const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(schema['@type'],'Restaurant');
assert.equal(schema.hasMenu,ORDER_URL);
assert.equal(schema.address.addressLocality,'Joinville');
assert(!schema.telephone&&!schema.aggregateRating&&!schema.address.streetAddress);
assert(css.includes('prefers-reduced-motion:reduce')||css.includes('prefers-reduced-motion: reduce'));
assert(statSync('dist/app.js').size<18000,'Interaction JS stays small');
const photoManifest=JSON.parse(readFileSync('dist/assets/image-manifest.json','utf8'));
const originals=Object.values(photoManifest).filter(v=>v.variants).reduce((sum,v)=>sum+v.sourceBytes,0);
const optimized=Object.values(photoManifest).filter(v=>v.variants).reduce((sum,v)=>sum+v.variants.at(-1).bytes,0);
assert(optimized/originals<.15);

// Exercise the production interaction function with deterministic DOM/event adapters.
// No browser automation or duplicate implementation: the actual source runs here.
const burgerSource=script.slice(script.indexOf('  function initBurger()'),script.indexOf('  function initScroll('));
function harness(reducedMotion){
  const events=[],queue=new Map();let nextId=0,time=0;
  function element(){return {listeners:{},attrs:{},style:{setProperty(k,v){this[k]=v}},value:0,clientHeight:575,clientWidth:375,
    addEventListener(k,f){this.listeners[k]=f},setAttribute(k,v){this.attrs[k]=v},
    getBoundingClientRect(){return {left:0,top:0,width:375,height:575}},
    setPointerCapture(){this.captured=true},hasPointerCapture(){return !!this.captured},releasePointerCapture(){this.captured=false}};}
  const scene=element(),stage=element(),range=element(),counter=element();
  const elements={'#burger-scene':scene,'#burger-toggle':stage,'#layer-range':range,'.experience-counter':counter};
  const context={$:s=>elements[s],clamp:(n,min=0,max=1)=>Math.max(min,Math.min(max,n)),reducedMotion,finePointer:{matches:true},
    document:{activeElement:null},track:(...args)=>events.push(args),innerWidth:375,
    requestAnimationFrame:f=>{queue.set(++nextId,f);return nextId},cancelAnimationFrame:id=>queue.delete(id),
    ResizeObserver:class{constructor(f){this.f=f}observe(){this.f()}}};
  vm.runInNewContext(`${burgerSource}; initBurger();`,context);
  function settle(){let n=0;while(queue.size&&n++<400){time+=16;const frames=[...queue.values()];queue.clear();frames.forEach(f=>f(time));}assert(n<400,'Spring settles');}
  function fire(type,data={}){stage.listeners[type]({isPrimary:true,button:0,pointerId:1,pointerType:'touch',clientY:350,detail:1,preventDefault(){},...data});settle();}
  const progress=()=>Number(scene.style['--open']);
  fire('click');assert.equal(progress(),1);fire('click');assert.equal(progress(),0);
  for(const pointerType of ['touch','mouse']){
    fire('pointerdown',{pointerType,clientY:450});fire('pointermove',{pointerType,clientY:180});fire('pointerup',{pointerType,clientY:180});
    fire('click');assert.equal(progress(),1,`${pointerType} upward drag pins open and consumes click`);
    fire('pointerdown',{pointerType,clientY:180});fire('pointermove',{pointerType,clientY:470});fire('pointerup',{pointerType,clientY:470});
    fire('click');assert.equal(progress(),0,`${pointerType} downward drag closes`);
  }
  fire('keydown',{key:'End'});assert.equal(progress(),1);fire('keydown',{key:'Home'});assert.equal(progress(),0);
  fire('keydown',{key:'ArrowUp'});assert.equal(progress(),.1);
  range.value=65;range.listeners.input();settle();assert.equal(progress(),.65);
  range.listeners.change();assert(events.some(([event,data])=>event==='interaction_burger_exploded'&&data.method==='range'));
  fire('pointerdown');fire('pointermove',{clientY:50});fire('pointercancel');assert.equal(progress(),.65,'Cancelled gesture restores value');
  assert.equal(range.attrs['aria-valuetext'],'65% aberto');
  assert.equal(stage.attrs['aria-expanded'],'true');
  if(reducedMotion)assert.equal(queue.size,0);
}
harness(false);harness(true);
console.log(`PASS: static content, links, assets, SEO, image budget; mouse/touch drag, click, keyboard, range, cancel, analytics and reduced motion. Photos ${originals} -> ${optimized} bytes.`);
