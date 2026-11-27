const provider = 'https://darkapi.shop/';
const guide = 'https://telegra.ph/DarkAPI--korotkij-gid-dlya-klientov-09-23';
const contact = 'https://t.me/Wadim_8884';

export function offerMarkup(image, specialist = false) {
  const introduction = specialist
    ? 'Промокод DarkAPI на 1 миллион токенов для работы с моделями GPT и Claude. Если нужна помощь с настройкой редактора, напишите в Telegram.'
    : 'Промокод DarkAPI пополняет баланс на 1 миллион токенов для работы с моделями GPT и Claude через API.';

  return `<section id="darkapi" class="darkapi-offer" aria-labelledby="darkapi-title">
  <div class="darkapi-card">
    <img class="darkapi-image" src="${image}" width="900" height="600" alt="" loading="lazy" decoding="async">
    <div class="darkapi-content">
      <p class="darkapi-provider">Партнёрское предложение DarkAPI</p>
      <h2 id="darkapi-title">1 млн токенов для ИИ через API</h2>
      <p>${introduction}</p>
      <p>Подходит для Codex App и CLI, Claude Code, Cursor и VS Code.</p>
      <div class="darkapi-actions">
        <a class="darkapi-order" href="${contact}" target="_blank" rel="noopener noreferrer">Узнать цену и заказать</a>
        <a class="darkapi-link" href="${provider}" target="_blank" rel="noopener noreferrer">Активировать промокод ↗</a>
      </div>
      <details class="darkapi-details">
        <summary>Как подключиться после покупки</summary>
        <ol>
          <li>Получите промокод и активируйте его в кабинете DarkAPI.</li>
          <li>Создайте API-ключ в кабинете и добавьте его в настройки выбранного инструмента по инструкции.</li>
        </ol>
        <a class="darkapi-link" href="${guide}" target="_blank" rel="noopener noreferrer">Инструкция DarkAPI ↗</a>
      </details>
    </div>
  </div>
</section>`;
}
