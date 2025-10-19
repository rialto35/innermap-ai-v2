/* eslint-disable no-console */
import fs from "fs";
import path from "path";

type HeroEntry = {
  code: string;           // 예: INTP-4-023-F
  mbti: string;           // INTP
  reti?: string;          // 1~9 중 택1(있으면), 또는 구분자 문자열
  index?: number;         // 1~144 내 식별
  gender: "male"|"female";
  file: string;           // "/assets/heroes/female/intp_4_023_female.png"
};

type KeyEntry = { key: string; file: string };

const PUBLIC_ROOT = path.join(process.cwd(), "public");
const ASSETS_ROOT = path.join(PUBLIC_ROOT, "assets");

// Support both public/heroes and public/assets/heroes
const HERO_DIR = fs.existsSync(path.join(ASSETS_ROOT, "heroes")) 
  ? path.join(ASSETS_ROOT, "heroes")
  : path.join(PUBLIC_ROOT, "heroes");

const TRIBE_DIR = fs.existsSync(path.join(ASSETS_ROOT, "tribes"))
  ? path.join(ASSETS_ROOT, "tribes")
  : path.join(PUBLIC_ROOT, "assets", "tribes");

const STONE_DIR = fs.existsSync(path.join(ASSETS_ROOT, "stones"))
  ? path.join(ASSETS_ROOT, "stones")
  : path.join(PUBLIC_ROOT, "assets", "stones");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    return stat.isDirectory() ? walk(p) : [p];
  });
}

// 파일명 규칙 파서: ENFJ_TYPE1.png (현재 구조) 또는 intp_4_023_female.png (미래 구조)
function parseHeroFilename(fname: string): Omit<HeroEntry, "file"|"code"> & { code: string } | null {
  const base = path.basename(fname);
  const dir = path.basename(path.dirname(fname)); // "male" or "female"
  const gender = (dir === "male" || dir === "female") ? dir : null;
  
  // 현재 구조: ENFJ_TYPE1.png
  const m1 = base.match(/^([A-Z]{4})_TYPE([1-9])\.(png|jpg|jpeg|webp|svg)$/i);
  if (m1 && gender) {
    const [, mbti, reti] = m1;
    const code = `${mbti.toUpperCase()}-TYPE${reti}-${gender[0].toUpperCase()}`;
    return { code, mbti: mbti.toUpperCase(), reti, index: Number(reti), gender: gender as "male"|"female" };
  }
  
  // 미래 구조: intp_4_023_female.png
  const m2 = base.match(/^([a-z]{4})_([0-9]{1,2})_([0-9]{1,3})_(male|female)\.(png|jpg|jpeg|webp|svg)$/i);
  if (m2) {
    const [, mbti, reti, index, genderFromName] = m2;
    const code = `${mbti.toUpperCase()}-${reti}-${index.padStart(3,"0")}-${genderFromName[0].toUpperCase()}`;
    return { code, mbti: mbti.toUpperCase(), reti, index: Number(index), gender: genderFromName as "male"|"female" };
  }
  
  return null;
}

function buildHeroes(): HeroEntry[] {
  const files = walk(HERO_DIR);
  const out: HeroEntry[] = [];
  for (const abs of files) {
    // Generate web path relative to public/
    const relPath = path.relative(PUBLIC_ROOT, abs).replace(/\\/g,"/");
    const rel = "/" + relPath;
    const meta = parseHeroFilename(abs);
    if (!meta) continue;
    out.push({ ...meta, file: rel });
  }
  return out.sort((a,b)=> a.code.localeCompare(b.code));
}

function buildKeys(dir: string): KeyEntry[] {
  if (!fs.existsSync(dir)) return [];
  const files = walk(dir);
  return files.map((abs) => {
    // Generate web path relative to public/
    const relPath = path.relative(PUBLIC_ROOT, abs).replace(/\\/g,"/");
    const rel = "/" + relPath;
    const key = path.basename(abs).split(".")[0].toLowerCase(); // "arche" -> "arche"
    return { key, file: rel };
  }).sort((a,b)=> a.key.localeCompare(b.key));
}

function main() {
  const heroes = buildHeroes();
  const tribes = buildKeys(TRIBE_DIR);
  const stones = buildKeys(STONE_DIR);

  const manifest = { generatedAt: new Date().toISOString(), counts: {
    heroes: heroes.length, tribes: tribes.length, stones: stones.length
  }, heroes, tribes, stones };

  const outDir = path.join(process.cwd(), "public", "manifest");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "assets.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("✓ wrote public/manifest/assets.json");
  console.log(`  heroes=${heroes.length}, tribes=${tribes.length}, stones=${stones.length}`);
}

main();

