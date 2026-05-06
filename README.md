## Запуск проекта

### Через Docker Compose

1. Создайте `.env` файл в корне проекта и заполните необходимые переменные окружения.

2. Запустите проект командой:

```bash
docker compose up -d
```


### Для запуска отдельных сервисов локально

Каждый сервис имеет собственный .env файл в своей директории. Перед запуском убедитесь, что соответствующий .env заполнен.

```bash
cd services/broker-initializer
npm i
cp .env.example .env
npm run start
```

## Swagger
Доступен по роуту /api-docs


## Telegram api 

Для обхода блокировок доступа к Telegram API можно использовать HTTP-прокси, задав переменную TELEGRAM_PROXY_URL.

Один из вариантов — поднять локальный HTTP-прокси через Privoxy, который будет проксировать трафик в SOCKS5 (например, через Tor).

Схема работы:

Telegram client → HTTP proxy (Privoxy) → SOCKS5 (Tor) → Telegram API
Privoxy — преобразует HTTP → SOCKS5

Для обхода блокировок Tor (например, DPI) можно использовать инструмент
zapret-discord-youtube
