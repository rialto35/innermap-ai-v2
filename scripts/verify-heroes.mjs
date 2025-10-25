import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function verify(indexFile) {
  const p = path.join(root, "public/heroes", indexFile);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing index file: ${p}`);
    process.exit(1);
  }
  const idx = JSON.parse(fs.readFileSync(p, "utf8"));
  let missing = 0;
  for (const key of Object.keys(idx)) {
    const val = idx[key];
    const rel = typeof val === "string" ? val : (val && typeof val === "object" && typeof val.path === "string" ? val.path : null);
    if (!rel) {
      console.warn(`⚠️  Skip key with unknown format: ${key}`);
      continue;
    }
    const filePath = path.join(root, "public", String(rel).replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing asset for key "${key}": ${filePath}`);
      missing++;
    }
  }
  return missing;
}

const m1 = verify("heroIndex-male.json");
const m2 = verify("heroIndex-female.json");
if (m1 + m2 > 0) {
  console.error(`\n✖ Missing ${m1 + m2} hero asset(s).`);
  process.exit(1);
}
console.log("✅ Hero assets verified.");


