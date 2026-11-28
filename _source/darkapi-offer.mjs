const provider = 'https://darkapi.shop/';
const guide = 'https://telegra.ph/DarkAPI--korotkij-gid-dlya-klientov-09-23';
const contacts = 'https://tooken.club/contacts';
const rates = 'https://tooken.club/models';

export function offerMarkup(image) {
  return `<section id="darkapi" class="darkapi-offer" aria-labelledby="darkapi-title">
  <div class="darkapi-card">
    <img class="darkapi-image" src="${image}" width="900" height="600" alt="" loading="lazy" decoding="async">
    <div class="darkapi-content">
      <p class="darkapi-provider">Партнёрское предложение DarkAPI</p>
      <h2 id="darkapi-title">1 млн токенов для ИИ через API</h2>
      <p>Код доступа DarkAPI пополняет баланс на 1 миллион токенов для работы с моделями GPT и Claude через API. Стоимость кода и условия покупки уточняйте у Tooken Club.</p>
      <p>Подходит для Codex App и CLI, Claude Code, Cursor и VS Code.</p>
      <div class="darkapi-actions">
        <a class="darkapi-order" href="${contacts}" target="_blank" rel="noopener noreferrer">Уточнить покупку промокода ↗</a>
        <a class="darkapi-link" href="${rates}" target="_blank" rel="noopener noreferrer">Тарифы моделей ↗</a>
        <a class="darkapi-link" href="${provider}" target="_blank" rel="noopener noreferrer">Активировать промокод ↗</a>
      </div>
      <details class="darkapi-details">
        <summary>Как подключиться после покупки</summary>
        <ol>
          <li>Активируйте полученный промокод на сайте DarkAPI.</li>
          <li>Создайте API-ключ в кабинете и добавьте его в настройки выбранного инструмента по инструкции.</li>
        </ol>
        <a class="darkapi-link" href="${guide}" target="_blank" rel="noopener noreferrer">Инструкция DarkAPI ↗</a>
      </details>
    </div>
  </div>
</section>`;
}
