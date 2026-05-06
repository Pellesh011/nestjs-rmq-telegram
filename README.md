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
Для доступа к telegram api необходим http прокси TELEGRAM_PROXY_URL
