// Update the existing Pages checkout without replacing unrelated published files.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {integrateProjectOrbits} from './project-orbits.mjs';
const source=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(source,'..');
if(!process.argv[2])throw Error('Pass the existing gh-pages checkout path');
const target=path.resolve(process.argv[2]);
if(execFileSync('git',['branch','--show-current'],{cwd:target,encoding:'utf8'}).trim()!=='gh-pages')throw Error('Target must be the gh-pages checkout');
const release=JSON.parse(fs.readFileSync(path.join(source,'orbits-release.json'),'utf8'));
const products=JSON.parse(fs.readFileSync(path.join(source,'products.json'),'utf8'));
const personal={slug:'k-zvezdam',name:'Через время к звёздам',kind:'Сайт романа',personal:true,image:'/portfolio/k-zvezdam.webp',demo:'https://kzvezdam.annakam.ru/'};
const prefix='/AnnaKam_ru';
const projects=[...products.slice(0,3),personal,...products.slice(3)].map(p=>({...p,image:prefix+p.image}));
const assets={};
for(const file of release.files){
 if(file==='index.html')continue;
 if(!/^assets\/project-orbits-[a-f0-9]{12}\.(css|js)$/.test(file))throw Error('Unexpected orbit asset');
 const ext=path.extname(file).slice(1);assets[ext]=prefix+'/'+file;
 fs.copyFileSync(path.join(root,file),path.join(target,file));
}
const page=path.join(target,'index.html');
fs.writeFileSync(page,integrateProjectOrbits(fs.readFileSync(page,'utf8'),projects,assets));
console.log(JSON.stringify({target,projects:projects.length,assets}));
