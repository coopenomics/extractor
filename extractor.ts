import { APIClient } from "@wharfkit/antelope";
import fs from "fs-extra";
import { config } from "./config.js";
import dotenv from "dotenv";

dotenv.config();

const client = new APIClient({ url: config.endpoint });

async function fetchTable(contract: string, table: string, scope: string) {
  const response = await client.v1.chain.get_table_rows({
    code: contract,
    table: table,
    scope: scope,
    json: true,
    limit: 10000
  });

  return response.rows;
}

async function extractTables() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseDir = `./data/${config.environment}/${timestamp}`;
  await fs.ensureDir(baseDir);

  for (const contract of config.contracts) {
    for (const table of contract.tables) {
      for (const scope of config.scopes) {
        try {
          const scopeDir = `${baseDir}/${scope}`;
          await fs.ensureDir(scopeDir);

          const data = await fetchTable(contract.name, table.name, scope);
          const filePath = `${scopeDir}/${contract.name}-${table.name}.json`;

          await fs.writeJson(filePath, data, { spaces: 2 });
          console.log(`Saved: ${filePath}`);
        } catch (error) {
          console.error(`Error fetching ${contract.name}/${table.name}/${scope}:`, error);
        }
      }
    }
  }
}

extractTables();

