# Vendored: Matt Pocock's `prototype` skill

Thin adapter around a pinned upstream copy. This directory is a **reference**, reached on demand
from [`../../SKILL.md`](../../SKILL.md) when a concrete prototype artefact is what the question
needs. It is **not** a second pi skill, and it is not a required step of this skill.

## How to read it

Read the copies under [`reference/`](reference/) — they are the reading path, and every link in them
resolves:

- [`reference/prototype-guidance.md`](reference/prototype-guidance.md) — the upstream `SKILL.md` body: which question decides the shape, and the rules that apply to both branches.
- Then the branch the question belongs to: [`reference/logic-prototype.md`](reference/logic-prototype.md) (state / logic) or [`reference/ui-prototype.md`](reference/ui-prototype.md) (what it should look like).

Those three files are generated from [`origin/`](origin/) with the YAML frontmatter removed and
relative links rewritten, so they are neither pi skill entries nor broken links. Do not edit them by
hand; regenerate with `--generate`.

`origin/` is the **verbatim archive** — the bytes the lock pins, kept for provenance and diffing.
It is not the reading path: two of its files contain an upstream-relative link that no longer
resolves here (see below). Read `reference/`, not `origin/`, unless you are checking identity.

## Upstream pin

<!-- BEGIN GENERATED:upstream-pin — written by scripts/vendor-check.mjs --generate; do not edit by hand. -->

| | |
|---|---|
| Repo | <https://github.com/mattpocock/skills> |
| Path | `skills/engineering/prototype` |
| Ref | `commit` `49dd158d1076134a641b33efb035946536778336` on `main` |
| Commit date / subject | 2026-10-09T10:56:49.000Z — wizard: template fixes (#1220, #1142, #1081, #1041, #1003) (#1237) |
| Upstream plugin version at that ref | 1.3.1 |
| Retrieved | 2026-10-15 |
| License | **MIT** — [`LICENSE`](LICENSE), 1068 bytes, Copyright (c) 2026 Matt Pocock |
| License identity | sha256 `0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5`, git blob `f1dd2c09108dde1a5f56097cee8461b3ea834499` |

| Upstream file | Verbatim archive | Reading copy | sha256 | git blob sha1 | Bytes |
|---|---|---|---|---|---|
| `SKILL.md` | [`origin/SKILL.md.origin`](origin/SKILL.md.origin) | [`reference/prototype-guidance.md`](reference/prototype-guidance.md) | `714de632d116bb73` | `a0044501fe0d385b` | 2931 |
| `LOGIC.md` | [`origin/LOGIC.md`](origin/LOGIC.md) | [`reference/logic-prototype.md`](reference/logic-prototype.md) | `f61c7d249e786a79` | `32be86a0a5d9928d` | 6036 |
| `UI.md` | [`origin/UI.md`](origin/UI.md) | [`reference/ui-prototype.md`](reference/ui-prototype.md) | `723211e878acbc7b` | `3977951663490882` | 6913 |
| `agents/openai.yaml` | [`origin/agents/openai.yaml`](origin/agents/openai.yaml) | _(not in the reading set)_ | `5af65e43ab41a350` | `1618b147965bc729` | 100 |

_sha256 and git blob sha1 shown truncated to 16 hex; full values in [`upstream.lock.json`](upstream.lock.json)._

<!-- END GENERATED:upstream-pin -->

## The one local rename

The verbatim archive stores the upstream `SKILL.md` as **`origin/SKILL.md.origin`**. A file named
exactly `SKILL.md` is what pi's recursive discovery keys on, so the `.origin` extension makes it
structurally impossible for the vendored bytes to register as a skill, even if the enclosing skill
directory is reorganised. The bytes are unchanged.

That rename is why the archive's own relative links are not all walkable: inside
[`origin/LOGIC.md`](origin/LOGIC.md) (line 58) and [`origin/UI.md`](origin/UI.md) (line 100) the
upstream link labelled `SKILL` points at the target name `SKILL.md`, which does not exist in that
directory. This is the only adaptation to the archived bytes, it is an accepted exception for the
archive, and it is exactly what the generated copies under `reference/` repair. No agent should be
sent to read the archive to get the guidance.

## What we take, and what we do not promote

Taken as-is for the narrow job of building a shareable artefact: the "which question is being
answered" split, and the branch guides.

Explicitly **not** generalised into this skill's requirements — these are upstream's own choices for
throwaway artefacts, not rules of the engineering workflow:

- that a prototype must be throwaway code, or code at all;
- a single self-contained HTML file, or "one file, no framework, no bundler", as the only shape;
- "no tests, no error handling, no abstractions";
- committing the prototype to a throwaway branch, and the issue-tracker pointer convention
  (this method's projects define their own tracking and delivery);
- the plugin/marketplace and `npx skills` distribution routes.

## Checking the pin, and updating it

From this skill's directory:

```
node scripts/vendor-check.mjs --check                      # offline: lock vs origin bytes + blob ids, generated layers, reading path, discovery guards
node scripts/vendor-check.mjs --upstream                   # dry-run: is the pinned ref still the bytes we hold?
node scripts/vendor-check.mjs --upstream=main --proxy=http://127.0.0.1:7890   # dry-run: has upstream moved?
node scripts/vendor-check.mjs --adopt=<commit>             # explicit: adopt a reviewed ref and rewrite lock + archive + generated layers
node scripts/vendor-check.mjs --discovery                  # assert pi discovers only this skill, never a vendor entry
```

There is no automatic tracking. Nothing fetches upstream on its own; `--upstream` only reports drift
and exits non-zero when it finds any, and adopting requires typing the ref.

`--adopt` rewrites the lock coherently: it re-derives `sha256`, byte size and git blob sha1 for every
file and for the license, refreshes `ref`/`refCommitDate`/`refCommitSubject`/`upstreamPluginVersion`
and the SPDX name and copyright line, then regenerates every generated layer. Metadata it cannot
re-verify is set to `null` and reported — never left claiming the previous ref. A changed upstream
`LICENSE` is a blocker until it is re-read and `--allow-license-change` is passed; an unrecognised
license text leaves `license.spdx` null for a human to record.

Because the pin table above is generated from the lock, it cannot silently go stale: `--check` fails
when it no longer matches. The prose on this page is hand-written, so `--check` also fails when it
names a commit that is neither the pinned `ref` nor `context.installedGlobalCopyRef` in the lock —
that is what stops the paragraphs below from quietly describing the wrong ref after an `--adopt`.
After an `--adopt`, reread this page and fix whatever the check flags.

`--discovery` needs pi's loader. It locates
`@earendil-works/pi-coding-agent/dist/core/skills.js` by walking up from this skill, or takes
`PI_SKILLS_MODULE=<path>`; when it cannot find it, it reports `UNVERIFIED` and exits non-zero rather
than passing silently. On this machine the loader was found at
`C:/Users/wsqsy/Documents/ai/sopho-pi/node_modules/@earendil-works/pi-coding-agent/dist/core/skills.js`.

## Why this ref, and what the installed copy is

The pin above is upstream `main` at retrieval time, verified by two independent methods
(`git ls-remote refs/heads/main` and the REST API) and cross-checked byte-for-byte against the Git
tree's blob sha1s. The registry route (`npx skills add … --skill prototype`) has **no commit pin** — it
resolves the default branch at install time — so a pin is exactly what makes this copy traceable.

At the time of this pin (2026-10-15) the then-installed `~/.agents/skills/prototype` was a **clean
upstream snapshot one commit earlier**, at `e38b908fb73e4982eee85b2c6f6928e3b46fa0a6`: all four of
its files are byte-identical to that commit. It was not locally tampered with. The whole of its
difference from this pin is upstream's own commit `321658273cb1` *"Remove all em-dashes from the
repo"* (2026-08-19), which rewrote comma/colon/parenthesis punctuation as em dashes in `SKILL.md`
(7 lines, from line 12), `LOGIC.md` (17 lines, from line 3) and `UI.md` (23 lines, from line 5) — the
frontmatter, and so the registered name and description, are untouched.

**Decided 2026-10-15: pin `49dd158d1076134a641b33efb035946536778336`** — current upstream, what a
fresh install gets. The alternative considered and not taken was
`e38b908fb73e4982eee85b2c6f6928e3b46fa0a6`, byte-identical to the copy installed here at the time.
Switching later is one command:
`node scripts/vendor-check.mjs --adopt=e38b908fb73e4982eee85b2c6f6928e3b46fa0a6`.

Not vendored, but noted: upstream also carries a longer prose document at
`docs/engineering/prototype.md` (9516 bytes at the pinned ref). Add it only if a use appears.
