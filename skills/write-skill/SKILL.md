---
name: write-skill
description: >-
  Author or revise agent skills. Use when editing SKILL.md, skill descriptions,
  or shared criteria files.
---

# Write Skill

Entry for authoring agent skills (`SKILL.md` and shared criteria).

## Required criteria

Before editing skill text, read [`shared/minimal-diff.md`](shared/minimal-diff.md) and [`shared/consistency.md`](shared/consistency.md).

## Steps

### Scope

**Done when:** the skill's job (one interface or one shared criteria file) is stated; in-scope files are listed; what this skill will not own is named.

- Name the artifact: entry skill vs `shared/` criteria.
- One job per skill; cross-cutting rules go in `shared/`, not copied into every entry.
- For general craft vocabulary, use Matt Pocock's **writing-great-skills** (install if missing; read it; do not paste it in) — https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills

### Draft

**Done when:** frontmatter and body match the checks below.

**Description (model-invoked):**
- Identity + trigger only (`Use when …`).
- No step lists, no restating the body, no synonym trigger piles.
- Do not put shared criteria names in the description unless they are the ignition word.

**Body:**
- Entry skills own **steps** with checkable **Done when** per step.
- `shared/` files state **criteria only** (statement, violations, boundaries)—no procedures.
- Prefer English in this repo's skill and shared files.
- Progressive disclosure: keep `SKILL.md` short; link details instead of inlining textbooks.
- Apply Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md) while drafting; do not restate their violation table here.
- Match the structure and tone of existing skills and criteria in this repo—apply Local fit / Pattern fit / Terminology in [`shared/consistency.md`](shared/consistency.md) while drafting; do not restate its violation table here.

### Editing existing text

**Done when:** every modification of existing skill text is either an additive new line, or a changed line whose relevance to the task is explicit.

- When modifying an existing skill or criterion, prefer **adding new lines** over rewriting existing ones.
- Rewrite an existing line only when it is **directly relevant** to the stated task—state the relevance if it is not obvious.
- Do not silently broaden or shift an existing rule's meaning by editing its wording; that is a criteria change, not an edit, and should be visible as such.
- Out-of-scope wording improvements are drive-bys—Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md) still apply.

### Numbered sequences

**Done when:** every `1.` / `2.`-style numeric run in the draft has been found and either kept for a stated reason or removed.

- Search for numbered runs (`1.`, `2.`, `3.` …), including numbered headings (`### 1. …`).
- For each run: would order be unclear without the numerals?
- If document order plus Done when (or plain bullets) already fix sequence, remove the numbers.
- Keep numerals only when the reader must cite a step index, follow a fixed external checklist, or skip/jump by number.

### Self-check

**Done when:** every hunk passes Necessity / Alignment / Noise in [`shared/minimal-diff.md`](shared/minimal-diff.md); description cannot be shortened further without losing ignition; procedures are not sitting in `shared/`.

- Verify the drafted skill text passes Local fit / Pattern fit / Terminology in [`shared/consistency.md`](shared/consistency.md) against existing skills and criteria in this repo; fix divergences, or name them if intentional.
- Drop lines the model already does by default.
- Confirm entry vs criteria split.
- Confirm out-of-scope does not duplicate another entry skill's job.

## Out of scope

- Ordinary product-code edits → **on-write**
- Submit-phase reading guides → **on-submit**
- Rewriting or replacing **writing-great-skills** itself
