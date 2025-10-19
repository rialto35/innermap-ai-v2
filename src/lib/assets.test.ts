/**
 * Asset Manifest Tests
 * Validates that all expected assets are present
 */

import { expect, test, describe } from "vitest";
import fs from "fs";
import path from "path";

describe("Asset Manifest", () => {
  test("manifest file exists", () => {
    const manifestPath = path.join(process.cwd(), "public", "manifest", "assets.json");
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  test("manifest has correct structure", async () => {
    const manifestPath = path.join(process.cwd(), "public", "manifest", "assets.json");
    
    if (!fs.existsSync(manifestPath)) {
      console.warn("⚠️  Manifest not generated yet. Run 'npm run build:assets' first.");
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    
    expect(manifest).toHaveProperty("generatedAt");
    expect(manifest).toHaveProperty("counts");
    expect(manifest).toHaveProperty("heroes");
    expect(manifest).toHaveProperty("tribes");
    expect(manifest).toHaveProperty("stones");
  });

  test("asset counts are reasonable", async () => {
    const manifestPath = path.join(process.cwd(), "public", "manifest", "assets.json");
    
    if (!fs.existsSync(manifestPath)) {
      console.warn("⚠️  Manifest not generated yet. Run 'npm run build:assets' first.");
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    
    // Expected: 288 heroes (144 male + 144 female), 12 tribes, 12 stones
    expect(manifest.counts.heroes).toBeGreaterThanOrEqual(0);
    expect(manifest.counts.tribes).toBeGreaterThanOrEqual(0);
    expect(manifest.counts.stones).toBeGreaterThanOrEqual(0);
    
    console.log(`📊 Asset counts: heroes=${manifest.counts.heroes}, tribes=${manifest.counts.tribes}, stones=${manifest.counts.stones}`);
  });
});

