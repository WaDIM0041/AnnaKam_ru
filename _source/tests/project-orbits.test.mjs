import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {projectOrbits,integrateProjectOrbits} from '../project-orbits.mjs';
const products=JSON.parse(fs.readFileSync(new URL('../products.json',import.meta.url),'utf8'));
const personal={slug:'k-zvezdam',name:'Через время к звёздам',kind:'Сайт романа',personal:true,image:'/portfolio/k-zvezdam.webp',demo:'https://kzvezdam.annakam.ru/'};
const records=[...products,personal];
const assets={css:'/assets/orbits.css',js:'/assets/orbits.js'};
test('every catalog record retains its real preview and destination',()=>{
 const html=projectOrbits(records);
 assert.equal((html.match(/data-project-slug=/g)||[]).length,12);
 for(const p of records){
  assert(html.includes(`data-project-slug="${p.slug}"`));
  assert(html.includes(`href="${p.demo}"`));
  assert(html.includes(`src="${p.image}"`));
  assert(fs.existsSync(new URL('../../'+p.image.slice(1),import.meta.url)));
 }
 assert(html.includes('Авторский проект'));
});
test('focused rebuild is idempotent and preserves unrelated content',()=>{
 const original='<html><head><script src="/bot/widget.js?v=keep-me"></script></head><body><div class="wrap"><section class="hero offer-hero"><div class="hero-gallery" data-hero-gallery><div></div><p class="hero-caption">Previous</p></div></section></div><section class="section" id="catalog">Catalog</section><section class="section feature-band">Band</section><footer>Keep footer</footer></body></html>';
 const first=integrateProjectOrbits(original,records,assets);
 assert.equal(integrateProjectOrbits(first,records,assets),first);
 assert(first.includes('/bot/widget.js?v=keep-me'));assert(first.includes('<footer>Keep footer</footer>'));
 assert.equal((first.match(/data-project-orbits-script/g)||[]).length,1);
 assert(!first.includes('data-hero-gallery'));
 assert(first.indexOf('<section class="section" id="catalog">')<first.indexOf('<section class="project-orbits"'));
 assert(first.indexOf('<section class="project-orbits"')<first.indexOf('<section class="section feature-band">'));
 assert(first.includes('class="hero offer-hero offer-hero-with-orbits"'));
});
test('missing insertion point and duplicate projects fail explicitly',()=>{
 assert.throws(()=>integrateProjectOrbits('<html></html>',records,assets),/insertion point/);
 assert.throws(()=>projectOrbits([...records,records[0]]),/Invalid orbit collection/);
});
test('titles and URLs cannot inject markup',()=>{
 const html=projectOrbits([{...personal,name:'"><script>bad()</script>',demo:'https://example.com/?a=1&b=2'}]);
 assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(html.includes('?a=1&amp;b=2'));
});
