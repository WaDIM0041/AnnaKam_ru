// Focused update: preserve the current hero, project gallery, chatbot and other pages.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {servicesSection,updateContact} from './services.mjs';
import {requestExtras} from './offer.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function asset(file){const data=fs.readFileSync(path.join(root,'_source',file));const name=`assets/catalog-${path.basename(file,path.extname(file))}-${crypto.createHash('sha256').update(data).digest('hex').slice(0,12)}${path.extname(file)}`;fs.writeFileSync(path.join(root,name),data);return '/'+name;}
const css=asset('services.css'),js=asset('app.js');
const page=path.join(root,'index.html');let html=fs.readFileSync(page,'utf8');
html=html.replace(/<section class="section services-section"[\s\S]*?<\/section>/,'');
if(!html.includes('id="growth"'))throw Error('Missing services insertion point');
html=html.replace(/<section class="section feature-band" id="growth"/,servicesSection()+'<section class="section feature-band" id="growth"');
html=html.replace(/<div class="field"><label for="request-collaboration">[\s\S]*?<\/fieldset>/,requestExtras);
html=updateContact(html);
html=html.replace(/<script src="\/assets\/catalog-app-[a-f0-9]+\.js" defer><\/script>/,`<script src="${js}" defer></script>`);
html=html.replace(/<link rel="stylesheet" href="\/assets\/catalog-services-[a-f0-9]+\.css">/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="${css}"></head>`);
if(!html.includes('href="/#services">Услуги</a>'))html=html.replace('<nav class="main-nav" id="main-navigation" data-nav aria-label="Основная навигация">','$&<a href="/#services">Услуги</a>');
fs.writeFileSync(page,html);
const release={files:['index.html',css.slice(1),js.slice(1),'_source/services.mjs','_source/services.css','_source/offer.mjs','_source/app.js','_source/build.mjs','_source/build-services.mjs'],published:false};
fs.writeFileSync(path.join(root,'_source/services-release.json'),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify(release));
