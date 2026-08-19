import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePaths = [
  "index.html",
  "privacy.html",
  "terms-of-use.html",
  "marketing.html",
  "android/privacy.html",
  "android/terms-of-use.html",
  "android/marketing.html",
  "support/index.html",
];
const supportEmail = "velvet_rogue_5@proton.me";
const pagesBase = "https://velvetrogue5.github.io/mosaicloop-site";

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

// Every page: required head tags, and every local href/src must resolve on disk.
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
    const resolved = resolve(dirname(fullPath), localTarget);
    const onDisk = localTarget.endsWith("/") ? join(resolved, "index.html") : resolved;
    assert.ok(existsSync(onDisk), `${relativePath} should resolve ${target}`);
  }
}

// Titles.
includes("index.html", "<title>Mosaic Loop</title>");
includes("privacy.html", "Privacy Policy (iOS) | Mosaic Loop");
includes("terms-of-use.html", "Terms of Use (iOS) | Mosaic Loop");
includes("marketing.html", "iOS Marketing Copy | Mosaic Loop");
includes("android/privacy.html", "Privacy Policy (Android) | Mosaic Loop");
includes("android/terms-of-use.html", "Terms of Use (Android) | Mosaic Loop");
includes("android/marketing.html", "Android Marketing Copy | Mosaic Loop");
includes("support/index.html", "Support | Mosaic Loop");

// Privacy claims that must stay true for the shipped build.
includes("privacy.html", "Last updated: August 19, 2026");
includes("privacy.html", "No Ads or Tracking");
includes("privacy.html", "App Tracking Transparency");
includes("privacy.html", "Data Not Collected");
includes("privacy.html", "Required Reason APIs");

includes("android/privacy.html", "Last updated: August 19, 2026");
includes("android/privacy.html", "android.permission.VIBRATE");
includes("android/privacy.html", "android.permission.INTERNET");
includes("android/privacy.html", "Android Backup");
includes("android/privacy.html", "Data safety");

// Terms.
includes("terms-of-use.html", "https://www.apple.com/legal/internet-services/itunes/");
includes("android/terms-of-use.html", "https://play.google.com/about/play-terms/");
for (const p of ["terms-of-use.html", "android/terms-of-use.html"]) {
  includes(p, "Effective date: August 19, 2026");
  includes(p, "15. Contact");
}

// Store copy stays inside the platform character limits.
const copyLimits = {
  "marketing.html": {
    "app-name": 30,
    subtitle: 30,
    "promotional-text": 170,
    keywords: 100,
    "app-store-description": 4000,
  },
  "android/marketing.html": {
    "app-name": 30,
    "short-description": 80,
    "full-description": 4000,
  },
};
for (const [page, fields] of Object.entries(copyLimits)) {
  const html = read(page);
  for (const [id, max] of Object.entries(fields)) {
    const match = html.match(new RegExp(`<pre id="${id}"[^>]*>([\\s\\S]*?)<\\/pre>`));
    assert.ok(match, `${page} should include #${id}`);
    const length = match[1].trim().length;
    assert.ok(length <= max, `${page} #${id} is ${length} characters, over the ${max} limit`);
    includes(page, `<p class="copy-note">${length.toLocaleString("en-US")} / ${max.toLocaleString("en-US")} characters.</p>`);
  }
}

includes("marketing.html", "Contains ads:</strong> No.");
includes("marketing.html", "Data Not Collected");
includes("android/marketing.html", "Data Safety Draft");
includes("android/marketing.html", "Contains ads:</strong> No.");

// The two builds ship different level packs, so neither listing may borrow the other's copy.
includes("marketing.html", "<strong>Level pack:</strong>");
includes("android/marketing.html", "<strong>Level pack:</strong>");
excludes("marketing.html", "animal");
includes("android/marketing.html", "animal and nature pictures");
includes("README.md", "Level packs differ by platform");
includes("README.md", "Firebase");

includes("support/index.html", "Mosaic Loop Support");
includes("support/index.html", "https://github.com/VelvetRogue5/mosaicloop-site/issues");

// Contact address is reachable from every document, and no stale branding survives.
for (const relativePath of pagePaths.filter((p) => p !== "index.html")) {
  includes(relativePath, supportEmail);
  includes(relativePath, `mailto:${supportEmail}`);
}
for (const relativePath of [...pagePaths, "README.md", "assets/styles.css"]) {
  for (const stale of ["Paper Boom", "Jewel Loop", "JewelLoop", "jewelloop", "ai.com.mosaicloop"]) {
    excludes(relativePath, stale);
  }
}

includes("README.md", `${pagesBase}/privacy.html`);
includes("README.md", `${pagesBase}/android/privacy.html`);
includes("README.md", `${pagesBase}/support/`);

includes("assets/styles.css", ".platform-switcher");
includes("assets/styles.css", ".summary-grid");
includes("assets/styles.css", ".contact-panel");
includes("assets/styles.css", ".copy-block");

assert.ok(existsSync(join(root, ".nojekyll")), ".nojekyll should exist");
includes(".gitignore", ".DS_Store");
assert.ok(statSync(join(root, "assets/app-icon.png")).size > 20_000, "app icon should be a real PNG");

console.log(`Mosaic Loop site validation passed (${pagePaths.length} pages).`);
