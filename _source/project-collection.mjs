const novel={
  slug:'k-zvezdam',recordId:'personal-k-zvezdam',recordType:'personal',personal:true,
  name:'Через время к звёздам',category:'personal',categoryLabel:'Авторский проект',kind:'Сайт романа',
  description:'Авторский роман и отдельная визуальная история. Творческий проект, не шаблон для продажи.',
  image:'/portfolio/k-zvezdam.webp',demo:'https://kzvezdam.annakam.ru/'
};

const specialist={
  slug:'specialist-na-chas',recordId:'personal-specialist-na-chas',recordType:'personal',personal:true,
  name:'Специалист на час',category:'personal',categoryLabel:'Авторский проект',kind:'Портфолио услуг',
  description:'Сайты, чат-боты и контент для бизнеса. На сайте — услуги, примеры работ и способ обсудить задачу.',
  image:'/portfolio/specialist-na-chas.webp',demo:'https://wadim0041.github.io/specialist-na-chas/',
  alt:'Первый экран сайта «Специалист на час»',caption:'Портфолио специалиста'
};

export function collectProjects(products){
  const featured=[...products.slice(0,3),novel,specialist];
  return {featured,all:[...featured,...products.slice(3)]};
}
