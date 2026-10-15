#!/usr/bin/env node
/**
 * Vendor check / update tool for `vendor/matt-prototype` (upstream: mattpocock/skills).
 *
 * Modes (at most one; default is --check):
 *   --check                  Offline. Verify the lock against the local origin files (sha256, size and
 *                            the declared git blob sha1), verify the generated reading copies and the
 *                            generated pin block in UPSTREAM.md reproduce, verify the reading path has
 *                            no broken links, and run the discovery guards. Fails when any *declared*
 *                            identity does not match.
 *   --discovery              Run pi's real skill discovery against this skill and its parent, and assert
 *                            the vendor tree registers no second skill. Fails loudly if pi's loader
 *                            cannot be located (no silent pass).
 *   --upstream[=REF]         Network, dry-run only: fetch REF (default: the locked ref) and report drift
 *                            against the lock. NEVER writes. Exit 1 when anything drifted.
 *   --adopt=REF              Network, explicit write: fetch REF, verify the license, rewrite origin/ +
 *                            upstream.lock.json and regenerate every generated layer. Updates every
 *                            identity field it can re-verify and NULLS the ones it cannot, so the lock
 *                            never mixes a new ref with stale metadata. Hand-written prose is flagged,
 *                            not rewritten.
 *   --generate               Regenerate the reading copies and the UPSTREAM.md pin block from origin/ + lock.
 *
 * Network access goes through curl. Pass --proxy=<url> or set HTTPS_PROXY / HTTP_PROXY.
 * This tool never tracks upstream automatically: nothing here runs on its own, and --adopt must be
 * told an explicit ref.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(scriptDir, "..");
const vendorDir = join(skillDir, "vendor", "matt-prototype");
const lockPath = join(vendorDir, "upstream.lock.json");
const upstreamDoc = join(vendorDir, "UPSTREAM.md");
const referenceDir = join(vendorDir, "reference");
const SKILL_NAME = "engineering-workflow";

/**
 * The readable reading set. One entry per upstream file that a human reads; `origin/` stays as the
 * verbatim archive. `originPath` is the byte-identical archive file, `outPath` the generated copy.
 */
const READING_SET = [
  { originPath: "origin/SKILL.md.origin", outPath: "reference/prototype-guidance.md", upstreamFile: "skills/engineering/prototype/SKILL.md", heading: "Prototype — vendored upstream reference" },
  { originPath: "origin/LOGIC.md", outPath: "reference/logic-prototype.md", upstreamFile: "skills/engineering/prototype/LOGIC.md", heading: "Logic prototype — vendored upstream reference" },
  { originPath: "origin/UI.md", outPath: "reference/ui-prototype.md", upstreamFile: "skills/engineering/prototype/UI.md", heading: "UI prototype — vendored upstream reference" },
];
/** Upstream relative link target -> its counterpart inside `reference/`. */
const LINK_TARGETS = { "SKILL.md": "prototype-guidance.md", "LOGIC.md": "logic-prototype.md", "UI.md": "ui-prototype.md" };

const PIN_BEGIN = "<!-- BEGIN GENERATED:upstream-pin — written by scripts/vendor-check.mjs --generate; do not edit by hand. -->";
const PIN_END = "<!-- END GENERATED:upstream-pin -->";

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a === name || a.startsWith(`${name}=`));
const flagValue = (name) => {
  const hit = flag(name);
  return hit && hit.includes("=") ? hit.slice(hit.indexOf("=") + 1) : null;
};
const proxy = flagValue("--proxy") ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? process.env.HTTP_PROXY ?? process.env.http_proxy ?? null;

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
/** git's own object id for a blob: sha1("blob <len>\0" + content). */
const gitBlobSha1 = (buf) => createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");
const readLock = () => JSON.parse(readFileSync(lockPath, "utf8"));

const results = [];
const discoveryResults = [];
const record = (ok, label, detail = "", group = "main") => {
  const row = { ok, label, detail };
  if (group === "discovery") discoveryResults.push(row);
  else results.push(row);
  console.log(`${ok === true ? "PASS" : ok === null ? "UNVERIFIED" : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`);
};

// ---------------------------------------------------------------- generated layers

function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").replace(/^\s+/, "");
}

/** Only bare `SKILL.md` / `LOGIC.md` / `UI.md` targets are rewritten; anything else is left alone and
 *  is then caught by the reading-path link check rather than silently mangled. */
function rewriteLinks(text) {
  return text.replace(/\]\((SKILL|LOGIC|UI)\.md\)/g, (whole, base) => {
    const target = LINK_TARGETS[`${base}.md`];
    return `](${target ?? `${base}.md`})`;
  });
}

function renderReadingCopy(lock, spec) {
  const entry = lock.files.find((f) => f.localPath === spec.originPath);
  if (!entry) throw new Error(`lock has no entry for ${spec.originPath}`);
  const self = spec.outPath.split("/").pop();
  const siblings = READING_SET.map((s) => s.outPath.split("/").pop()).filter((n) => n !== self);
  const raw = readFileSync(join(vendorDir, spec.originPath), "utf8");
  const body = rewriteLinks(stripFrontmatter(raw));
  const header = [
    "<!-- Generated by skills/engineering-workflow/scripts/vendor-check.mjs --generate. Do not edit by hand. -->",
    "",
    `# ${spec.heading}`,
    "",
    `Reading copy of \`${spec.upstreamFile}\` from [mattpocock/skills](${lock.repo}) @ \`${lock.ref}\`.`,
    "The YAML frontmatter is removed and relative links are rewritten, so this file is neither a",
    "broken link nor a pi skill entry. The bytes it came from:",
    `[../${spec.originPath}](../${spec.originPath}) (sha256 \`${entry.sha256}\`, ${entry.bytes} bytes).`,
    "",
    `Also in this reading set: ${siblings.map((n) => `[${n}](${n})`).join(" · ")}.`,
    `License: ${lock.license.spdx ?? "see LICENSE"} — [../LICENSE](../LICENSE).`,
    "",
    "---",
    "",
  ].join("\n");
  return header + body;
}

const cell = (v) => (v === null || v === undefined || v === "" ? "_(not verified)_" : String(v).replace(/\|/g, "\\|"));
const shortHash = (v, n = 16) => (v ? v.slice(0, n) : "(none)");

function renderPinBlock(lock) {
  const lines = [
    PIN_BEGIN,
    "",
    "| | |",
    "|---|---|",
    `| Repo | <${lock.repo}> |`,
    `| Path | \`${lock.upstreamPath}\` |`,
    `| Ref | \`${lock.refKind}\` \`${cell(lock.ref)}\` on \`${cell(lock.refBranch)}\` |`,
    `| Commit date / subject | ${cell(lock.refCommitDate)} — ${cell(lock.refCommitSubject)} |`,
    `| Upstream plugin version at that ref | ${cell(lock.upstreamPluginVersion)} |`,
    `| Retrieved | ${cell(lock.retrieved)} |`,
    `| License | **${cell(lock.license.spdx)}** — [\`${lock.license.localPath}\`](${lock.license.localPath}), ${cell(lock.license.bytes)} bytes, ${cell(lock.license.copyright)} |`,
    `| License identity | sha256 \`${cell(lock.license.sha256)}\`, git blob \`${cell(lock.license.gitBlobSha1)}\` |`,
    "",
    "| Upstream file | Verbatim archive | Reading copy | sha256 | git blob sha1 | Bytes |",
    "|---|---|---|---|---|---|",
  ];
  for (const f of lock.files) {
    const spec = READING_SET.find((s) => s.originPath === f.localPath);
    const readLink = spec ? `[\`${spec.outPath}\`](${spec.outPath})` : "_(not in the reading set)_";
    lines.push(`| \`${f.upstreamPath.replace(`${lock.upstreamPath}/`, "")}\` | [\`${f.localPath}\`](${f.localPath}) | ${readLink} | \`${shortHash(f.sha256)}\` | \`${shortHash(f.gitBlobSha1)}\` | ${cell(f.bytes)} |`);
  }
  lines.push("", `_sha256 and git blob sha1 shown truncated to 16 hex; full values in [\`upstream.lock.json\`](upstream.lock.json)._\n`, PIN_END);
  return lines.join("\n");
}

function writeGenerated(lock) {
  mkdirSync(referenceDir, { recursive: true });
  const written = [];
  for (const spec of READING_SET) {
    const path = join(vendorDir, spec.outPath);
    writeFileSync(path, renderReadingCopy(lock, spec));
    written.push(relative(skillDir, path));
  }
  const text = readFileSync(upstreamDoc, "utf8");
  const begin = text.indexOf(PIN_BEGIN);
  const end = text.indexOf(PIN_END);
  if (begin === -1 || end === -1) throw new Error(`${relative(skillDir, upstreamDoc)} is missing the generated pin markers`);
  writeFileSync(upstreamDoc, text.slice(0, begin) + renderPinBlock(lock) + text.slice(end + PIN_END.length));
  written.push(relative(skillDir, upstreamDoc));
  return written;
}

function checkGenerated(lock) {
  for (const spec of READING_SET) {
    const buf = existsSync(join(vendorDir, spec.outPath)) ? readFileSync(join(vendorDir, spec.outPath), "utf8") : null;
    const expected = renderReadingCopy(lock, spec);
    record(buf === expected, `generated ${spec.outPath} reproduces`, buf === null ? "missing" : buf === expected ? "matches a fresh generation" : "out of date — run --generate");
  }
  const doc = readFileSync(upstreamDoc, "utf8");
  const begin = doc.indexOf(PIN_BEGIN);
  const end = doc.indexOf(PIN_END);
  if (begin === -1 || end === -1) {
    record(false, "generated UPSTREAM.md pin block reproduces", "generated pin markers missing");
  } else {
    const actual = doc.slice(begin, end + PIN_END.length);
    record(actual === renderPinBlock(lock), "generated UPSTREAM.md pin block reproduces", actual === renderPinBlock(lock) ? "pin info matches the lock" : "out of date — run --generate");
  }
}

/** The pin block is generated from the lock, but the prose around it names refs by hand. A ref that
 *  is neither the pinned one nor the recorded installed-copy ref is a stale claim after an --adopt, so
 *  it fails here instead of quietly ageing. */
function checkUpstreamDocRefs(lock) {
  const text = readFileSync(upstreamDoc, "utf8");
  const begin = text.indexOf(PIN_BEGIN);
  const end = text.indexOf(PIN_END);
  const prose = begin === -1 || end === -1 ? text : text.slice(0, begin) + text.slice(end + PIN_END.length);
  const allowed = new Set([lock.ref, lock.context?.installedGlobalCopyRef].filter(Boolean));
  const foreign = [];
  prose.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/\b[0-9a-f]{40}\b/g)) if (!allowed.has(m[0])) foreign.push(`line ${i + 1}: ${m[0]}`);
  });
  record(
    foreign.length === 0,
    "UPSTREAM.md prose names no ref outside the pin",
    foreign.length === 0 ? `allowed: ${[...allowed].map((s) => s.slice(0, 8)).join(", ") || "(none)"}` : `${foreign.join("; ")} — update the prose after an --adopt`,
  );
}

/** The reading path must be walkable: every relative link under reference/ resolves, and UPSTREAM.md
 *  reaches every reading copy. Broken links inside origin/ are the archived primary source and are
 *  reported as such, not counted as failures. */
function checkReadingPath() {
  const broken = [];
  for (const name of readdirSync(referenceDir)) {
    if (!name.endsWith(".md")) continue;
    for (const m of readFileSync(join(referenceDir, name), "utf8").matchAll(/\]\(([^)#]+)\)/g)) {
      const target = m[1];
      if (/^[a-z]+:/i.test(target)) continue;
      if (!existsSync(resolve(referenceDir, target))) broken.push(`${name} -> ${target}`);
    }
  }
  record(broken.length === 0, "reading-path links resolve", broken.join("; ") || `all links under reference/ resolve`);

  const doc = readFileSync(upstreamDoc, "utf8");
  const unreachable = READING_SET.filter((s) => !doc.includes(`](${s.outPath})`)).map((s) => s.outPath);
  record(unreachable.length === 0, "UPSTREAM.md reaches every reading copy", unreachable.join(", ") || READING_SET.map((s) => s.outPath).join(", "));

  const originDir = join(vendorDir, "origin");
  const archived = [];
  for (const spec of READING_SET) {
    const file = join(vendorDir, spec.originPath);
    for (const m of readFileSync(file, "utf8").matchAll(/\]\(([^)#]+)\)/g)) {
      const target = m[1];
      if (!target.endsWith(".md")) continue;
      if (!existsSync(resolve(dirname(file), target))) archived.push(`${spec.originPath} -> ${target}`);
    }
  }
  if (archived.length > 0) record(null, "origin/ link deltas (archive exception)", `${archived.join("; ")} — the archive keeps upstream's own targets; read the copies under reference/, not these`);
}

// ---------------------------------------------------------------- structural discovery guard

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function hasSkillDescription(path) {
  const text = readFileSync(path, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return Boolean(m && /^description:\s*\S/m.test(m[1]));
}

function structuralGuard() {
  const own = join(skillDir, "SKILL.md");
  const files = walk(skillDir);
  const straySkillMd = files.filter((f) => f !== own && f.split(/[\\/]/).pop() === "SKILL.md");
  record(
    straySkillMd.length === 0,
    "no stray SKILL.md under the skill",
    straySkillMd.map((f) => relative(skillDir, f)).join(", ") || "only the entry itself",
  );
  const strayDescriptions = files.filter((f) => f !== own && f.endsWith(".md") && hasSkillDescription(f));
  record(
    strayDescriptions.length === 0,
    "no other .md carrying a skill description",
    strayDescriptions.map((f) => relative(skillDir, f)).join(", ") || "none",
  );
}

// ---------------------------------------------------------------- real pi discovery

function findPiSkillsModule() {
  if (process.env.PI_SKILLS_MODULE) return process.env.PI_SKILLS_MODULE;
  let dir = skillDir;
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(dir, "node_modules", "@earendil-works", "pi-coding-agent", "dist", "core", "skills.js");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

async function discoveryGuard() {
  const modulePath = findPiSkillsModule();
  if (!modulePath) {
    record(null, "pi discovery", "pi's skills loader not found — set PI_SKILLS_MODULE to verify", "discovery");
    return;
  }
  const { loadSkillsFromDir } = await import(pathToFileURL(modulePath).href);
  const own = loadSkillsFromDir({ dir: skillDir, source: "path" });
  const ownNames = own.skills.map((s) => s.name);
  record(
    ownNames.length === 1 && ownNames[0] === SKILL_NAME,
    "scanning the skill dir yields exactly one entry",
    `found: ${ownNames.join(", ") || "(none)"}`,
    "discovery",
  );

  // Mirror the real install: the scanned root is ~/.agents/skills, one directory per skill.
  const installRoot = dirname(skillDir);
  const install = loadSkillsFromDir({ dir: installRoot, source: "path" });
  const fromVendor = install.skills.filter((s) => resolve(s.filePath).startsWith(resolve(vendorDir)));
  record(
    install.skills.some((s) => s.name === SKILL_NAME) && fromVendor.length === 0,
    "scanning the install root yields no vendor entry",
    `found: ${install.skills.map((s) => s.name).join(", ") || "(none)"}`,
    "discovery",
  );
}

// ---------------------------------------------------------------- network

function curl(url) {
  const argv = ["-sS", "--fail", "--max-time", "60"];
  if (proxy) argv.push("-x", proxy);
  argv.push(url);
  try {
    return execFileSync("curl", argv, { maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`curl failed for ${url}: ${stderr}`);
  }
}

const rawUrl = (ref, path) => `https://raw.githubusercontent.com/mattpocock/skills/${ref}/${path}`;
const repoUrl = "https://github.com/mattpocock/skills";

/**
 * Resolve a branch/tag name to a commit sha with `git ls-remote` (no API rate limit).
 * A 40-hex ref is already a commit and is returned as-is.
 */
function resolveRef(ref) {
  if (/^[0-9a-f]{40}$/.test(ref)) return ref;
  const argv = [];
  if (proxy) argv.push("-c", `http.proxy=${proxy}`);
  argv.push("ls-remote", repoUrl, `refs/heads/${ref}`, `refs/tags/${ref}`, `refs/tags/${ref}^{}`);
  let out;
  try {
    out = execFileSync("git", argv, { encoding: "utf8" });
  } catch (error) {
    throw new Error(`cannot resolve ref "${ref}": git ls-remote failed (${error.message.trim().split("\n").pop()}). Pass a 40-character commit sha, or set a proxy with --proxy.`);
  }
  const peeled = out.split("\n").find((l) => l.endsWith("^{}"));
  const first = peeled ?? out.split("\n").find((l) => l.trim());
  if (!first) throw new Error(`cannot resolve ref "${ref}": not a branch or tag of ${repoUrl}`);
  return first.split(/\s+/)[0];
}

function lineDiff(a, b) {
  const left = a.toString("utf8").split(/\r?\n/);
  const right = b.toString("utf8").split(/\r?\n/);
  const max = Math.max(left.length, right.length);
  const hunks = [];
  for (let i = 0; i < max && hunks.length < 12; i += 1) {
    if (left[i] !== right[i]) hunks.push(`  line ${i + 1}\n    upstream: ${trunc(left[i])}\n    local   : ${trunc(right[i])}`);
  }
  const changed = left.filter((l, i) => l !== right[i]).length + right.filter((l, i) => l !== left[i]).length;
  return { changed, hunks };
}
const trunc = (s) => (s === undefined ? "(absent)" : s.length > 160 ? `${s.slice(0, 157)}...` : s);

function fetchUpstream(ref) {
  const lock = readLock();
  const sha = resolveRef(ref);
  const files = new Map();
  for (const file of lock.files) files.set(file.upstreamPath, curl(rawUrl(sha, file.upstreamPath)));
  return { sha, license: curl(rawUrl(sha, lock.license.repoPath)), files };
}

/**
 * Commit date and subject without the GitHub API (which rate-limits anonymous callers):
 * the mail headers of the commit's own patch. Throws when unavailable, so callers can null the
 * fields instead of keeping a stale claim.
 */
function fetchCommitMeta(sha) {
  const text = curl(`https://github.com/mattpocock/skills/commit/${sha}.patch`).toString("utf8");
  const head = text.split(/\n(?=diff --git )/)[0];
  // RFC 5322 header folding: a line starting with whitespace continues the previous header.
  const unfolded = head.replace(/\n[ \t]+/g, " ");
  const date = unfolded.match(/^Date:\s*(.+)$/m)?.[1]?.trim() ?? null;
  const subject = unfolded.match(/^Subject:\s*\[PATCH[^\]]*\]\s*(.+)$/m)?.[1]?.trim() ?? null;
  if (!date || !subject) throw new Error("commit patch had no Date/Subject header");
  return { date: new Date(date).toISOString(), subject };
}

function fetchPluginVersion(sha) {
  const json = JSON.parse(curl(rawUrl(sha, ".claude-plugin/plugin.json")).toString("utf8"));
  if (!json.version) throw new Error(".claude-plugin/plugin.json declares no version");
  return json.version;
}

const LICENSE_SNIFF = [
  { spdx: "MIT", test: (t) => /^MIT License\s*$/m.test(t) && /Permission is hereby granted, free of charge/.test(t) },
  { spdx: "Apache-2.0", test: (t) => /Apache License/.test(t) && /Version 2\.0/.test(t) },
  { spdx: "BSD-3-Clause", test: (t) => /Redistribution and use in source and binary forms/.test(t) && /Neither the name/.test(t) },
];
/** Best-effort SPDX name; null means "record it by hand", never a guess. */
function sniffLicense(buf) {
  const text = buf.toString("utf8");
  return LICENSE_SNIFF.find((l) => l.test(text))?.spdx ?? null;
}
function sniffCopyright(buf) {
  return buf.toString("utf8").match(/^Copyright[^\n]*$/m)?.[0]?.trim() ?? null;
}

// ---------------------------------------------------------------- modes

function check() {
  const lock = readLock();
  record(Boolean(lock.ref) && Boolean(lock.license?.spdx), "lock declares ref and license", `${lock.ref ?? "(no ref)"} / ${lock.license?.spdx ?? "(no license)"}`);

  for (const file of lock.files) {
    const path = join(vendorDir, file.localPath);
    if (!existsSync(path)) {
      record(false, `origin ${file.localPath}`, "missing");
      continue;
    }
    const buf = readFileSync(path);
    const sha = sha256(buf);
    const blob = gitBlobSha1(buf);
    record(sha === file.sha256 && buf.length === file.bytes, `origin ${file.localPath}`, `${sha} (${buf.length} bytes)`);
    if (file.gitBlobSha1 == null) record(null, `origin ${file.localPath} git blob`, "not declared in the lock");
    else record(blob === file.gitBlobSha1, `origin ${file.localPath} git blob`, `${blob}${blob === file.gitBlobSha1 ? "" : ` declared ${file.gitBlobSha1}`}`);
  }

  const licensePath = join(vendorDir, lock.license.localPath);
  const licenseBuf = existsSync(licensePath) ? readFileSync(licensePath) : Buffer.alloc(0);
  record(sha256(licenseBuf) === lock.license.sha256, `license ${lock.license.localPath}`, `${lock.license.spdx}, ${licenseBuf.length} bytes`);
  if (lock.license.gitBlobSha1 == null) record(null, `license ${lock.license.localPath} git blob`, "not declared in the lock");
  else record(gitBlobSha1(licenseBuf) === lock.license.gitBlobSha1, `license ${lock.license.localPath} git blob`, gitBlobSha1(licenseBuf));

  for (const field of ["refCommitDate", "refCommitSubject", "upstreamPluginVersion"]) {
    if (!lock[field]) record(null, `lock ${field}`, "not verified for this ref (null, never a stale claim)");
  }

  checkGenerated(lock);
  checkUpstreamDocRefs(lock);
  checkReadingPath();
}

async function main() {
  const wantAdopt = flagValue("--adopt");
  const wantUpstream = flag("--upstream");
  const wantGenerate = flag("--generate");
  const wantDiscovery = flag("--discovery");

  if (wantGenerate) {
    for (const path of writeGenerated(readLock())) console.log(`wrote ${path}`);
    return;
  }

  if (wantAdopt) {
    const lock = readLock();
    // Fetch everything first: nothing is written until the network data is in hand.
    const upstream = fetchUpstream(wantAdopt);
    console.log(`adopting ${upstream.sha} (from ${wantAdopt})`);

    const licenseSha = sha256(upstream.license);
    const licenseChanged = licenseSha !== lock.license.sha256;
    if (licenseChanged && !flag("--allow-license-change")) {
      console.error("BLOCKER: the upstream LICENSE differs from the recorded one; nothing was written.");
      console.error(upstream.license.toString("utf8").split("\n").slice(0, 3).join("\n"));
      console.error("Re-run with --allow-license-change after reading it.");
      process.exit(1);
    }

    // Optional metadata: on failure the field is nulled, never left claiming the old ref.
    let meta = null;
    try { meta = fetchCommitMeta(upstream.sha); } catch (error) { console.warn(`note: commit metadata unavailable (${error.message}) — refCommitDate/refCommitSubject will be null.`); }
    let pluginVersion = null;
    try { pluginVersion = fetchPluginVersion(upstream.sha); } catch (error) { console.warn(`note: upstreamPluginVersion unavailable (${error.message}) — it will be null.`); }

    let changed = 0;
    for (const file of lock.files) {
      const buf = upstream.files.get(file.upstreamPath);
      const localPath = join(vendorDir, file.localPath);
      const before = existsSync(localPath) ? sha256(readFileSync(localPath)) : null;
      writeFileSync(localPath, buf);
      if (before !== sha256(buf)) changed += 1;
      file.sha256 = sha256(buf);
      file.bytes = buf.length;
      file.gitBlobSha1 = gitBlobSha1(buf);
    }

    writeFileSync(join(vendorDir, lock.license.localPath), upstream.license);
    lock.license.sha256 = licenseSha;
    lock.license.bytes = upstream.license.length;
    lock.license.gitBlobSha1 = gitBlobSha1(upstream.license);
    lock.license.copyright = sniffCopyright(upstream.license);
    const sniffed = sniffLicense(upstream.license);
    if (sniffed === null) {
      console.warn("note: the license text was not recognised — license.spdx set to null; record it by hand.");
      lock.license.spdx = null;
    } else {
      lock.license.spdx = sniffed;
    }

    lock.ref = upstream.sha;
    lock.refKind = "commit";
    lock.retrieved = new Date().toISOString().slice(0, 10);
    lock.refCommitDate = meta?.date ?? null;
    lock.refCommitSubject = meta?.subject ?? null;
    lock.upstreamPluginVersion = pluginVersion;

    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
    for (const path of writeGenerated(readLock())) console.log(`wrote ${path}`);
    console.log(`adopted: ${changed} of ${lock.files.length} origin files changed; lock and all generated layers rewritten.`);
    console.log("Now review the hand-written prose in UPSTREAM.md: it names refs and adaptation notes that an --adopt does not rewrite. --check fails until it is consistent again.");
    return;
  }

  if (wantUpstream) {
    const lock = readLock();
    const ref = flagValue("--upstream") ?? lock.ref;
    const upstream = fetchUpstream(ref);
    console.log(`comparing ${upstream.sha} (${ref}) against the lock`);
    let drift = 0;
    if (sha256(upstream.license) !== lock.license.sha256) {
      console.log("CHANGED  LICENSE");
      drift += 1;
    }
    for (const file of lock.files) {
      const buf = upstream.files.get(file.upstreamPath);
      const upstreamSha = sha256(buf);
      const localPath = join(vendorDir, file.localPath);
      const localBuf = existsSync(localPath) ? readFileSync(localPath) : null;
      const localSha = localBuf ? sha256(localBuf) : null;
      if (upstreamSha !== file.sha256) {
        drift += 1;
        const d = lineDiff(buf, localBuf ?? Buffer.alloc(0));
        console.log(`CHANGED upstream  ${file.upstreamPath}  (${d.changed} lines differ from the pinned copy)`);
        for (const h of d.hunks) console.log(h);
      } else if (localSha !== file.sha256) {
        drift += 1;
        console.log(`MODIFIED local    ${file.localPath}  (upstream is unchanged; this copy was edited — revert or re-adopt)`);
      } else {
        console.log(`unchanged ${file.upstreamPath}`);
      }
    }
    if (drift === 0) console.log("no upstream drift at this ref");
    else console.log(`drift: ${drift} file(s). Review, then adopt deliberately with --adopt=<ref>.`);
    process.exit(drift === 0 ? 0 : 1);
  }

  check();
  structuralGuard();
  await discoveryGuard();
  if (wantDiscovery) {
    const failed = discoveryResults.some((r) => r.ok === false || r.ok === null);
    process.exit(failed || results.some((r) => r.ok === false) ? 1 : 0);
  }
  process.exit(results.some((r) => r.ok === false) ? 1 : 0);
}

await main().catch((error) => {
  console.error(`FAIL  ${error.message}`);
  process.exit(1);
});
