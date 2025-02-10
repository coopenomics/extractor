# Table Extractor

Этот инструмент извлекает данные из таблиц контрактов EOSIO (Antelope) и сохраняет их в JSON-файлы. Используется `wharfkit` для работы с API, а данные сортируются по окружениям, временным меткам и скопам.

### Установка
Перед началом работы установите зависимости:

```sh
pnpm install
```

### Конфигурация
Конфигурация находится в файле config.ts. В зависимости от окружения (local, test, dev) автоматически подставляются соответствующие endpoint и scopes. Структура config.ts: 

```
const env = process.env.NODE_ENV || "local";

const envConfigs = {
  local: {
    endpoint: "https://local-api.coopenomics.world",
    scopes: ["local_scope1", "local_scope2"]
  },
  test: {
    endpoint: "https://test-api.coopenomics.world",
    scopes: ["test_scope1", "test_scope2"]
  },
  dev: {
    endpoint: "https://api.coopenomics.world",
    scopes: ["voskhod", "pgrzosdeyuwg", "nzpzufzhcfab", "honruwpdxtty"]
  }
};

export const config = {
  environment: env,
  endpoint: envConfigs[env].endpoint,
  scopes: envConfigs[env].scopes,
  contracts: [
    {
      name: "soviet",
      tables: [
        { name: "participants" },
        { name: "wallets" },
        { name: "progwallets" },
        { name: "programs" }
      ]
    }
  ]
};
```


### Запуск
Выберите нужное окружение:

```
pnpm extract:local   # Запускает экстракцию для локального окружения
pnpm extract:test    # Запускает экстракцию для тестового окружения
pnpm extract:prod    # Запускает экстракцию для продакшн окружения
```

### Структура выходных файлов
Данные сохраняются в ./data/{env}/{timestamp}/{scope}/{contract}-{table}.json. Пример:

```
data/dev/2025-02-10T12-30-00Z/
  voskhod/
    soviet-participants.json
    soviet-wallets.json
  pgrzosdeyuwg/
    soviet-participants.json
    soviet-wallets.json
```

### Зависимости
@wharfkit/antelope – для работы с API EOSIO
fs-extra – для работы с файловой системой
dotenv – для загрузки переменных окружения


### Лицензия
MIT