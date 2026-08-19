import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePaths = ["index.html", "privacy.html", "android/privacy.html"];
const supportEmail = "velvet_rogue_5@proton.me";

function read(relativePath) {
  const fullPath = join(root, relativePath);
  assert.ok(existsSync(fullPath), `${relativePath} should exist`);
  return readFileSync(fullPath, "utf8");
}

function includes(file, expected) {
  assert.ok(read(file).includes(expected), `${file} should include ${JSON.stringify(expected)}`);
}

function excludes(file, forbidden) {
  assert.ok(!read(file).includes(forbidden), `${file} should not include ${JSON.stringify(forbidden)}`);
}

for (const relativePath of pagePaths) {
  const fullPath = join(root, relativePath);
  const html = read(relativePath);
  for (const expected of ["<!doctype html>", "<html lang=\"en\">", "<title>", "name=\"viewport\"", "name=\"description\""]) {
    assert.ok(html.toLowerCase().includes(expected.toLowerCase()), `${relativePath} should include ${expected}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    const localTarget = target.split("#", 1)[0].split("?", 1)[0];
    assert.ok(existsSync(resolve(dirname(fullPath), localTarget)), `${relativePath} should resolve ${target}`);
  }
}

includes("index.html", "<title>Mosaic Loop</title>");
includes("index.html", "privacy.html");
includes("index.html", "android/privacy.html");

includes("privacy.html", "Privacy Policy (iOS) | Mosaic Loop");
includes("privacy.html", "Last updated: August 19, 2026");
includes("privacy.html", "No Ads or Tracking");
includes("privacy.html", "App Tracking Transparency");
includes("privacy.html", "Data Not Collected");
includes("privacy.html", "Required Reason APIs");
includes("privacy.html", "android/privacy.html");

includes("android/privacy.html", "Privacy Policy (Android) | Mosaic Loop");
includes("android/privacy.html", "Last updated: August 19, 2026");
includes("android/privacy.html", "android.permission.VIBRATE");
includes("android/privacy.html", "android.permission.INTERNET");
includes("android/privacy.html", "Android Backup");
includes("android/privacy.html", "Data safety");
includes("android/privacy.html", "../privacy.html");

for (const relativePath of ["privacy.html", "android/privacy.html"]) {
  includes(relativePath, supportEmail);
  includes(relativePath, `mailto:${supportEmail}`);
  // Claims that must stay true for the current build.
  for (const stale of ["Paper Boom", "Jewel Loop", "JewelLoop", "jewelloop"]) {
    excludes(relativePath, stale);
  }
}

includes("README.md", "https://velvetrogue5.github.io/mosaicloop-site/privacy.html");
includes("README.md", "https://velvetrogue5.github.io/mosaicloop-site/android/privacy.html");

includes("assets/styles.css", ".platform-switcher");
includes("assets/styles.css", ".summary-grid");
includes("assets/styles.css", ".contact-panel");

assert.ok(existsSync(join(root, ".nojekyll")), ".nojekyll should exist");
includes(".gitignore", ".DS_Store");
assert.ok(statSync(join(root, "assets/app-icon.png")).size > 20_000, "app icon should be a real PNG");

console.log("Mosaic Loop site validation passed.");
