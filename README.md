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

### Демонстация работы

```bash
npm run start

> js-logger@1.0.0 start
> npx tsc && node dist/main.js

[js-logger] scheduler.js file started.
[js-logger] Task "run logger" with interval 10000 msec started.
[js-logger] running.
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
