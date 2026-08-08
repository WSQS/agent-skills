# agent-skills

Reusable agent skills and shared criteria (soft constraints). Start thin; harden with gates later.

## Interfaces (skills)

| Skill | When | Role |
|-------|------|------|
| [`on-write`](skills/on-write/) | Editing code | Produce a scoped change while editing |
| [`on-submit`](skills/on-submit/) | Before commit/merge, or when a reading guide is needed | Orient a human on a change set; no edits by default |
| [`write-skill`](skills/write-skill/) | Editing skills / shared criteria | Author skills and shared criteria in this repo |

## Shared (not skills)

| File | Role |
|------|------|
| [`shared/minimal-diff.md`](shared/minimal-diff.md) | Diff surface (anti drive-by) |
| [`shared/task-split.md`](shared/task-split.md) | Task boundary (split vs bundle) |
| [`shared/consistency.md`](shared/consistency.md) | Change fits existing conventions (code and docs) |

## Companion skills (not vendored)

External skills referenced by entries above. Install on demand; read them in place—do not paste into this repo.

| Companion | Used by | Install |
|-----------|---------|---------|
| [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills) | **write-skill** (craft vocabulary) | `npx skills add mattpocock/skills@writing-great-skills` |
| [`wayfinder`](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder) | **on-write** (multi-session planning) | `npx skills add mattpocock/skills@wayfinder` |

## Install

```bash
# After the repo is published:
npx skills add <owner>/agent-skills@on-write
npx skills add <owner>/agent-skills@on-submit
npx skills add <owner>/agent-skills@write-skill
```

Local development:

```powershell
# 1) Skill-local shared links (required after clone)
./scripts/link-shared.ps1

# 2) Point the agent at the entries
# ~/.agents/skills/<name>  ->  <repo>/skills/<name>
```

Do not install `shared/` as a standalone skill. `skills/*/shared` junctions are gitignored; recreate with the script.

## Layout

```
skills/
  on-write/
  on-submit/
  write-skill/
    SKILL.md
    shared/          → ../../shared  (junction)
shared/
  minimal-diff.md
  task-split.md
  consistency.md
```
