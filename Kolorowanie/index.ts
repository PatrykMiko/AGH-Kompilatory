import { Scanner } from "./scanner";
import { colorize } from "./colorizer";
import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";

const inputFile = process.argv[2];
const outputFile = process.argv[3] ?? "output.html";

if (!inputFile) {
  console.error("Użycie: bun run index.ts <plik.calc> [plik_wyjściowy.html]");
  process.exit(1);
}

const source = readFileSync(inputFile, "utf-8");
const tokens = new Scanner(source).tokenize();
const html = colorize(tokens, basename(inputFile));
writeFileSync(outputFile, html, "utf-8");

console.log(`Pokolorowano: ${inputFile} → ${outputFile}`);

const counts: Record<string, number> = {};
for (const t of tokens) counts[t.type] = (counts[t.type] ?? 0) + 1;
for (const [type, count] of Object.entries(counts).sort())
  if (type !== "EOF") console.log(`  ${type.padEnd(16)} ${count}`);
