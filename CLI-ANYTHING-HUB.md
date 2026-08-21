# CLI-Anything Hub — локальная памятка для проектов Annakam

Дата установки: текущая сессия

## Установлено

`cli-anything-hub 0.4.1` — установлен в пользовательский Python:
`C:\Users\User\AppData\Roaming\Python\Python314\Scripts\cli-hub.exe`
(`pip install --user cli-anything-hub`)

## Как запускать

`cli-hub` НЕ в PATH. Запуск по полному пути:

```
C:\Users\User\AppData\Roaming\Python\Python314\Scripts\cli-hub.exe <command>
```

> ⚠️ **Важно о режимах файловой песочницы DSH:**
> - `cli-hub list / search / install` пишут кэш в `C:\Users\User\.cli-hub\` —
>   эта запись в обычном режиме `workspace-write` **заблокирована**.
> - Запускается только при `danger-full-access` (расширенный доступ к ФС), либо
>   если сессия уже разрешает запись вне рабочей папки.
> - Сам pip при `workspace-write` тоже падает с `PermissionError` при распаковке wheel;
>   установка пакетов требует расширенного доступа.

## Основные команды

| Команда | Назначение |
|---------|-----------|
| `cli-hub list` | Все доступные CLI |
| `cli-hub search <word>` | Поиск по имени/категории (напр. `cli-hub search deploy`) |
| `cli-hub install <name>` | Установить CLI |
| `cli-hub launch <name> [args]` | Запустить установленный CLI |
| `cli-hub info <name>` | Детали конкретного CLI |
| `cli-hub matrix list` | Курируемые наборы CLI (3D, video, image, knowledge, game) |
| `cli-hub can <task>` | Поиск capability по задачам |

## Релевантно для сайта annakam.ru / деплоя / веб

Из каталога (101+ CLI) для наших задач наиболее применимы:

| Инструмент | Установка | Для чего |
|------------|-----------|----------|
| `deployhq`  | `cli-hub install deployhq`   | Деплой кода на серверы (GitHub → хостинг). Требует аккаунт DeployHQ + токен. |
| `sentry`    | `cli-hub install sentry`     | Мониторинг ошибок сайта. Требует org/token Sentry. |
| `browser`   | `cli-hub install browser`    | Автоматизация Chrome через DOMShell MCP. Нужен локальный MCP-сервер. |
| `clibrowser`| `cli-hub install clibrowser` | Нересурсоёмкий CLI-браузер для агентов: поиск/извлечение. |
| `tinyfish`  | `cli-hub install tinyfish`   | Веб-поиск + извлечение контента + CDP-браузер. Требует ключ TinyFish. |
| `exa`       | `cli-hub install exa`        | AI-веб-поиск. Требует API-ключ Exa. |

## Что НЕ применимо к нашему сайту сейчас

- Группы 3D/CAD, Video, Audio, Graphics, Game — это для других типов проектов.
- Большинство облачных CLI (DeployHQ, Sentry, Exa, TinyFish, Mailchimp) требуют **отдельных аккаунтов и API-ключей** — без них не запускаются.

## Текущий статус проекта annakam.ru

- Локальная папка = **собранный статический сайт** с хостинга (HTML + `_next/static` + `api/*.php` + `data/site.db`).
- GitHub `https://github.com/WaDIM0041/anna-kamchatka` = **исходный код** Next.js (`src/`, `package.json`).
- Мета-теги верификации уже добавлены: исходники (`src/app/layout.tsx`, коммит `688bd65`) И локальный `index.html` (Google + Яндекс).
- Деплой на Hostiman делает пользователь вручную.
- Старая локальная версия сохранена в `_local_old_backup`.