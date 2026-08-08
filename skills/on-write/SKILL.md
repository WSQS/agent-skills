---
name: on-write
description: >-
  Write-phase skill. Use when editing code.
---

# On Write

## Required criteria

Before any edit, read [`shared/minimal-diff.md`](shared/minimal-diff.md) and [`shared/task-split.md`](shared/task-split.md).

## Steps

### Scope

**Done when:** one outcome sentence; intended surfaces listed (or "discover then lock"); refused drive-bys named; oversized work split or explicitly kept bundled; unclear scope asked and answered.

- Restate the task (outcome, not implementation).
- Apply Single outcome / Sprawl / Deferred split in [`shared/task-split.md`](shared/task-split.md): split into sequential landings, or get an explicit human OK to bundle—before writing.
- If the whole effort is too foggy to name even the first landing (spanning more than one session, unknowns outweigh knowns), do **not** force a split—chart the decisions first. Optional, heavyweight, not vendored: Matt Pocock's **wayfinder** (install if missing; read it; do not paste it in) — https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder
- List intended surfaces, or "discover then lock".
- Name refused drive-bys (see Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md)).
- If unclear, ask before writing.

### Edit

**Done when:** working-tree changes are only those required by the scoped task.

- Touch only required files; prefer local fixes; match existing style.
- Apply Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md) continuously; do not restate their violation table here.

### Self-check

**Done when:** every hunk passes Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md); the landing still meets Single outcome in [`shared/task-split.md`](shared/task-split.md); failures reverted; ready to present.

- If the human tightens scope, strip to that boundary—do not re-argue.
- No submit-phase reading guide here → **on-submit**.

## Out of scope

- Submit-phase narrative → **on-submit**
- Hard gates (CI, propose/apply)
- Correctness beyond task fit
