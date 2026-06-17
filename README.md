# TS currency app

### Описание

`Express` приложение с REST API, авторизацией, CRUD-эндпоинтами, интеграцией с `sqlite3` и тестами.

Приложение состоит из следующих директорий и файлов:

1. `src/common/errors/` - кастомные ошибки приложения;

2. `src/common/interfaces/` - общие интерфейсы;

3. `src/controllers/` - обработчики HTTP-запросов;

4. `src/core/` - базовые настройки и логирование приложения;

5. `src/database/` - обёртка над базой данных, скрипт заполнения данными;

6. `src/middleware/` - middleware для проверки авторизации;

7. `src/routes/` - описание маршрутов приложения;

8. `src/services/` - логика взаимодействия контроллера и базы данных, планировщик задач;

9. `src/test/` - директория с `Jest` тестами;

10. `src/main.ts` - точка входа приложения;

11. `openapi.yaml` - описание API приложения.

### Установка и запуск

Клонирование репозитория:

```bash
git clone https://github.com/nhitar/ts-logger.git

cd ts-logger
```

Установка зависимостей и запуск приложения:

```bash
npm i

npm start
```

Запуск тестов:

```bash
npm test
```

Запуск через `Dockerfile`:

```
docker build . -t currency-image

docker run --rm -d --name currency-container currency-image

docker logs currency-container
```

### OpenAPI

`Swagger UI` доступен по эндпоинту:

`http://localhost:3000/api-docs`

### Отладочные пользователи

Авторизация осуществляется через `POST /auth/login`.

**email**: user@example.com

**password**: password
