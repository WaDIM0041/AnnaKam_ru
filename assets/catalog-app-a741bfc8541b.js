(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 document.documentElement.dataset.enhanced='true';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Navigation remains available in HTML when JavaScript is disabled.
 const toggle=$('[data-menu-toggle]'),nav=$('[data-nav]'),mobile=matchMedia('(max-width:700px)');
 let menuOpen=false;
 function setMenu(open,returnFocus=false){
  menuOpen=open&&mobile.matches;
  if(nav)nav.hidden=mobile.matches&&!menuOpen;
  if(toggle){toggle.setAttribute('aria-expanded',String(menuOpen));toggle.setAttribute('aria-label',menuOpen?'Закрыть меню':'Открыть меню');}
  document.body.style.overflow=menuOpen?'hidden':'';
  if(menuOpen)$('a',nav)?.focus();else if(returnFocus)toggle?.focus();
 }
 toggle?.addEventListener('click',()=>setMenu(!menuOpen,!menuOpen===false));
 mobile.addEventListener('change',()=>setMenu(false));setMenu(false);
 $$('a',nav||document.createElement('div')).forEach(a=>a.addEventListener('click',()=>{if(menuOpen)setMenu(false,true);}));
 document.addEventListener('keydown',e=>{
  if(!menuOpen)return;
  if(e.key==='Escape'){e.preventDefault();setMenu(false,true);}
  if(e.key==='Tab'){
   const items=[toggle,...$$('a,button',nav)].filter(Boolean),first=items[0],last=items.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 // Filter the existing static cards: their links and content never depend on JS.
 const cards=$$('[data-product-card]'),filters=$$('[data-filter]'),search=$('[data-search]'),empty=$('[data-empty]'),counter=$('[data-result-count]');
 let category='all';
 function filter(){
  const query=(search?.value||'').trim().toLocaleLowerCase('ru');let count=0;
  cards.forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&card.textContent.toLocaleLowerCase('ru').includes(query);card.hidden=!visible;if(visible)count++;});
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
  if(empty)empty.hidden=count!==0;
  if(counter)counter.textContent=`Показано решений: ${count}`;
 }
 filters.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;filter();}));
 search?.addEventListener('input',filter);
 $('[data-reset-filters]')?.addEventListener('click',()=>{category='all';if(search)search.value='';filter();search?.focus();});
 // Browser-local draft: no request is sent, no success message claims otherwise.
 const form=$('[data-request-form]');
 if(form){
  const params=new URLSearchParams(location.search),solution=params.get('solution'),license=params.get('license');
  if(solution&&$$('[name="solution"] option',form).some(o=>o.value===solution))$('[name="solution"]',form).value=solution;
  if(license&&['adaptation','exclusive'].includes(license))$('[name="license"]',form).value=license;
  form.addEventListener('submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form);
   const text=`Здравствуйте! Хочу обсудить сайт через ANNA KAM.\n\nРешение: ${data.get('solution')}.\nФормат: ${data.get('license')==='exclusive'?'обсудить эксклюзив':'адаптация готового решения'}.\nБизнес: ${String(data.get('business')||'').trim()||'уточню в диалоге'}.\nЧто нужно: ${String(data.get('needs')||'').trim()||'помощь с выбором состава'}.\n\nПодскажите стоимость, состав работ и условия запуска.`;
   const panel=$('[data-message-panel]'),message=$('[data-message]');panel.hidden=false;message.value=text;
   $('[data-request-status]').textContent='Сообщение подготовлено, но ещё не отправлено. Скопируйте его и отправьте в выбранный диалог.';
   message.focus();if(!reduced.matches)panel.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('[data-copy-message]')?.addEventListener('click',async()=>{
   const message=$('[data-message]'),feedback=$('[data-copy-feedback]');
   try{await navigator.clipboard.writeText(message.value);feedback.textContent='Текст скопирован. Теперь его можно отправить в диалоге.';}
   catch{message.focus();message.select();feedback.textContent='Выделили текст. Скопируйте его вручную и отправьте в диалоге.';}
  });
 }
 // Necessary preferences only. No analytics SDK or optional tracking is loaded.
 const banner=$('[data-cookie-banner]'),dialog=$('[data-cookie-dialog]');let previousFocus;
 let accepted=false;try{accepted=JSON.parse(localStorage.getItem('anna-catalog-consent')||'null')?.necessary===true;}catch{}
 if(banner)banner.hidden=accepted;
 function saveChoice(){try{localStorage.setItem('anna-catalog-consent',JSON.stringify({necessary:true,analytics:false,marketing:false,version:1}));}catch{}if(banner)banner.hidden=true;if(dialog?.open)dialog.close();}
 $$('[data-save-cookies]').forEach(b=>b.addEventListener('click',saveChoice));
 $$('[data-open-cookies]').forEach(b=>b.addEventListener('click',()=>{previousFocus=document.activeElement;if(dialog?.showModal)dialog.showModal();else if(banner)banner.hidden=false;}));
 $('[data-close-cookies]')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>previousFocus?.focus());
 // A bounded, paused background rather than a continuously busy page.
 const canvas=$('[data-particles]'),ctx=canvas?.getContext('2d');let frame=0,last=0,w=0,h=0,particles=[];
 function resize(){
  if(!canvas||!ctx)return;
  w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=w<700?16:30;particles=Array.from({length:count},(_,i)=>({x:((i*193+67)%997)/997*w,y:((i*317+81)%991)/991*h,r:i%4===0?2:1,v:.05+(i%5)*.015}));
 }
 function tick(now){
  if(document.hidden||reduced.matches||!ctx){frame=0;return;}
  frame=requestAnimationFrame(tick);if(now-last<1000/25)return;last=now;ctx.clearRect(0,0,w,h);
  for(const p of particles){p.y-=p.v;if(p.y<-5)p.y=h+5;ctx.beginPath();ctx.fillStyle=p.r===2?'rgba(23,203,238,.34)':'rgba(0,237,157,.32)';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
 }
 function restart(){if(frame)cancelAnimationFrame(frame);frame=0;if(ctx){ctx.clearRect(0,0,w,h);if(!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}}
 if(ctx){resize();restart();let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{resize();restart();},150);});document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);}
 const gallery=$('[data-hero-gallery]');
 if(gallery&&matchMedia('(pointer:fine)').matches){
  gallery.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=gallery.getBoundingClientRect();gallery.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-5}deg`);gallery.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*5}deg`);},{passive:true});
  gallery.addEventListener('pointerleave',()=>{gallery.style.removeProperty('--tilt-x');gallery.style.removeProperty('--tilt-y');});
 }
})();
