---
name: engineering-workflow
description: >-
  General engineering workflow for one project. Use when starting or continuing
  engineering work and you need to decide what to advance, express or review the
  understanding behind an item, implement inside the project's authorization, or
  keep the current usable version in step with what was adopted.
---

# Engineering Workflow

Entry for advancing a project's engineering work. Ground in the project's own surface,
then enter at the **one responsibility the current gap names**. This is not a stage
pipeline every item walks through, and not a ticket system — one session may carry
several items.

`engineering-workflow` was adopted on 2026-10-15; it was a working name while this was a draft. The
scope lines and the graph format may still change, and the method has not yet been exercised on a real
project.

## Ground in the project surface

**Done when:** you can name the item and the scope the responsibility you are entering covers, the current material for that scope, what is still unknown, and which actions those unknowns and any missing authority actually gate. You do not need the whole project resolved first.

- Find the project's work surface — [`references/work-surface.md`](references/work-surface.md) gives the default layout and a small fictional example; an existing project may map its own layout onto it instead of migrating. If a project has none, create that default; do not install a process.
- **Read only what the entry needs**: the current item, the adopted version for the scope you are touching, and the edges that plausibly affect it. Do not begin by inventorying every item, every adopted version, or every runnable artefact.
- **What you cannot determine yet is recorded as unknown**, not resolved before you are allowed to act. An unknown constrains only the action it actually gates: it never turns into a project-wide wait.
- An unknown does not stop you from **expressing or recording** the understanding — say it, sketch it, or note it in a place the project already lets you write. That is not a licence to write somewhere you have none: an unknown never becomes an authorisation to bypass the project's review or write rules.
- Missing review authority or write permission blocks **that** action, wherever it would be written, under the project's rule. Do not invent a permission you were not given, and do not let the gap stop unrelated work.
- **The project defines review, write authority and release.** Read them and comply; never impose one approval model across projects.
- Current material is current; old material is history — superseded understanding and prototypes stay findable and marked, and the current entry points at what is live.
- The specification's home is the project's files, never only a conversation's context or a handover summary.

## Enter by responsibility

**Done when:** one row is chosen and its section is being worked; the others are left alone rather than run in order.

Pick the row the current gap matches; do not walk the list.

| Current gap | Responsibility |
|---|---|
| Unsure what the project understands, or what to do next | Ground, then grow the dependency graph |
| The item's understanding is unclear, or a choice needs deciding | Express and review understanding |
| A part is unblocked and inside authorization | Implement within authorization |
| Something was built — is it what was adopted? | Deliver against the adopted version |
| Is there anything a user can run right now? | Keep the current usable version; route feedback back |
| Who talks to the user, who schedules? | Split the dialogue from the scheduling |

## Express and review understanding

**Done when:** the item's current understanding is written where it can be found, the unclear point is named, confirmed parts are recorded as confirmed scope with what remains unconfirmed stated, and any change superseding adopted understanding names the scope and the tasks it affects.

- Understanding grows two ways and they alternate: **grilling** (ask) and **prototype** (express). Neither has to finish before the other starts.
- A prototype here is **the AI's concrete expression of its current understanding** — text, a dependency graph, an image, a data sample, a web page, or a minimal program. Code and near-final fidelity are not the definition, and a prototype is not the final experience.
- Multiple prototypes per item are normal and may run in parallel (text, then image, then page; or competing candidates). Add a more concrete form only when the current one still leaves the question unclear — not because a form is "finished".
- A concrete shareable artefact is optional. When that is what the question needs, reach for the vendored upstream skill: [`vendor/matt-prototype/UPSTREAM.md`](vendor/matt-prototype/UPSTREAM.md). Use it for that artefact only — its throwaway-code, single-HTML-file and no-tests rules are **not** requirements of this method.
- A new prototype states what it inherits, refines or changes. A new file is **not** automatically the adopted version.
- A prototype may express only part of the item; say what it leaves unexpressed, and never read a look at that part as agreement on the whole.
- Review confirms only the parts explicitly chosen; demo shortcuts and placeholders are not thereby implementation constraints. If the meaning is still unclear, discuss it rather than asking the user to annotate files.
- A **local** review pass that satisfies the project's rule — with the prerequisite it depends on actually met — is enough to proceed with the covered part. There is no global "prototype phase" to finish first.
- When understanding materially changes, the change names the scope it supersedes and the tasks it affects, and the project's rule decides whether those continue, pause, stop or are reworked. Something still under discussion is not an effective change.

## Grow the dependency graph

**Done when:** the graph carries the item's understanding, review and implementation work; a blocking edge says which result is missing and which part therefore cannot proceed reliably; related-but-not-blocking links are marked as related; and anything still unexpressible is an open region rather than invented structure.

- The graph is *also* a prototype: it starts incomplete and grows with the understanding.
- Separate a real **blocking** dependency from an ordinary **related** link. An uncertain dependency can be clarified by another prototype.
- A prototype being awaited is not a global block — unaffected work continues. Do not manufacture parallelism, and do not use "it will be easy to change" to bypass a review that has not happened.

## Implement within authorization

**Done when:** the implemented part is bound to the version of the adopted understanding / prototype / decision it came from; the project's authorization was respected; and the recorded scope says what this change covered and what it did not.

- Bind to the material that was actually shown and confirmed, and keep that version findable. A git hash can be the anchor, but it does **not** cover uncommitted edits, ignored generated output, or a remote link that has moved — and one repository's hash does not cover multi-repository work. Say so instead of implying coverage.
- Implementation task descriptions carry scope, deliverable and limits, and link the authoritative basis; they do not create a competing specification.
- Editing code follows the sibling entry **on-write**; reviewing a change set follows **on-submit**.

## Deliver against the adopted version

**Done when:** the delivery names its real artefacts and evidence and classifies the result against the adopted scope as conforming, deviating or unverified — without using a completion report as the evidence.

- "The prototype was reviewed", "the code is committed / the build passed" and "the implementation matches" are three different states.
- Check however the project and the item require — reading, a demo, screenshots, behavioural or automated tests; full automation is not required.
- Choices confirmed in review carry into this check.

## Keep the current usable version, and route feedback back

**Done when:** one current version exists that is integrated, runnable and easy to find, with its identity, included changes, not-yet-integrated parts and known limits stated; and feedback the user brings is correlated to the version it was about and routed into the item/graph — or, if genuinely cross-project, offered as a discussion candidate.

- "Current" means integrated and runnable — not a screenshot, not an unmerged branch, not "done" only inside an assistant's report.
- Do not overwrite the last usable version to chase "latest"; do not withhold usable progress because other parts are unfinished.
- **The user chooses when to experience it and which parts.** This is neither a per-round step nor a fixed gate after implementation, and the agent does not set the user's pace.
- No experience and no feedback means **not accepted** — not broken. It does not block other independently authorized work, and it does not bypass confirmation the project's review rules require.
- The user does not have to diagnose whether it is a bug, a changed requirement or a misunderstood intention; unaffected work continues.
- Delivery medium and release cadence belong to the project; not every integration is a release.
- Engineering problems enter the project's own items/graph first; not every one becomes a cross-project discussion topic.

## Split the dialogue from the scheduling

**Done when:** it is clear which agent owns what — the main agent owns dependencies, scheduling, integration and advancement; the dialogue agent owns understanding, confirmed choices, open questions and prototypes — and the user's confirmed material reaches the main agent without the user acting as the manual synchroniser.

- The user enters the **dialogue agent directly** to grill, look at prototypes and decide. That role persists per project instead of being re-assigned each round; persisting does not mean one endlessly growing session — history and basis can be handed over.
- The dialogue agent files substantive understanding into the project's files and says what changed; implementation then links that basis instead of restating it.
- If implementation finds something that affects the item's purpose, an already confirmed choice, the expression of the understanding, or a significant cost, the main agent brings it back to the dialogue. Technical problems that affect none of those are handled on the implementation side. Work that does not depend on the open question continues.

## Out of scope

- Editing code → **on-write** (with the `shared/` criteria)
- Submit-phase reading guide → **on-submit**
- Authoring skills and shared criteria → **write-skill**
- A ticket system, or a one-item-per-session rule
- One approval / write model for all projects — the project defines it
- Management software: the work surface is files, not an application
