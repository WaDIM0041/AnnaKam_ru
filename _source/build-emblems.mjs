import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function asset(file){const data=fs.readFileSync(path.join(root,'_source',file));const name=`assets/catalog-${path.basename(file,path.extname(file))}-${crypto.createHash('sha256').update(data).digest('hex').slice(0,12)}${path.extname(file)}`;fs.writeFileSync(path.join(root,name),data);return '/'+name;}
const css=asset('identity-motion.css'),js=asset('app.js'),changed=[];
// Only generated public routes; never traverse working copies, backups or Git.
const routes=['index.html','404.html','404/index.html','_not-found/index.html','catalog','how-to-buy','licenses','privacy','sites','support','terms-of-use'];
function update(relative){const file=path.join(root,relative);if(!fs.existsSync(file))return;if(fs.statSync(file).isDirectory()){for(const entry of fs.readdirSync(file))update(path.join(relative,entry));return;}if(!relative.endsWith('.html'))return;let html=fs.readFileSync(file,'utf8');if(!html.includes('identity-logo'))return;html=html.replace(/<script src="\/assets\/catalog-app-[a-f0-9]+\.js" defer><\/script>/,`<script src="${js}" defer></script>`);html=html.replace(/<link rel="stylesheet" href="\/assets\/catalog-identity-motion-[a-f0-9]+\.css">/g,'');html=html.replace('</head>',`<link rel="stylesheet" href="${css}"></head>`);fs.writeFileSync(file,html);changed.push(relative.replaceAll('\\','/'));}
routes.forEach(update);
const files=[...changed,css.slice(1),js.slice(1),'_source/app.js','_source/build.mjs','_source/identity-motion.css','_source/build-emblems.mjs'];
fs.writeFileSync(path.join(root,'_source/emblems-release.json'),JSON.stringify({files,published:false},null,2)+'\n');
console.log(JSON.stringify({pages:changed.length,css,js}));
