# Work Surface — default organization, and a small example

> This is the **default organization** for a project's engineering work surface: one folder for
> items, the graph inside it, and the runnable version at the project root. An existing project may
> declare how its own layout maps onto it instead of migrating. The specific fields and the graph
> format below are still draft — adjust them. There is no management software and no required
> field set: it is a few files that make an item pickable up again.

## What the surface has to make answerable

- Where do I start reading, and where does each kind of material live?
- What does the project currently understand about this item, and which version of it is adopted?
- What has been decided, and what is still open or unclear?
- What depends on what — which of those edges actually **blocks**, and which part of the item it blocks?
- Which older understanding and prototypes are superseded?
- Is there something runnable right now, and what is in it?

## Default shape

```
<project>/
  README.md                     project entry: what this is, links items/graph.md, who decides what
  current-version.md            the runnable version now: identity, included, not yet in, limits
  items/
    graph.md                    the project's items and their edges — the graph, not an item
    <item>/
      item.md                   current understanding; adopted scope + version anchors; links to prototypes
      prototypes/               one file per prototype, named for the question it answers
      history/                  superseded understanding and prototypes — kept, marked
```

`items/graph.md` is the **project's graph**, not a single item: the items are the directories
beside it, and the graph names them and connects them. Keep it inside `items/` so that a reader who
finds the items folder also finds the map of it.

Only the item's own material lives under the item. A project's public contracts, source and tests
stay where the project already keeps them, and the item **links** to them — the work surface does not
relocate a codebase.

An existing project that already organizes this differently does not migrate: it states its mapping
once in its own README (for example `items: ./work/`, or "the graph is `ROADMAP.md`") and carries on.

## What turns that from a pile into a surface

- current and history are distinguishable **where you stand**: the current file names the superseded
  one, not only the reverse.
- a prototype file states its question and what it does not express.
- an item's current file links the adopted prototype / decision **version**, not merely "the latest".
- there is no second specification: implementation tasks link the authoritative basis instead of
  restating it.
- anything genuinely unclear is recorded as an open region, not invented into structure.
- a **hard** edge runs from the missing result — an unanswered question, a review not done, another
  scope's outcome — to the scope it holds up, so an unblocked scope of the same item proceeds while
  the other waits. A local pending question is never read as a blocked item; the item is blocked only
  when every scope it has is.

## Small fictional example

Fictional project `tide-window` (invented; no real material).

```
tide-window/
  README.md                                        ← links items/graph.md
  current-version.md
  src/import/                                      ← the code, where the project keeps it
  docs/contracts/schedule-format.md                ← the public contract, where the project keeps it
  items/
    graph.md
    schedule-import/
      item.md
      prototypes/
        q-tides-from-csv.table.md          ← adopted (v3)
        q-tides-from-csv.notes.md          ← superseded by the above
      history/
        item.2026-09.understanding.md      ← v1, superseded
```

`README.md` (excerpt):

```markdown
# tide-window
Tide and harbour-schedule viewer. Who decides what: <none yet — single owner>.
Items and their edges: [`items/graph.md`](items/graph.md).
Runnable now: [`current-version.md`](current-version.md).
```

`items/schedule-import/item.md` (excerpt):

```markdown
# Item: schedule import

## Current understanding (v3)
A schedule arrives as a CSV from the harbour office. Import is two steps: parse it into a
*draft schedule*, then a human confirms it into the *active schedule*. Nothing is active
without that confirmation.
Adopted: `prototypes/q-tides-from-csv.table.md` (v3).
Superseded: `history/item.2026-09.understanding.md` (v1 — import wrote the active schedule directly).

## Scopes — one line each, only where they differ in readiness
- `parse → draft`: understanding settled, review passed, ready to implement.
- `confirm → active`: waits on the confirmation-screen question and its review; not ready.

## Open regions
- What happens to an existing draft when the harbour office re-exports? Not expressed yet.
  It touches `confirm → active` only; `parse → draft` does not depend on it.

## Not shown by the adopted prototype
The confirmation screen, and behaviour when a column is missing.

## Links — the item does not own the code or the contract
The surface holds the understanding; those live where the project keeps them.
- Implementation: `src/import/`
- Public contract: `docs/contracts/schedule-format.md`
```

`items/graph.md` (excerpt):

```markdown
## Items
- schedule-import
- notification-digest

## Edges  — a hard edge runs from what is missing to the scope it holds up
- open question "confirmation screen" (unanswered)  --blocks-->  schedule-import · `confirm → active`
- review of the confirmation screen (not done)      --blocks-->  schedule-import · `confirm → active`
- schedule-import · `confirm → active`              --blocks-->  notification-digest · `digest format`
- schedule-import · `parse → draft`                 — blocked by nothing; ready
- schedule-import                                   ~related~    current-version   (importing changes what runs today)

## Open regions
- offline behaviour: not an item yet, waits on an unresolved question. It does not hold up either scope above.
```

`current-version.md` (excerpt):

```markdown
## Now runnable
0.4 — `pnpm dev`, imports a CSV into a draft and shows it.
Included: CSV parse, draft view. Not yet in: confirmation, digest. Limits: draft is lost on reload.
```

Reading that, the answer is local: `parse → draft` proceeds now; `confirm → active` waits on one
answered question and a review; `notification-digest`'s `digest format` scope waits on
`confirm → active`, not on the whole item. A pending question inside one scope is not a blocked item —
the item would be blocked only if every scope it has were. Nothing in this shape is a required field
set or a state machine — the scope lines and the edges are written only because those scopes genuinely
differ in readiness.

The surface is enough when a reader who has not seen the conversation can find the item, read its
current understanding and the version it is bound to, see what is open, and tell whether another
item can proceed.
