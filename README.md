# TS Logger

### Описание

`Express` приложение с REST API, авторизацией, CRUD-эндпоинтами и тестами.

Приложение состоит из следующих директорий и файлов:

1. `src/common/errors/` - кастомные ошибки приложения;

2. `src/common/interfaces/` - общие интерфейсы;

3. `src/controllers/` - обработчики HTTP-запросов;

4. `src/core/` - базовые настройки и логирование приложения;

5. `src/middleware/` - middleware для проверки авторизации;

6. `src/routes/` - описание маршрутов приложения;

7. `src/services/` - служебная логика, включая планировщик задач;

8. `src/test/` - директория с `Jest` тестами;

9. `src/main.ts` - точка входа приложения;

10. `openapi.yaml` - описание API.

### Установка и запуск

Клонирование репозитория:

```bash
git clone https://github.com/nhitar/ts-logger.git

cd ts-logger
```

Установка зависимостей и запуск приложения:

```bash
npm i

npm run start
```

Запуск тестов:

```bash
npm run test
```

### Отладочные пользователи

Авторизация осуществляется через `POST /auth/login`.

**email**: user@example.com
**password**: password

