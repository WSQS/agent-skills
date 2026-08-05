---
name: on-write
description: >-
  Write-phase skill. Use when editing code.
---

# On Write

## Required principle

Before any edit, read [`shared/minimal-diff.md`](shared/minimal-diff.md) and keep applying it until the write is done.

## Steps

### Scope

**Done when:** one outcome sentence; intended surfaces listed (or "discover then lock"); refused drive-bys named; unclear scope asked and answered.

- Restate the task (outcome, not implementation).
- List intended surfaces, or "discover then lock".
- Name refused drive-bys (see the principle).
- If unclear, ask before writing.

### Edit

**Done when:** working-tree changes are only those required by the scoped task.

- Touch only required files; prefer local fixes; match existing style.
- Apply the principle continuously; do not restate its violation table here.

### Self-check

**Done when:** every hunk passes Necessity / Alignment / Noise; failures reverted; ready to present.

- If the human tightens scope, strip to that boundary—do not re-argue.
- No submit-phase reading guide here → **on-submit**.

## Out of scope

- Submit-phase narrative → **on-submit**
- Hard gates (CI, propose/apply)
- Correctness beyond task fit
