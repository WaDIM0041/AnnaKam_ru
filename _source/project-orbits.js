(() => {
  'use strict';
  const root = document.querySelector('[data-project-orbits]');
  if (!root) return;
  const stage = root.querySelector('[data-orbits-stage]');
  const items = [...root.querySelectorAll('[data-orbit-item]')];
  const links = items.map(item => item.querySelector('a'));
  const paths = [...root.querySelectorAll('[data-orbit-path]')];
  const pause = root.querySelector('[data-orbits-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, visible = false, focused = false;
  let yaw = .24, pitch = -.17, time = 0, velocity = 0, drag = null, suppressClick = false;
  let width = 0, height = 0, radius = 0, verticalRadius = 0, cardWidth = 0, raf = 0, last = 0;
  // Separate tilted orbital planes. Cards remain facing the visitor for legibility.
  function point(ring, angle) {
    const tilt = [-.66, .62, 1.54][ring];
    const x = Math.cos(angle), y = Math.sin(angle) * .49, z = Math.sin(angle) * .66;
    return [x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt), z];
  }
  function project([x, y, z]) {
    const xx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const zz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const yy = y * Math.cos(pitch) - zz * Math.sin(pitch);
    return [xx, yy, y * Math.sin(pitch) + zz * Math.cos(pitch)];
  }
  function request() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }
  function measure() {
    width = stage.clientWidth; height = stage.clientHeight;
    cardWidth = items[0].getBoundingClientRect().width || 150;
    // Allow for the front card's scale and the shadow; keep previews inside the stage.
    const baseWidth = parseFloat(getComputedStyle(items[0]).width);
    cardWidth = baseWidth || cardWidth;
    radius = Math.max(35, (width - cardWidth * 1.42 - 24) / 2);
    verticalRadius = Math.max(35, Math.min(radius, (height - cardWidth * 1.2 - 60) / 1.8));
    request();
  }
  function draw() {
    items.forEach((item, i) => {
      const ring = i % 3, index = Math.floor(i / 3), count = Math.ceil((items.length - ring) / 3);
      const angle = index * Math.PI * 2 / count + ring * .78 + time * [.055, -.045, .035][ring];
      let pos = point(ring, angle);
      pos[1] += Math.sin(time * .65 + i * 1.73) * .025;
      const [x,y,z] = project(pos);
      const selected = links[i] === document.activeElement || links[i].matches(':hover');
      const scale = (1 + z * .22) * (selected ? 1.12 : 1);
      item.style.transform = `translate(-50%,-50%) translate(${(x*radius).toFixed(2)}px,${(y*verticalRadius*.97).toFixed(2)}px) scale(${scale.toFixed(3)}) rotate(${(x*-3).toFixed(2)}deg)`;
      item.style.zIndex = selected ? '100' : String(Math.round((z+2)*20));
      item.style.opacity = selected ? '1' : String(.79 + z*.16);
    });
    // SVG paths follow exactly the same 3D projection as the cards.
    const sx = radius / width * 800, sy = verticalRadius * .97 / height * 600;
    paths.forEach((path, ring) => {
      let d = '';
      for (let j = 0; j <= 96; j++) {
        const [x,y] = project(point(ring, j / 96 * Math.PI * 2));
        d += `${j ? 'L' : 'M'}${(x*sx).toFixed(1)},${(y*sy).toFixed(1)}`;
      }
      path.setAttribute('d',d+'Z');
    });
  }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min((now-last)/1000, .04) : 0;
    last = now;
    if (!paused && !focused && !drag) { time += dt; yaw += dt*.045; }
    if (!drag && !focused && Math.abs(velocity) > .0001) {
      yaw += velocity * dt * 60;
      velocity *= Math.pow(.91,dt*60);
    }
    draw();
    if ((!paused && !focused) || drag || Math.abs(velocity)>.0001) request();
  }
  function pauseUI() {
    pause.setAttribute('aria-pressed',String(paused));
    pause.querySelector('[data-orbits-pause-icon]').textContent = paused ? '▷' : 'Ⅱ';
    pause.querySelector('[data-orbits-pause-text]').textContent = paused ? 'Вращать' : 'Пауза';
    pause.setAttribute('aria-label',paused ? 'Включить автоматическое движение проектов' : 'Приостановить автоматическое движение проектов');
  }
  pause.addEventListener('click',() => {paused=!paused;velocity=0;pauseUI();last=0;request();});
  reduced.addEventListener('change',() => {paused=reduced.matches;velocity=0;pauseUI();request();});
  stage.addEventListener('pointerdown',e => {
    if (!e.isPrimary || (e.pointerType==='mouse' && e.button!==0)) return;
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false,touch:e.pointerType==='touch'};
    suppressClick=false; velocity=0;focused=false;request();
  });
  stage.addEventListener('pointermove',e => {
    if (!drag || drag.id!==e.pointerId) return;
    const distanceX=e.clientX-drag.startX, distanceY=e.clientY-drag.startY;
    if (!drag.active && Math.hypot(distanceX,distanceY)<7) return;
    if (!drag.active && drag.touch && Math.abs(distanceY)>Math.abs(distanceX)) {drag=null;return;}
    if (!drag.active) {drag.active=true;suppressClick=true;stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');}
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    yaw+=dx*.007;
    if (!drag.touch) pitch=Math.max(-.85,Math.min(.85,pitch+dy*.004));
    velocity=paused||reduced.matches ? 0 : dx*.002;
    drag.x=e.clientX;drag.y=e.clientY;request();
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId!==drag.id)) return;
    const id=drag.id;drag=null;stage.classList.remove('is-dragging');
    if(stage.hasPointerCapture(id))stage.releasePointerCapture(id);
    request();
  }
  stage.addEventListener('pointerup',endDrag);
  stage.addEventListener('pointercancel',e=>{velocity=0;endDrag(e);});
  stage.addEventListener('lostpointercapture',e=>endDrag(e));
  window.addEventListener('pointerup',endDrag);
  window.addEventListener('blur',()=>{velocity=0;endDrag();});
  stage.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
  stage.addEventListener('dragstart',e=>e.preventDefault());
  stage.addEventListener('keydown',e=>{
    focused=true;
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)) return;
    e.preventDefault();velocity=0;
    if(e.key==='Home'){yaw=.24;pitch=-.17;}
    if(e.key==='ArrowLeft')yaw-=.16;if(e.key==='ArrowRight')yaw+=.16;
    if(e.key==='ArrowUp')pitch=Math.max(-.85,pitch-.12);if(e.key==='ArrowDown')pitch=Math.min(.85,pitch+.12);
    request();
  });
  // Pointer focus must not pin the whole collection after clicking or dragging.
  // Keep a deliberate pause only for visible keyboard focus.
  stage.addEventListener('focusin',e=>{focused=e.target.matches(':focus-visible');velocity=0;request();});
  stage.addEventListener('focusout',e=>{if(!stage.contains(e.relatedTarget)){focused=false;last=0;}request();});
  links.forEach(link=>{
    link.addEventListener('pointerenter',()=>request());
    link.addEventListener('pointerleave',()=>request());
  });
  document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else request();});
  root.classList.add('is-interactive');pause.hidden=false;pauseUI();
  new ResizeObserver(measure).observe(stage);
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(!visible){cancelAnimationFrame(raf);raf=0;last=0;}else{measure();request();}
  },{rootMargin:'100px'}).observe(stage);
})();
