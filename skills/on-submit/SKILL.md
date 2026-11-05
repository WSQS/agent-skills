---
name: on-submit
description: >-
  Submit-phase reading guide for a change set. Use when reviewing diffs, or before
  commit or merge.
---

# On Submit

**Default:** explain and orient; **do not edit** unless the human asks after the guide.

## Required criteria

Before surveying, read [`shared/minimal-diff.md`](shared/minimal-diff.md) and [`shared/consistency.md`](shared/consistency.md).

## Steps

### Survey

**Done when:** enough evidence for the guide and later checks, without whole-file dumps.

- **Narrow → Extract → Evidence**: locate (`path:line` / symbol), extract slices, answer from evidence.
- Note claimed task, touched surfaces, and likely Necessity / Alignment / Noise violations in [`shared/minimal-diff.md`](shared/minimal-diff.md).

### Emit guide

**Done when:** the human can tell what to read first, why those surfaces changed, and what still feels unsafe—and all four blocks are present.

- **Task restatement** — claimed outcome (not a file list)
- **Map** — touched files/symbols; one line why (`path:line` when possible)
- **Primary path** — 1–3 anchors to read first
- **Risks** — unproven areas; personal checks; check the existing diff against Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md) and name violations

Do not silently clean up drive-by hunks unless asked.

### Doc code consistency

**Done when:** it is clear whether related docs match the change—and any gaps or contradictions are named with evidence (or explicitly "no doc surface in scope").

- Reuse Survey evidence; do not re-dump the tree.
- Ask: given the claimed task and touched code/config, which docs (README, CONTEXT, design notes, contract-like comments, skill text, etc.) ought to stay true?
- Check touched or nearby docs for stale claims, missing mentions of new behavior, or contradictions with the diff.
- Report findings after the guide (aligned / stale / missing / N/A, with `path:line` when possible). Do not invent a doc rewrite unless the human asks.

### Test coverage

**Done when:** it is clear whether the change's behavior is exercised by tests—and any gaps are named with evidence (or explicitly "no test surface in scope").

- Reuse Survey evidence; do not re-dump the tree.
- Ask: given the claimed task and touched code/config, which behaviors ought to be covered by tests?
- Check for nearby or conventional tests: missing coverage of new/changed behavior, tests not updated with the diff, or obvious untested paths on the primary path.
- If the repo already has a coverage report or a cheap, established coverage command, cite its signal when it helps; do not treat a percentage gate as required.
- Report findings after the guide (covered / gaps / missing / N/A, with `path:line` or test names when possible).
- **Default disposition for gaps:** recommend a **new issue + PR** to add or expand tests—do not fold that work into this landing. Exceptions only when the human explicitly asks to bundle tests here, or the stated task itself requires co-landing tests (without them the outcome is incomplete).

### Convention consistency

**Done when:** it is clear whether the change follows the conventions already in force—and any divergences are named with evidence, and any convention docs the repo ought to have are either present or flagged as missing (or explicitly "no surface with an established convention in scope").

- Reuse Survey evidence; do not re-dump the tree.
- Ask: does the repo carry authoritative convention docs for the touched surfaces (style guide, CONTRIBUTING, lint config, etc.)? If yes, check the change against the **writing** first; if no, fall back to nearest neighbors and note that the repo is relying on inference.
- Ask: do the touched code or docs match the naming, style, structure, patterns, and terminology of those authoritative docs or, failing that, their nearest neighbors? Check Local fit / Pattern fit / Terminology in [`shared/consistency.md`](shared/consistency.md).
- If a convention doc seems due but missing (e.g., multi-contributor repo with no CONTRIBUTING, code with no lint config), flag it as a gap—do not draft it here.
- Report findings after the guide (fits / diverges / missing-doc / N/A, with `path:line` when possible). Do not propose a convention migration unless the human asks.

### Logging

**Done when:** it is clear whether the change's logging is about right—and any under- or over-logging is named with evidence (or explicitly "no logging surface in scope").

- Reuse Survey evidence; do not re-dump the tree.
- Ask: given the changed behavior, are the key paths (entry, branching, failure) actually logged, and are the logs there pulling their weight?
- **Under-logging:** a new/changed path that fails or branches silently—nothing in the diff would leave a trace when it goes wrong.
- **Over-logging:** chatty logs in previously quiet paths, redundant logging of the same event, or logs that just narrate normal flow as noise.
- Report findings after the guide (right / thin / chatty / N/A, with `path:line` when possible). Do not rewrite logging here unless the human asks.

### Static verification

**Done when:** relevant project-established static checks have a recorded result—or their absence, unavailability, or disproportionate cost is explicit.

- Reuse Survey and Convention consistency evidence. Discover commands from repo instructions and contribution docs, then CI/hooks/task runners/package scripts, then manifests, lockfiles, and tool config, then the nearest established command.
- Run the smallest relevant, reasonably cheap, non-mutating checks: syntax/parse/compile, lint, format check, type check, and build/check. Keep behavioral tests under Test coverage; if one aggregate command includes both, run it once and classify its signals.
- Prefer the project-local or pinned toolchain. Do not install tools, update dependencies or locks, format, auto-fix, or create config unless the human explicitly asks.
- Report each command as pass / fail / not run, including the exact command, tool version, configuration source, and whether the signal is project-established or advisory. Distinguish syntax failures from configured lint failures.
- Treat failures as review evidence, not hard merge gates. Do not fix them unless the human asks.

Further submit-phase checks follow this same slot: **after Emit guide**, each as its own step, report-only unless asked to fix.

## Out of scope

- Write-phase editing → **on-write**
- Hard merge gates
- Full adversarial review unless asked
- Authoring or rewriting product narrative docs unless asked after the guide
- Filling test gaps in this landing (default: separate issue + PR) unless an exception above applies
