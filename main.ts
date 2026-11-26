// NestEgg — household budget site entry (Node 22, standard library only).
//
// The site itself is plain static files under app/ (index.html, style.css and
// three small scripts, no build step, no network requests). This program is
// the hand-in: it copies app/ and screenshots/ next to this file into the
// output directory and writes /output/dossier.json with the vendored
// make.fun library, so the judge can read the site and its screenshots.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Start from a clean output directory so a stale file can never leak in.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// The whole site, as-is: every file under app/ is served at the server root.
cpSync(join(root, "app"), join(outDir, "app"), { recursive: true });

// Screenshots of the site running, taken by its maker (first by name is the cover).
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(root, "screenshots"))) {
  cpSync(join(root, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// The dossier is byte for byte what the vendored library writes from the
// copied files, under the scorer's own caps (see the gate in RULES.txt).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
const dossierPath = join(outDir, "dossier.json");
writeFileSync(dossierPath, dossier);

// A short hand-in summary on stdout, so a run's log shows what went out.
const appFiles = readdirSync(join(outDir, "app"));
const shots = readdirSync(join(outDir, "screenshots"));
console.log(
  `NestEgg handed in: ${appFiles.length} app files, ${shots.length} screenshots, ` +
  `dossier.json ${statSync(dossierPath).size} bytes -> ${outDir}`,
);
