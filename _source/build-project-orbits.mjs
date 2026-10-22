// A focused build preserves unrelated hand-published page and chatbot updates.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {integrateProjectOrbits} from './project-orbits.mjs';
const source=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(source,'..');
const products=JSON.parse(fs.readFileSync(path.join(source,'products.json'),'utf8'));
const personal={slug:'k-zvezdam',name:'Через время к звёздам',kind:'Сайт романа',image:'/portfolio/k-zvezdam.webp',demo:'https://k-zvezdam.ru',personal:true};
const projects=[...products.slice(0,3),personal,...products.slice(3)];
const assets={};
for(const ext of ['css','js']){
  const data=fs.readFileSync(path.join(source,`project-orbits.${ext}`));
  const name=`project-orbits-${crypto.createHash('sha256').update(data).digest('hex').slice(0,12)}.${ext}`;
  fs.writeFileSync(path.join(root,'assets',name),data);assets[ext]='/assets/'+name;
}
for(const p of projects){
  if(!fs.existsSync(path.join(root,p.image.slice(1))))throw Error('Missing catalog preview: '+p.image);
  if(!['https:','http:'].includes(new URL(p.demo).protocol))throw Error('Invalid demo');
}
const page=path.join(root,'index.html');
fs.writeFileSync(page,integrateProjectOrbits(fs.readFileSync(page,'utf8'),projects,assets));
fs.writeFileSync(path.join(source,'orbits-release.json'),JSON.stringify({files:[...Object.values(assets).map(p=>p.slice(1)),'index.html'],projects:projects.map(p=>p.slug)},null,2)+'\n');
console.log(JSON.stringify({projects:projects.length,assets}));
