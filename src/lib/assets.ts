/**
 * Asset Management System
 * Provides runtime helpers for accessing hero, tribe, and stone images
 */

type Big5 = { O:number; C:number; E:number; A:number; N:number };

export type AnalyzeResult = {
  mbti: string;
  reti: string;
  big5: Big5;
  heroCode?: string;           // INTP-4-023-F 처럼
  tribeNature?: string;        // 12부족 키
  tribeCrystal?: string;       // 12결정석 키
  gender?: "male"|"female";
};

export type AssetManifest = {
  generatedAt: string;
  counts: { heroes:number; tribes:number; stones:number };
  heroes: { code:string; mbti:string; reti?:string; index?:number; gender:"male"|"female"; file:string }[];
  tribes: { key:string; file:string }[];
  stones: { key:string; file:string }[];
};

let cached: AssetManifest | null = null;

export async function getManifest(): Promise<AssetManifest> {
  if (cached) return cached;
  const res = await fetch("/manifest/assets.json", { cache: "force-cache" });
  cached = await res.json();
  return cached!;
}

export async function getHeroImagePath(heroCode: string) {
  const m = await getManifest();
  const found = m.heroes.find(h => h.code === heroCode)?.file;
  if (found) return found;
  console.warn(`Hero not found: "${heroCode}"`);
  return "/heroes/male/ENFP_TYPE1.png"; // Default hero image
}

export async function findHeroByProfile(mbti: string, reti?: string, index?: number, gender?: "male"|"female") {
  const m = await getManifest();
  const MBTI = mbti.toUpperCase();
  const found = m.heroes.find(h =>
    h.mbti === MBTI &&
    (reti ? h.reti === String(reti) : true) &&
    (typeof index === "number" ? h.index === index : true) &&
    (gender ? h.gender === gender : true)
  )?.file;
  if (found) return found;
  console.warn(`Hero not found: mbti="${mbti}", reti="${reti}", index=${index}, gender="${gender}"`);
  return "/heroes/male/ENFP_TYPE1.png"; // Default hero image
}

export async function getTribeImagePath(key: string) {
  const m = await getManifest();
  const found = m.tribes.find(t => t.key === key.toLowerCase())?.file;
  if (found) return found;
  console.warn(`Tribe not found: "${key}", available:`, m.tribes.map(t => t.key).join(', '));
  return "/assets/tribes/default.png";
}

export async function getStoneImagePath(key: string) {
  const m = await getManifest();
  const found = m.stones.find(s => s.key === key.toLowerCase())?.file;
  if (found) return found;
  console.warn(`Stone not found: "${key}", available:`, m.stones.map(s => s.key).join(', '));
  return "/assets/stones/default.png";
}

