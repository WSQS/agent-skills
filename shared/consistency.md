# Consistency

> Shared **criteria** (not a skill, not a procedure). Entry skills apply them; they own the steps.

## Statement

A change should look like it **belongs** to the surfaces it touches—following the **conventions already in force** in that code or docs (naming, style, structure, patterns, terminology).

Conventions come from two sources, in priority order:

1. **Authoritative docs** in the repo (style guide, CONTRIBUTING, lint config, etc.)—if a convention is written down, follow the writing.
2. **Nearest neighbors** in the touched surface—match what the surrounding code or docs already do.

Match what is **already there**, not what would be ideal. A project-wide style drift is a separate decision, not a drive-by fix.

## Violations

A change fails these criteria when any of the following holds:

| Criterion | Violation |
|-----------|-----------|
| Local fit | Names, style, or structure visibly diverge from authoritative docs or the surrounding code or docs |
| Pattern fit | A new piece ignores a written convention or an established pattern used by peers in the same surface |
| Terminology | The same concept is spelled, capitalized, or named differently than authoritative docs or the norm elsewhere |

If no clear convention exists in the surface, pick one and stay with it **within the change**.

## Not these criteria

- Whether the **task itself** is too large to be one landing
- Whether a hunk is beyond the task's scope (drive-by)
- Hard gates (CI, linters, propose/apply)
- Correctness or product judgment beyond matching existing conventions
- Introducing or migrating a **project-wide** convention
