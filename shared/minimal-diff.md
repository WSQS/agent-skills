# Minimal Diff

> Shared **criteria** (not a skill, not a procedure). Entry skills apply them; they own the steps.

## Statement

Prefer the **smallest change that fully satisfies the stated task** (**diff economy**). Reject **drive-by** work—anything beyond what the task requires (for example: unrelated refactors or cleanups, renames, reformatting, dependency bumps, opportunistic docs/tests/CI, unrelated files).

## Violations

A hunk or file touch fails these criteria when any of the following holds:

| Criterion | Violation |
|-----------|-----------|
| Necessity | Dropping it still satisfies the task |
| Alignment | Its path was never implied by the task |
| Noise | Pure format / rename / comment churn / import reorder |

If the human tightens scope, the reduced boundary **is** the task; anything outside it is still a violation.

## Not these criteria

- Hard gates (CI, propose/apply)
- Correctness or product judgment beyond task fit
- How to narrate a change for humans
- Step-by-step write or submit workflows
