const networks=[
 {id:'vk',name:'ВКонтакте',url:'https://vk.ru/anna_kamchatka',caption:'Новости и анонсы',path:'<path d="M3 7h3.5c.4 3.3 1.7 5.3 2.8 6V7h3.3v3.5c1.1-.1 2.5-1.8 2.9-3.5h3.4c-.4 2.1-2.1 4-3.2 4.8 1.1.7 3.2 2.4 4 5.2h-3.7c-.6-1.7-1.9-3-3.4-3.2V17h-.4C6.4 17 3.5 13.5 3 7Z" fill="currentColor" stroke="none"/>'},
 {id:'instagram',name:'Instagram',url:'https://instagram.com/anna_kamchatka_0041',caption:'Визуальный контент',path:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>'},
 {id:'telegram',name:'Telegram',url:'https://t.me/anna_kamchatka',caption:'Оперативные обновления',path:'<path d="m3 10 18-7-4 18-6-5-4 3v-6l10-6-7 8Z" stroke-linejoin="round"/>'}
];
const icon=n=>`<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${n.path}</svg>`;
const external='target="_blank" rel="noopener noreferrer"';
export function enhanceHtml(html,effectsCss){
 if(html.includes('data-ambient-layer'))return html;
 html=html.replace('</head>',`<link rel="stylesheet" href="${effectsCss}"></head>`);
 html=html.replace('<body>',`<body><div class="ambient-layer" data-ambient-layer aria-hidden="true"><div class="ambient-glow ambient-green"></div><div class="ambient-glow ambient-blue"></div><div class="ambient-glow ambient-violet"></div><div class="ambient-scan"></div></div>`);
 const cards=`<section class="section social-section" id="socials" aria-labelledby="social-heading"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Работы, идеи и общение</p><h2 id="social-heading">Мы в соцсетях.</h2></div><p>Следите за проектами, смотрите визуальные идеи или напишите нам о своей задаче.</p></div><div class="social-grid">${networks.map(n=>`<a class="social-card social-${n.id}" data-social-card href="${n.url}" ${external}><span class="social-glow" aria-hidden="true"></span><span class="social-icon">${icon(n)}</span><span class="social-name">${n.name}</span><span class="social-caption">${n.caption}</span><span class="social-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></div></section>`;
 if(html.includes('data-hero-gallery'))html=html.replace('<section class="section contact-section" id="contact">',cards+'<section class="section contact-section" id="contact">');
 const footer=`<div class="footer-socials" aria-label="Социальные сети">${networks.map(n=>`<a class="social-${n.id}" data-social-footer href="${n.url}" ${external} aria-label="${n.name} — открыть в новой вкладке">${icon(n)}</a>`).join('')}</div>`;
 html=html.replace('<div class="footer-bottom">',footer+'<div class="footer-bottom">');
 html=html.replace('</body>','<a class="back-to-top" href="#main" aria-label="Наверх"><span aria-hidden="true">↑</span></a></body>');
 return html;
}
