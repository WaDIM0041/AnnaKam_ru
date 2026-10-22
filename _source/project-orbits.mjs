// The home-page collection uses the same records and images as the catalog.
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function projectOrbits(projects) {
  if (!projects.length || new Set(projects.map(p => p.slug)).size !== projects.length) throw Error('Invalid orbit collection');
  return `<section class="project-orbits" id="project-orbits" data-project-orbits aria-labelledby="orbits-title">
    <div class="project-orbits-heading"><span class="project-orbits-dot" aria-hidden="true"></span><h2 id="orbits-title">На орбите ANNA KAM</h2><span class="project-orbits-count">${projects.length} проектов</span></div>
    <p class="project-orbits-intro">Разные миры. Найдите свой.</p>
    <p class="project-orbits-help" id="orbits-help">Вращайте коллекцию. Нажмите на превью, чтобы открыть сайт.</p>
    <div class="project-orbits-stage" data-orbits-stage tabindex="0" role="group" aria-label="Объёмная коллекция проектов" aria-describedby="orbits-help orbits-keyboard">
      <svg class="project-orbits-paths" viewBox="-400 -300 800 600" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><radialGradient id="orbit-core"><stop stop-color="#d3b88a" stop-opacity=".13"/><stop offset="1" stop-color="#d3b88a" stop-opacity="0"/></radialGradient></defs><ellipse rx="290" ry="230" fill="url(#orbit-core)"/>${[0,1,2].map(i => `<path data-orbit-path="${i}" fill="none" stroke="${['#d7bd94','#6ba6a5','#aca3c3'][i]}" stroke-opacity=".25" vector-effect="non-scaling-stroke"/>`).join('')}<circle r="3" fill="#e4cfac" opacity=".7"/></svg>
      <ul class="project-orbits-list">${projects.map((p,i) => `<li class="project-orbits-item" data-orbit-item="${i}"><a class="project-orbits-card" href="${escape(p.demo)}" target="_blank" rel="noopener noreferrer" data-project-slug="${escape(p.slug)}" aria-label="${escape(p.name)} — открыть ${p.personal?'авторский проект':'демонстрацию'} в новой вкладке"><span class="project-orbits-browser" aria-hidden="true"><i></i><i></i><i></i><span>${escape(new URL(p.demo).hostname)}</span><b>↗</b></span><img src="${escape(p.image)}" width="800" height="500" loading="lazy" decoding="async" draggable="false" alt="${escape(p.name)} — ${escape(p.kind)}"><span class="project-orbits-label">${escape(p.name)}${p.personal?'<small>Авторский проект</small>':''}</span></a></li>`).join('')}</ul>
    </div>
    <div class="project-orbits-controls"><span class="project-orbits-gesture" aria-hidden="true">↔ <span>Потяните, чтобы вращать</span></span><button type="button" data-orbits-pause aria-pressed="false" hidden><span data-orbits-pause-icon aria-hidden="true">Ⅱ</span> <span data-orbits-pause-text>Пауза</span></button></div>
    <p id="orbits-keyboard" class="project-orbits-sr">Для вращения используйте стрелки, когда коллекция в фокусе. Клавиша Tab выбирает проекты, Enter открывает сайт. На телефоне ведите в сторону для вращения, вверх и вниз для прокрутки страницы.</p>
    <noscript><p class="project-orbits-noscript">Выберите любой проект, чтобы открыть сайт.</p></noscript>
  </section>`;
}

export function integrateProjectOrbits(html, projects, assets) {
  const collection = projectOrbits(projects);
  if (html.includes('data-project-orbits')) {
    html = html.replace(/<section class="project-orbits"[\s\S]*?<\/section>/, '');
  } else {
    const previous = /<div class="hero-gallery" data-hero-gallery>[\s\S]*?<p class="hero-caption">[\s\S]*?<\/p><\/div>/;
    if (!previous.test(html)) throw Error('Home gallery insertion point missing');
    html = html.replace(previous, '');
  }
  const insertion='<section class="section" id="catalog">';
  if(!html.includes(insertion))throw Error('Full-width gallery insertion point missing');
  html=html.replace(insertion,collection+insertion);
  html=html.replace('class="hero offer-hero"','class="hero offer-hero offer-hero-with-orbits"');
  html = html.replace(/<link[^>]*data-project-orbits-css[^>]*>/g, '').replace(/<script[^>]*data-project-orbits-script[^>]*><\/script>/g, '');
  return html.replace('</head>', `<link rel="stylesheet" href="${escape(assets.css)}" data-project-orbits-css><script src="${escape(assets.js)}" defer data-project-orbits-script></script></head>`);
}
