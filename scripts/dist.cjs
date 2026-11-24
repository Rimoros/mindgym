// Root files are the source of truth. Keep the optional static distribution identical.
const { readFileSync, writeFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");
const root = resolve(__dirname, "..");
const files = ["index.html", "styles.css", "core.js", "app.js", "favicon.svg"];
const check = process.argv.includes("--check");
if (!check) mkdirSync(resolve(root, "dist"), { recursive: true });
for (const file of files) {
  const source = readFileSync(resolve(root, file));
  const target = resolve(root, "dist", file);
  if (check) {
    let matches = false;
    try {
      matches = source.equals(readFileSync(target));
    } catch {
      /* Report missing files below. */
    }
    if (!matches)
      throw new Error(`dist/${file} differs from source. Run npm run build.`);
  } else {
    writeFileSync(target, source);
  }
}
console.log(
  check
    ? "PASS: all five distribution files match source."
    : "Updated dist/ from root source files.",
);
