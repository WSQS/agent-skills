---
name: write-skill
description: >-
  Author or revise agent skills. Use when editing SKILL.md, skill descriptions,
  or shared skill principles.
---

# Write Skill

Entry for authoring agent skills (`SKILL.md` and shared principles).

## Required principle

Before editing skill text, read [`shared/minimal-diff.md`](shared/minimal-diff.md) and keep applying it—edits to skill text count as a diff.

## Steps

### Scope

**Done when:** the skill's job (one interface or one shared principle) is stated; in-scope files are listed; what this skill will not own is named.

- Name the artifact: entry skill vs `shared/` principle.
- One job per skill; cross-cutting rules go in `shared/`, not copied into every entry.
- For general craft vocabulary, use Matt Pocock's **writing-great-skills** (install if missing; read it; do not paste it in):

  ```bash
  npx skills add mattpocock/skills@writing-great-skills
  ```

  https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills

### Draft

**Done when:** frontmatter and body match the checks below.

**Description (model-invoked):**
- Identity + trigger only (`Use when …`).
- No step lists, no restating the body, no synonym trigger piles.
- Do not put shared principle names in the description unless they are the ignition word.

**Body:**
- Entry skills own **steps** with checkable **Done when** per step.
- `shared/` files state **principle only** (statement, violations, boundaries)—no procedures.
- Prefer English in this repo's skill and shared files.
- Progressive disclosure: keep `SKILL.md` short; link details instead of inlining textbooks.

### Self-check

**Done when:** every hunk passes Necessity / Alignment / Noise; description cannot be shortened further without losing ignition; procedures are not sitting in `shared/`.

- Drop lines the model already does by default.
- Confirm entry vs principle split.
- Confirm out-of-scope does not duplicate another entry skill's job.

## Out of scope

- Ordinary product-code edits → **on-write**
- Submit-phase reading guides → **on-submit**
- Rewriting or replacing **writing-great-skills** itself
