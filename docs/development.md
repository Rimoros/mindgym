# Development

## Source and distribution

Edit the five application files in the repository root. The root is directly runnable and supports static hosting. The tracked `dist/` directory is an optional distribution copy retained for compatibility with existing links and test harnesses.

After changing an application file:

```sh
npm run build
npm test
npm run check
```

The build command copies the five files without bundling, transpilation, or minification. The check command fails if any copy differs or is missing. Node.js 22 or later is the supported tooling baseline; no npm dependencies are required.

For browser checks, serve the repository root:

```sh
python3 -m http.server 8000
```

Open `/tests/browser.html` for integration checks or `/tests/mobile.html` for viewport inspection. See [testing](testing.md) before running the integration harness, which temporarily changes local test-origin progress.

## Publishing

The live project is linked from the README. To publish the root files with GitHub Pages, use this repository's intended publishing branch and root directory. Keep `index.html`, `styles.css`, `core.js`, `app.js`, and `favicon.svg` together. Asset paths are relative, so a project subpath is supported.

The CI workflow verifies source changes; it does not configure Pages or deploy the site. Existing hosting configuration is independent of these checks. Another static host can serve either the root application files or the contents of `dist/`.

## Code style

Source files use two-space indentation and explicit semicolons. The presentation update used Prettier 3.6.2, with preferences recorded in `.prettierrc.json`. Formatting is optional tooling and is not required to run the app or checks.

## Reviewing changes

Keep exercises and generated answer rules consistent. For controller changes, exercise the affected route, round states, timer cancellation, and persistence in a browser. Avoid adding demonstration scores to real progress or claiming browser coverage based only on Node tests.

The current project has no production credentials or server configuration. Do not commit exported personal progress, local browser profiles, dependency directories, or transient logs.
