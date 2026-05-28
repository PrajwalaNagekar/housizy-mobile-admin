#!/usr/bin/env node
/**
 * Post-build script to prepare Vercel output for Git-based deployment.
 * Nitro's vercel preset writes config to .vercel/output but keeps assets in dist/.
 * This script copies everything into the proper .vercel/output structure.
 */
import fs from "node:fs";
import path from "node:path";

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const root = process.cwd();
const distDir = path.join(root, "dist");
const vercelDir = path.join(root, ".vercel", "output");

// Ensure clean .vercel/output
fs.rmSync(vercelDir, { recursive: true, force: true });
fs.mkdirSync(vercelDir, { recursive: true });

// Copy client assets to static/
if (fs.existsSync(path.join(distDir, "client"))) {
  copyDir(path.join(distDir, "client"), path.join(vercelDir, "static"));
}

// Copy server to functions/__server.func/
const funcDir = path.join(vercelDir, "functions", "__server.func");
fs.mkdirSync(funcDir, { recursive: true });
if (fs.existsSync(path.join(distDir, "server"))) {
  copyDir(path.join(distDir, "server"), funcDir);
}

// Write config.json for Vercel Build Output API v3
const config = {
  version: 3,
  framework: { name: "nitro", version: "3.0.260429-beta" },
  routes: [
    {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
      src: "/assets/(.*)",
    },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/__server" },
  ],
};
fs.writeFileSync(path.join(vercelDir, "config.json"), JSON.stringify(config, null, 2));

// Also write .vc-config.json for the serverless function
const vcConfig = {
  runtime: "nodejs22.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  supportsResponseStreaming: true,
};
fs.writeFileSync(path.join(funcDir, ".vc-config.json"), JSON.stringify(vcConfig, null, 2));

console.log("✓ Vercel output prepared in .vercel/output/");
