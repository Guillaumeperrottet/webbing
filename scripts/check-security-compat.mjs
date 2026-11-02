import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import test from "node:test";
import { ESLint } from "eslint";
import legacyImport, { minimatch, Minimatch } from "minimatch";

const require = createRequire(import.meta.url);
const legacyRequire = require("minimatch");

test("patched matcher supports the glob behavior required by the existing lint tools", () => {
  const cases = [
    ["src/app/page.tsx", "src/**/*.{ts,tsx}", {}, true],
    ["src/app/page.js", "src/**/*.{ts,tsx}", {}, false],
    ["src/.cache/page.ts", "src/**/*.ts", {}, false],
    ["src/.cache/page.ts", "src/**/*.ts", { dot: true }, true],
    ["src/app/page.tsx", "*.tsx", { matchBase: true }, true],
    ["Page.TSX", "*.tsx", { nocase: true }, true],
    ["#comment", "#comment", {}, false],
    ["#literal", "#literal", { nocomment: true }, true],
    ["src/app/page.tsx", "!**/*.js", {}, true],
    ["src/app/page.js", "!**/*.js", {}, false],
    ["src/app/page.tsx", "src/**/page.?s?(x)", {}, true],
  ];
  for (const [file, pattern, options, expected] of cases) {
    for (const match of [legacyRequire, legacyImport, minimatch]) {
      assert.equal(match(file, pattern, options), expected, `${file}: ${pattern}`);
    }
    assert.equal(new Minimatch(pattern, options).match(file), expected);
    assert.equal(new legacyRequire.Minimatch(pattern, options).match(file), expected);
  }
  assert.deepEqual(["a.ts", "b.js"].filter(legacyRequire.filter("*.ts")), ["a.ts"]);
  assert.deepEqual(legacyImport.match(["a.ts", "b.js"], "*.ts"), ["a.ts"]);
  assert.deepEqual(legacyRequire.braceExpand("*.{ts,tsx}"), ["*.ts", "*.tsx"]);
  assert.equal(legacyRequire.defaults({ nocase: true })("PAGE.TSX", "*.tsx"), true);
});

test("actual ESLint configuration still detects React hooks, Next.js and TypeScript problems", async () => {
  const eslint = new ESLint();
  const [invalid] = await eslint.lintText(`
    import { useEffect } from "react";
    export function Unsafe({ enabled }: { enabled: boolean }) {
      if (enabled) useEffect(() => {}, []);
      const unused: any = 1;
      return <img src="/demo.png" alt="Demo" />;
    }
  `, { filePath: "src/components/security-compat-fixture.tsx" });
  const rules = new Set(invalid.messages.map((message) => message.ruleId));
  for (const rule of ["react-hooks/rules-of-hooks", "@typescript-eslint/no-explicit-any", "@typescript-eslint/no-unused-vars", "@next/next/no-img-element"]) {
    assert.ok(rules.has(rule), `${rule} must remain active`);
  }
  const [valid] = await eslint.lintText('export function Safe() { return <button type="button">Pause</button>; }', {
    filePath: "src/components/security-compat-fixture.tsx",
  });
  assert.equal(valid.errorCount, 0);
  assert.equal(valid.warningCount, 0);
});

test("adversarial glob preprocessing respects the upstream expansion budget", () => {
  execFileSync(process.execPath, ["--max-old-space-size=128", "--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    import { Minimatch } from 'minimatch';
    for (const count of [16, 32, 64, 96]) {
      const matcher = new Minimatch('a/**/../'.repeat(count) + 'target.ts', {
        optimizationLevel: 2, braceExpandMax: 64,
      });
      assert.ok(matcher.set.length <= 64);
      matcher.match('a/target.ts');
    }
  `], { cwd: process.cwd(), timeout: 3000, stdio: "pipe" });
});
