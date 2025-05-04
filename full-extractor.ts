import { APIClient, Name } from "@wharfkit/antelope";
import fs from "fs-extra";
import { config } from "./config2.js";
import dotenv from "dotenv";

dotenv.config();

const client = new APIClient({ url: config.endpoint });

async function fetchContractABI(contractName: string) {
  try {
    const response = await client.v1.chain.get_abi(Name.from(contractName));
    return response.abi;
  } catch (error) {
    console.error(`Error fetching ABI for ${contractName}:`, error);
    return null;
  }
}

async function fetchTable(contract: string, table: string, scope: string) {
  try {
    const response = await client.v1.chain.get_table_rows({
      code: contract,
      table: table,
      scope: scope,
      json: true,
      limit: config.limit_per_request
    });
    return response.rows;
  } catch (error) {
    console.error(`Error fetching table ${contract}/${table}/${scope}:`, error);
    return [];
  }
}

function containsTargetFields(data: any): boolean {
  if (typeof data !== 'object' || data === null) return false;

  // Check if object contains both hash and public_key
  const hasHash = 'hash' in data;
  const hasPublicKey = 'public_key' in data || 'publicKey' in data;
  
  if (hasHash && hasPublicKey) return true;

  // Recursively check nested objects
  for (const key in data) {
    if (containsTargetFields(data[key])) {
      return true;
    }
  }

  return false;
}

async function processContract(contractName: string, baseDir: string) {
  const abi = await fetchContractABI(contractName);
  if (!abi) return;

  const tables = abi.tables;
  if (!tables) return;

  console.log(`Processing contract ${contractName} with ${tables.length} tables`);

  for (const table of tables) {
    for (const scope of config.scopes) {
      try {
        const tableData = await fetchTable(contractName, table.name, scope);
        if (!tableData.length) continue;

        // Filter rows if search_fields is specified
        const filteredData = config.search_fields
          ? tableData.filter(row => containsTargetFields(row))
          : tableData;

        if (!filteredData.length) continue;

        const scopeDir = `${baseDir}/${scope}`;
        await fs.ensureDir(scopeDir);

        const filePath = `${scopeDir}/${contractName}_${table.name}.json`;
        await fs.writeJson(filePath, filteredData, { spaces: 2 });
        console.log(`Saved: ${filePath} with ${filteredData.length} records`);
      } catch (error) {
        console.error(`Error processing ${contractName}/${table.name}/${scope}:`, error);
      }
    }
  }
}

async function extractAllTables() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseDir = `./extracted_data/${config.environment}/${timestamp}`;
  await fs.ensureDir(baseDir);

  for (const contract of config.contracts) {
    await processContract(contract, baseDir);
  }
}

extractAllTables();