(() => {
  'use strict';
  const assetVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'dev';
  if(document.querySelector('anna-kam-assistant'))return;
  const host=document.createElement('anna-kam-assistant');
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>
    :host{font-family:inherit;font-size:15px;line-height:1.5;--ink:#f3f6f5;--muted:#abbab4;--accent:#00ed9d;--panel:#0b1411;color:var(--ink)}
    *{box-sizing:border-box} [hidden]{display:none!important} button,input,textarea{font:inherit} button,a,input,textarea{touch-action:manipulation}button,a{ -webkit-tap-highlight-color:transparent}button{cursor:pointer}button:disabled{cursor:wait;opacity:.55}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
    .launcher{display:flex;gap:16px;align-items:center;width:100%;border:1px solid #00ed9d80;border-radius:16px;padding:20px 24px;background:#091b13;color:var(--ink);text-align:left;white-space:normal}.launcher:hover{background:#113025}.launcher .mark{flex-shrink:0}.launcher strong{display:block;font-size:17px}.launcher small{display:block;max-width:82ch;margin-top:10px;color:#bdcfc6;font-size:14px;line-height:1.65}.launcher-cta{display:inline-block;margin-top:16px;color:var(--accent);font-size:14px;font-weight:700}.mark{display:grid;place-items:center;border:1px solid #00ed9d66;border-radius:50%;width:36px;height:36px;color:var(--accent);font-weight:750}
    dialog{position:fixed;inset:auto 24px 24px auto;margin:0;padding:0;width:450px;height:min(760px,calc(100dvh - 48px));max-width:calc(100vw - 32px);max-height:calc(100dvh - 32px);border:1px solid #2a4639;border-radius:22px;background:var(--panel);color:var(--ink);box-shadow:0 24px 100px #000a;overflow:hidden}dialog::backdrop{background:#0005;backdrop-filter:blur(2px)}.shell{height:100%;display:flex;flex-direction:column}
    header{display:flex;gap:12px;align-items:center;padding:18px 20px;border-bottom:1px solid #233b30}h2{font-size:16px;line-height:1.3;margin:0}header p{font-size:12px;color:var(--muted);margin:4px 0 0}.heading{flex:1}.icon{color:var(--ink);background:transparent;border:1px solid #355344;border-radius:9px;min-width:36px;min-height:36px}.icon:hover{background:#253d31}.notice{margin:0;padding:9px 20px;background:#162c21;color:#d8e8df;font-size:12px;line-height:1.4}.notice a{color:var(--accent)}
    .scroll{overflow:auto;overscroll-behavior:contain;padding:20px;flex:1;min-height:0;scrollbar-color:#385b48 transparent}.message{margin:0 0 17px;max-width:96%;white-space:pre-wrap;overflow-wrap:anywhere}.message p{margin:0}.message .who{display:block;color:var(--muted);font-size:11px;margin-bottom:5px}.user{margin-left:auto;background:#1a382a;padding:12px 14px;border-radius:14px 14px 3px 14px}.assistant{padding:0 0 0 11px;border-left:2px solid #00ed9d70}.sources{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}.sources a{color:#b6edcf;font-size:12px;text-decoration:underline;text-underline-offset:3px}
    .suggestions{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}.chip{background:#14271d;border:1px solid #385743;color:#d9eee3;border-radius:20px;padding:7px 11px;font-size:12px}.chip:hover{border-color:var(--accent)}.status{font-size:12px;color:#ffd9a3;margin:12px 0;white-space:pre-wrap}.status:empty{display:none}.dots{font-size:13px;color:var(--muted)}
    .bottom{border-top:1px solid #233b30;padding:12px 16px 15px;background:#0c1811}.compose{display:flex;gap:8px;align-items:flex-end}.compose textarea{resize:none;min-height:46px;max-height:100px;flex:1;width:100%;border:1px solid #3a5647;border-radius:11px;background:#07110c;color:var(--ink);padding:11px 12px}.send{border:0;border-radius:11px;min-width:46px;height:46px;background:var(--accent);color:#032217;font-weight:bold;font-size:20px}.handoff{border:1px solid #31503e;border-radius:9px;width:100%;background:transparent;color:#bce8ce;padding:9px;margin-top:9px;font-size:13px}.privacy{margin:8px 0 0;color:var(--muted);font-size:10px}.privacy a{color:var(--muted)}.consent{display:flex;gap:9px;font-size:12px;margin-bottom:10px}.consent input{accent-color:var(--accent)}
    .lead{margin-top:18px;padding:15px;background:#11251a;border:1px solid #39573f;border-radius:12px}.lead h3{font-size:17px;margin:0 0 6px}.lead p{font-size:12px;color:#c1d4c7;margin:0 0 12px}.lead label{display:block;font-size:12px;margin:12px 0 5px}.lead input,.lead textarea{width:100%;background:#08140c;color:var(--ink);border:1px solid #3b5a46;border-radius:7px;padding:9px}.lead textarea{resize:vertical;min-height:110px}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.primary{display:inline-block;background:var(--accent);color:#052016;border:0;border-radius:8px;padding:10px 13px;text-decoration:none;font-weight:650;font-size:13px}.secondary{background:transparent;border:1px solid #55735f;color:var(--ink);border-radius:8px;padding:10px 13px;text-decoration:none;font-size:13px}.lead-status{font-size:12px;margin:10px 0 0;color:#d2e9d9}.lead details{margin-top:12px;font-size:12px}.lead summary{cursor:pointer;color:#bcdcc8}.lead details p{margin-top:8px}.lead .close-lead{float:right}.lead label.check{display:flex;align-items:flex-start;gap:8px}.check input{width:auto;margin-top:4px;accent-color:var(--accent)}
    @media(max-width:600px){dialog{inset:8px;margin:0;width:calc(100vw - 16px);height:calc(100dvh - 16px);max-width:none;max-height:none;border-radius:15px}.scroll{padding:17px}.launcher{padding:11px 15px}.launcher small{font-size:11px}}
    @media(prefers-reduced-motion:no-preference){.launcher{transition:background .2s}dialog[open]{animation:appear .16s ease-out}@keyframes appear{from{opacity:.6;transform:translateY(8px)}to{opacity:1;transform:none}}}

    /* Original annakam.ru showcase hover: one cyan sweep, 5s revolution, .7s fade. */
    .launcher-glow{position:relative;isolation:isolate;overflow:hidden;border-radius:16px;padding:1px;--glow-accent:rgba(0,204,255,.3);background:rgba(0,204,255,.12)}
    .launcher-glow::before{content:"";position:absolute;inset:-150%;background:conic-gradient(from 0deg,transparent 0%,transparent 25%,var(--glow-accent) 40%,transparent 55%,transparent 100%);opacity:0;pointer-events:none;transition:opacity .7s;animation:showcase-glow 5s linear infinite}
    .launcher-glow:hover::before,.launcher-glow:focus-within::before{opacity:1}
    .launcher-glow .launcher{position:relative;z-index:1;border:0;border-radius:15px;background:rgba(255,255,255,.03);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .launcher-glow .launcher:hover{background:rgba(255,255,255,.03)}
    @keyframes showcase-glow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){.launcher-glow::before{animation:none;transition:none}}
  </style>
  <div class="launcher-glow"><button class="launcher" aria-haspopup="dialog" aria-label="Попробовать чат-бота ANNA KAM"><span class="mark" aria-hidden="true">AK</span><span><strong>Ваш менеджер по продажам на сайте — 24/7</strong><small>Клиент зашёл вечером или в выходной? Чат-бот встретит его, ответит на вопросы по материалам вашего бизнеса, уточнит потребности и поможет выбрать подходящее предложение. Подведёт к покупке и подготовит обращение вам — окончательные условия сделки согласует человек.</small><small>Попробуйте на примере своего бизнеса: расскажите, чем вы занимаетесь, и представьте, как такой помощник будет работать с вашими клиентами.</small><span class="launcher-cta">Попробовать нашего чат-бота ↗</span></span></button></div>
  <dialog aria-labelledby="ak-title"><div class="shell"><header><span class="mark" aria-hidden="true">AK</span><div class="heading"><h2 id="ak-title">Помощник ANNA KAM</h2><p>Спросите. Попробуйте. Представьте у себя.</p></div><button class="icon reset" aria-label="Начать новый разговор" title="Начать заново">↺</button><button class="icon close" aria-label="Закрыть чат">×</button></header><p class="notice">Подключаем помощника…</p><div class="scroll"><div class="messages" role="log" aria-label="Разговор с помощником" aria-live="polite" aria-relevant="additions"></div><div class="suggestions" aria-label="Примеры вопросов"></div><p class="status" role="status"></p>
  <section class="lead" hidden aria-labelledby="ak-lead-title"><button class="icon close-lead" aria-label="Закрыть подготовку обращения">×</button><h3 id="ak-lead-title">Обсудим вашего бота</h3><p>Подготовим текст для команды. Вы сможете изменить его и сами отправить в Telegram.</p><label for="ak-name">Как к вам обращаться — необязательно</label><input id="ak-name" maxlength="80" autocomplete="given-name"><label for="ak-contact">Контакт для ответа — необязательно</label><input id="ak-contact" maxlength="120" placeholder="Например, @username" autocomplete="off"><label for="ak-task">Ваша задача</label><textarea id="ak-task" maxlength="1500" placeholder="Чем занимается бизнес и с чем должен помогать бот"></textarea><label class="check"><input type="checkbox" class="include-context" checked>Добавить мои последние сообщения в обращение</label><button class="secondary prepare" type="button">Подготовить текст</button><div class="prepared" hidden><label for="ak-draft">Сообщение команде — можно изменить</label><textarea id="ak-draft" maxlength="6000"></textarea><div class="actions"><button class="primary copy" type="button">Скопировать текст</button><a class="secondary telegram" href="https://t.me/anna_kamchatka" target="_blank" rel="noopener noreferrer">Открыть Telegram</a></div><p class="lead-status" role="status">Текст подготовлен. Обращение ещё не отправлено.</p></div><details><summary>Что передаётся и кому</summary><p>Эти поля остаются в памяти вкладки и не отправляются ИИ. При копировании текст попадёт в буфер обмена. После перехода в Telegram вставьте текст, проверьте получателя anna_kamchatka и отправьте его самостоятельно. Очистка чата не удаляет уже скопированный или отправленный текст.</p></details></section>
  </div><div class="bottom"><label class="consent" hidden><input type="checkbox" class="ai-consent">Разрешаю отправлять сообщения и контекст диалога в OpenAI для ответа ИИ. Не буду указывать чувствительные данные.</label><form class="compose"><textarea aria-label="Ваш вопрос" placeholder="Спросите о боте для вашего бизнеса…" maxlength="2000" rows="1" required></textarea><button class="send" aria-label="Отправить вопрос" type="submit">↑</button></form><button class="handoff" type="button">Обсудить с ANNA KAM</button><p class="privacy">Без оплаты и автоматической записи. История хранится временно в памяти сервера. <a href="/bot/privacy.html" target="_blank" rel="noopener">О данных чата</a></p></div></div></dialog>`;
  // An ordinary page block reserves its own space rather than covering content.
  const intro=document.querySelector('main .offer-hero')||document.querySelector('main .hero, main .page-intro');
  if(intro)intro.after(host);
  else (document.querySelector('main .wrap, main')||document.body).prepend(host);
  const $=s=>shadow.querySelector(s),dialog=$('dialog'),scroll=$('.scroll'),input=$('.compose textarea');
  let config=null,busy=false,generation=0,controller=null,history=[],business='',configured=false,demoEngine=null,demoState=null,demoCount=0;
  const status=text=>{$('.status').textContent=text;};
  function toBottom(){scroll.scrollTop=scroll.scrollHeight;}
  function message(role,text,sources=[]){
    const block=document.createElement('div');block.className='message '+role;
    const label=document.createElement('span');label.className='who';label.textContent=role==='user'?'Вы':'ANNA KAM';
    const paragraph=document.createElement('p');paragraph.textContent=text;block.append(label,paragraph);
    if(sources.length){const links=document.createElement('div');links.className='sources';for(const source of sources){if(!/^\/(?:support|how-to-buy|licenses|sites\/[-a-z0-9]+)\/$/.test(source.url))continue;const a=document.createElement('a');a.href=source.url;a.textContent=source.title;a.target='_blank';a.rel='noopener';links.append(a);}block.append(links);}
    $('.messages').append(block);toBottom();
  }
  function suggestions(items){$('.suggestions').replaceChildren();for(const text of items){const b=document.createElement('button');b.className='chip';b.textContent=text;b.type='button';b.disabled=busy;b.addEventListener('click',()=>send(text));$('.suggestions').append(b);}}
  function greeting(){message('assistant','Здравствуйте! Я помощник ANNA KAM. Расскажу о сайтах и ботах или покажу пример консультации для вашего бизнеса. Что попробуем?');suggestions(['Покажи пример','Подобрать сайт','Сколько стоит бот?']);}
  async function loadConfig(){
    try {const r=await fetch('/bot-api/config.php',{cache:'no-store'});if(!r.ok)throw Error();config=await r.json();
      if(!['demo','live'].includes(config.mode))throw Error();
      if(config.mode==='live'){
        if(!['OpenAI','Yandex AI Studio'].includes(config.provider))throw Error();
        $('.consent').lastChild.textContent=`Разрешаю отправлять сообщения и контекст диалога в ${config.provider} для ответа ИИ. Не буду указывать чувствительные данные.`;
      }
      if(config.mode==='demo'&&config.demoTransport==='browser'){
        const [module,knowledgeResponse]=await Promise.all([import('/bot/demo-engine.mjs?v='+encodeURIComponent(assetVersion)),fetch('/bot/demo-knowledge.json?v='+encodeURIComponent(assetVersion),{cache:'no-cache'})]);
        if(!knowledgeResponse.ok)throw Error();
        demoEngine=module.createDemoEngine(await knowledgeResponse.json());demoState=demoEngine.newState();demoCount=0;
      }
      configured=true;
      $('.notice').textContent=config.mode==='demo'?'Сценарная демонстрация: заранее подготовленные ответы. Свободные ответы ИИ пока не подключены.':'Отвечает ИИ по материалам ANNA KAM. Сложные вопросы и условия передаём человеку.';
      const privacy=$('.privacy');privacy.firstChild.textContent=config.historyStorage==='browser'?'Без оплаты и автоматической записи. Этот пример работает в вашей вкладке; сообщения на сервер не отправляются. ':config.historyStorage==='private-sqlite'?'Без оплаты и автоматической записи. Краткая история временно хранится в закрытой базе сервера. ':'Без оплаты и автоматической записи. Краткая история временно хранится в памяти сервера. ';
      $('.consent').hidden=config.mode!=='live';status('');
    }catch{configured=false;$('.notice').textContent='Помощник сейчас недоступен. Можно подготовить обращение команде.';status('Не удалось подключиться. Закройте и снова откройте чат, чтобы повторить.');}
  }
  $('.launcher').addEventListener('click',async()=>{dialog.showModal();if(!configured)await loadConfig();input.focus();});
  $('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>$('.launcher').focus());
  $('.compose').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(input.value);}});
  function setBusy(value){busy=value;$('.send').disabled=value;$('.reset').disabled=value;shadow.querySelectorAll('.chip').forEach(b=>b.disabled=value);}
  async function send(text){
    if(busy||!text.trim())return;
    if(text.length>2000){status('Сообщение должно быть короче 2000 символов.');return;}
    if(!configured){status('Чат не подключён. Можно подготовить обращение команде.');return;}
    if(config.mode==='live'&&!$('.ai-consent').checked){status('Для ИИ-ответа подтвердите передачу сообщения провайдеру. Или обсудите задачу с командой без ИИ.');$('.ai-consent').focus();return;}
    const ticket=generation;setBusy(true);input.value='';status('Готовлю ответ…');message('user',text.trim());
    controller=new AbortController();
    const timeout=setTimeout(()=>controller?.abort(),30000);
    try {
      let data;
      if(config.mode==='demo'&&config.demoTransport==='browser'){
        if(demoCount>=40)throw Error('Достигнут предел диалога. Начните новый разговор.');
        data={...demoEngine.demoReply(text.trim(),demoState),business:demoState.business};demoCount++;
      }else{
        const r=await fetch('/bot-api/chat.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text.trim(),aiConsent:$('.ai-consent').checked}),signal:controller.signal});
        data=await r.json();if(!r.ok)throw Error(data.error||'Не удалось получить ответ.');
      }
      if(ticket!==generation)return;
      history.push(text.trim());business=data.business||business;
      message('assistant',data.text,data.sources);status('');suggestions(data.suggestions||[]);
      if(data.handoff)$('.handoff').textContent='Подготовить обращение в ANNA KAM';
    }catch(e){if(ticket!==generation)return;status(e.name==='AbortError'?'Ответ задержался. Повторите вопрос или подготовьте обращение команде.':e.message);input.value=text;}
    finally{clearTimeout(timeout);if(ticket===generation){setBusy(false);input.focus();}controller=null;}
  }
  function openLead(){
    $('.lead').hidden=false;$('.prepared').hidden=true;
    if(!$('#ak-task').value)$('#ak-task').value=business?`Сфера бизнеса: ${business}. Нужен бот для сайта.`:'';
    $('.lead').scrollIntoView({block:'start',behavior:'instant'});$('#ak-task').focus();
  }
  $('.handoff').addEventListener('click',openLead);$('.close-lead').addEventListener('click',()=>{$('.lead').hidden=true;input.focus();});
  $('.prepare').addEventListener('click',()=>{
    const name=$('#ak-name').value.trim(),contact=$('#ak-contact').value.trim(),task=$('#ak-task').value.trim();
    const context=$('.include-context').checked?history.slice(-6).map(t=>'• '+t).join('\n'):'';
    $('#ak-draft').value=['Здравствуйте! Хочу обсудить помощника для сайта с ANNA KAM.',name?'Имя: '+name:'',contact?'Контакт: '+contact:'',task?'Задача: '+task:'Задачу хочу уточнить с командой.',context?'Мои сообщения в чате:\n'+context:'','Прошу обсудить возможный состав, стоимость и условия внедрения.'].filter(Boolean).join('\n\n');
    $('.prepared').hidden=false;$('.lead-status').textContent='Текст подготовлен. Обращение ещё не отправлено.';$('#ak-draft').focus();
  });
  $('.copy').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText($('#ak-draft').value);$('.lead-status').textContent='Скопировано. Откройте Telegram, вставьте текст и отправьте его самостоятельно.';}
    catch{$('#ak-draft').focus();$('#ak-draft').select();$('.lead-status').textContent='Скопируйте выделенный текст вручную. Обращение ещё не отправлено.';}
  });
  $('.telegram').addEventListener('click',()=>{$('.lead-status').textContent='В Telegram нужно вставить и отправить сообщение самостоятельно. Здесь доставка не подтверждена.';});
  $('.reset').addEventListener('click',async()=>{
    const ticket=++generation;controller?.abort();setBusy(true);status('Очищаю разговор…');
    try{
      if(config?.mode==='demo'&&config.demoTransport==='browser'){demoState=demoEngine.newState();demoCount=0;}
      else{const r=await fetch('/bot-api/reset.php',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw Error();}
      if(ticket!==generation)return;history=[];business='';$('.messages').replaceChildren();$('.lead').hidden=true;$('.prepared').hidden=true;
      for(const selector of ['#ak-name','#ak-contact','#ak-task','#ak-draft'])$(selector).value='';input.value='';$('.ai-consent').checked=false;$('.handoff').textContent='Обсудить с ANNA KAM';greeting();status('Начат новый разговор.');
    }catch{status('Не удалось очистить разговор на сервере. Попробуйте ещё раз.');}
    finally{setBusy(false);input.focus();}
  });
  greeting();
})();
