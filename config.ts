const env = process.env.NODE_ENV || "local";

const envConfigs = {
  dev: {
    endpoint: "http://127.0.0.1:8888",
    scopes: ["voskhod"]
  },
  test: {
    endpoint: "https://api-testnet.coopenomics.world",
    scopes: ["voskhod"]
  },
  prod: {
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
        { name: "programs" },
      ]
    },
    {
      name: "fund",
      tables: [
        { name: "coopwallet" }
      ]
    }
  ]
};

