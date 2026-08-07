---
name: on-submit
description: >-
  Submit-phase reading guide for a change set. Use when reviewing diffs, or before
  commit or merge.
---

# On Submit

**Default:** explain and orient; **do not edit** unless the human asks after the guide.

## Required criteria

Before surveying, read [`shared/minimal-diff.md`](shared/minimal-diff.md).

## Steps

### Survey

**Done when:** enough evidence for the four blocks below, without whole-file dumps.

- **Narrow → Extract → Evidence**: locate (`path:line` / symbol), extract slices, answer from evidence.
- Note claimed task, touched surfaces, and likely Necessity / Alignment / Noise violations in [`shared/minimal-diff.md`](shared/minimal-diff.md).

### Emit guide

**Done when:** the human can tell what to read first, why those surfaces changed, and what still feels unsafe—and all four blocks are present.

- **Task restatement** — claimed outcome (not a file list)
- **Map** — touched files/symbols; one line why (`path:line` when possible)
- **Primary path** — 1–3 anchors to read first
- **Risks** — unproven areas; personal checks; check the existing diff against Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md) and name violations

Do not silently clean up drive-by hunks unless asked.

## Out of scope

- Write-phase editing → **on-write**
- Hard merge gates
- Full adversarial review unless asked
- Product-repo narrative docs unless asked
