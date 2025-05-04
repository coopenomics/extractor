const env = process.env.NODE_ENV || "development";

const contracts = [
    "soviet",
    "fund",
    "registrator",
    "draft",
    "gateway",
    "wallet",
    // "capital",
    "branch",
    "eosio.token",
    "eosio"
  ]

export const config = {
  // Базовые настройки
  environment: env,
  endpoint: process.env.ENDPOINT || "https://api.coopenomics.world",
  
  // Контракты для обработки
  contracts,

  // Дополнительные скопы (помимо самих контрактов)
  scopes: [
    "voskhod",
    "pgrzosdeyuwg",
    "nzpzufzhcfab",
    "honruwpdxtty",
    ...contracts,
  ],

  // Поисковые поля (если null - выгружать всё)
  search_fields: {
    hash: true,
    public_key: true
  },

  // Технические параметры
  limit_per_request: 1000,
  output_dir: "extracted_data_full",
  timeout: 5000 // ms
};