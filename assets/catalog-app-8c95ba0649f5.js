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
  function selectRequestedSolution(){
   const params=new URLSearchParams(location.search),solution=params.get('solution'),license=params.get('license');
   if(solution&&$$('[name="solution"] option',form).some(o=>o.value===solution))$('[name="solution"]',form).value=solution;
   if(license&&['adaptation','exclusive'].includes(license))$('[name="license"]',form).value=license;
  }
  selectRequestedSolution();
  // Apply after browser form-state restoration as well as initial script startup.
  addEventListener('pageshow',selectRequestedSolution);
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
  w=document.documentElement.clientWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const count=w<700?22:44;particles=Array.from({length:count},(_,i)=>({x:((i*193+67)%997)/997*w,y:((i*317+81)%991)/991*h,r:i%4===0?2:1,v:.08+(i%5)*.02}));
 }
 function tick(now){
  if(document.hidden||reduced.matches||!ctx){frame=0;return;}
  frame=requestAnimationFrame(tick);if(now-last<1000/25)return;last=now;ctx.clearRect(0,0,w,h);
  for(const p of particles){p.y-=p.v;if(p.y<-5)p.y=h+5;ctx.beginPath();ctx.fillStyle=p.r===2?'rgba(23,203,238,.48)':'rgba(0,237,157,.42)';ctx.shadowColor=p.r===2?'#17cbee':'#00ed9d';ctx.shadowBlur=p.r===2?10:3;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}ctx.shadowBlur=0;
 }
 function restart(){if(frame)cancelAnimationFrame(frame);frame=0;if(ctx){ctx.clearRect(0,0,w,h);if(!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}}
 function visibility(){document.documentElement.toggleAttribute('data-motion-paused',document.hidden);restart();}
 if(ctx){resize();visibility();let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{resize();restart();},150);});document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',restart);}
 // Shared hover response for every main content/card type, without shifting layout.
 const hoverTargets=$$('.product-card,.license-card,.process-step,.check-list li,.about-project,.request-form,.price-panel,.faq-list details,.contact-channel,.social-card,.section-heading,.hero-copy,.catalog-tail,.contact-copy,.two-column>div,.page-intro,.prose,.product-spec>div,.product-hero>div');
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 const tiltSelector='.product-card,.license-card,.process-step,.about-project,.social-card,.price-panel';
 // Legacy showcase palette: each sibling card keeps its own orbit colour.
 const orbitPalette=['#00ff88','#00ccff','#c084fc','#ff6b9d','#fbbf24'];
 const orbitGroups=new Map();
 hoverTargets.forEach(el=>{
  el.classList.add('ak-hover-surface');
  const group=el.parentElement;
  const colorIndex=orbitGroups.get(group)||0;orbitGroups.set(group,colorIndex+1);
  const socialColor=el.matches('.social-card')?getComputedStyle(el).getPropertyValue('--social').trim():'';
  el.style.setProperty('--hover-color',socialColor||orbitPalette[colorIndex%orbitPalette.length]);
  el.dataset.hoverTilt=String(el.matches(tiltSelector));
  let pending=0,rect=null,point=null;
  const reset=()=>{if(pending)cancelAnimationFrame(pending);pending=0;rect=null;point=null;for(const name of ['--hover-x','--hover-y','--hover-rx','--hover-ry'])el.style.removeProperty(name);};
  el.addEventListener('pointerenter',()=>{rect=el.getBoundingClientRect();},{passive:true});
  el.addEventListener('pointermove',event=>{
   if(!finePointer.matches||reduced.matches||event.pointerType==='touch'||el.dataset.hoverTilt!=='true')return;
   if(event.target.closest('.ak-hover-surface')!==el)return;
   point={x:event.clientX,y:event.clientY};if(pending)return;
   pending=requestAnimationFrame(()=>{
    pending=0;if(!point)return;rect=rect||el.getBoundingClientRect();
    const x=Math.max(0,Math.min(rect.width,point.x-rect.left)),y=Math.max(0,Math.min(rect.height,point.y-rect.top));
    if(el.dataset.hoverTilt==='true'){
     el.style.setProperty('--hover-rx',`${((y/Math.max(rect.height,1))-.5)*-3}deg`);
     el.style.setProperty('--hover-ry',`${((x/Math.max(rect.width,1))-.5)*3}deg`);
    }
   });
  },{passive:true});
  el.addEventListener('pointerleave',reset,{passive:true});
  reduced.addEventListener('change',reset);
  finePointer.addEventListener('change',reset);
 });
 const gallery=$('[data-hero-gallery]');
 if(gallery&&matchMedia('(pointer:fine)').matches){
  gallery.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=gallery.getBoundingClientRect();gallery.style.setProperty('--tilt-x',`${((e.clientY-r.top)/r.height-.5)*-5}deg`);gallery.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*5}deg`);},{passive:true});
  gallery.addEventListener('pointerleave',()=>{gallery.style.removeProperty('--tilt-x');gallery.style.removeProperty('--tilt-y');});
 }
})();
