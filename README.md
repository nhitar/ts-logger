# TS Logger

### Описание

`Node.js` приложение для логирования и интервального запуска задач.

Приложение состоит из следующих файлов:

1. `core/config.ts` - хранит конфигурацию приложения: название проекта и интервал выполнения;

2. `core/logger.ts` - инкапсулирует console.log и возвращает функцию-обертку для вывода отформатированного сообщения в консоль с названием приложения, уровнем логирования, `UUID`, датой. `UUID` сохраняется между одинаковыми интервальными задачами;

3. `services/scheduler.ts` - планировщик задач, логирующий запуск приложения и создание новых задач по переданному интервалу;

4. `common/errors/` - созданные кастомные ошибки для приложения;

5. `main.ts` - точка входа в приложение, запуск задачи с интервалом;

6. `test/` - директория с `Jest` тестами.

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

### Демонстация работы

```bash
npm run start

> js-logger@1.0.0 start
> npx tsc && node dist/main.js

[js-logger] INFO a154635c 2026-05-17T16:45:00 Scheduler started.
[js-logger] INFO 8af6b84b 2026-05-17T16:45:00 Task "run logger" with interval 10000 msec started.
[js-logger] INFO dcc7b601 2026-05-17T16:45:10 Running.
[js-logger] INFO dcc7b601 2026-05-17T16:45:20 Running.
```

```bash
npm run test

> js-logger@1.0.0 test
> jest

 PASS  src/test/scheduler.spec.ts
 PASS  src/test/logger.spec.ts

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.321 s, estimated 1 s
Ran all test suites.
```
