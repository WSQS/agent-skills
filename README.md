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
| [`shared/minimal-diff.md`](shared/minimal-diff.md) | Criteria only (statement + violations); no procedures |

Craft vocabulary for authoring skills: install Matt Pocock's [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills) via `npx skills add mattpocock/skills@writing-great-skills` (used by **write-skill**, not vendored here).

## Install

```bash
# After the repo is published:
npx skills add <owner>/agent-skills@on-write
npx skills add <owner>/agent-skills@on-submit
npx skills add <owner>/agent-skills@write-skill

# Craft reference (optional companion):
npx skills add mattpocock/skills@writing-great-skills
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
```
