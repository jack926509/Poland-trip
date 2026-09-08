import test from "node:test";
import { readFile } from "node:fs/promises";

const files = [
  new URL("../src/data/travel-database.js", import.meta.url),
  new URL("../poland-travel-guide-2026.html", import.meta.url),
];

test("來源與產出頁不得殘留舊火車時間", async () => {
  for (const file of files) {
    const content = await readFile(file, "utf8");
    if (content.includes("08:45–10:56")) {
      throw new Error(`${file.pathname} 仍含有 EIP 5300 舊抵達時間`);
    }
    if (content.includes("17:40–約 20:00")) {
      throw new Error(`${file.pathname} 仍含有 EIC 8104 模糊抵達時間`);
    }
  }
});
