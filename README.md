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
Для обхода блокировок к telegram api необходим http прокси TELEGRAM_PROXY_URL
Можно использовать бесплатный вариант  privoxy (поднимается локальный http прокси и тунелится через socks5) + tor bundle (socks5).
https://github.com/Flowseal/zapret-discord-youtube для обхода блокировок тор мостов.
