# Tri-Plan Merge Protocol

Combine three inputs into one refined implementation plan per iteration.

## Inputs

| Input | Path |
|-------|------|
| Baseline plan | `plan-in` (`iter-0-baseline.md` or previous `iter-<N-1>-merged.md`) |
| Brainstorm critique | `iter-<N>-brainstorm.md` |
| LensTemper synthesis | `iter-<N>-lenstemper/synthesis.md` |

## Extraction rules

### From LensTemper synthesis

Extract in priority order:

1. **Critical Issues** — must be addressed in merged plan unless explicitly deferred in synthesis
2. **Synthesis Decisions** with `accepted` — apply recommended plan changes
3. **Important Improvements** where decision is `accepted` or unset
4. **Recommended plan changes** section (if present)
5. Ignore findings marked `rejected` or `downgraded` unless brainstorm independently raises the same issue as critical

### From brainstorm critique

Extract:

1. **Suggested plan changes (non-binding)** — apply when synthesis did not reject the same concern
2. **Alternative approaches** — adopt recommended alternative when it resolves a synthesis critical issue or fills a gap synthesis missed
3. **Gaps and assumptions** — add missing tasks or acceptance criteria when material

## Conflict resolution

| Conflict | Resolution |
|----------|------------|
| Synthesis `accepted` vs brainstorm suggestion | Synthesis wins |
| Synthesis `rejected` vs brainstorm critical gap | Keep rejection unless brainstorm cites concrete codebase evidence synthesis missed |
| Scope expansion (brainstorm adds feature) | Reject unless synthesis marked a critical gap requiring it |
| Task ordering disagreement | Prefer synthesis when lens is implementation or architecture; otherwise preserve baseline order with noted rationale |

## Output format

Write `iter-<N>-merged.md` using the writing-plans header:

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Refinement:** iteration <N> of 3 — merged from baseline, brainstorm critique, and LensTemper synthesis.

**Goal:** ...

**Architecture:** ...

**Tech Stack:** ...

---

(task sections with checkbox steps, same structure as baseline)
```

## Merge checklist

Before saving:

- [ ] Every synthesis **Critical Issue** is addressed, deferred with rationale, or marked out of scope with reason
- [ ] Every synthesis **accepted** decision has a corresponding plan edit
- [ ] Brainstorm gaps not covered by synthesis are evaluated; material ones are added
- [ ] Scope matches original intent (no unrequested feature creep)
- [ ] Plan header and task checkbox format preserved
- [ ] File paths in tasks remain exact and valid
- [ ] `iter-<N>-changelog.md` lists every material change with before/after and why

## Plan changelog (required per iteration)

After each merge, write `iter-<N>-changelog.md` comparing **`plan-in`** → **`iter-<N>-merged.md`**.

Use this structure:

```markdown
# Plan Changelog — Iteration <N>

> **From:** `<plan-in>`
> **To:** `iter-<N>-merged.md`

## Summary

| Metric | Count |
|--------|-------|
| Sections modified | |
| Tasks added | |
| Tasks removed | |
| Tasks rewritten | |
| Unchanged (reviewed) | |

One paragraph: what materially changed this iteration and the main drivers (brainstorm vs LensTemper).

## Changes

List every **material** edit. Skip typos and formatting-only fixes unless they change meaning.

### 1. [Section, task, or plan element]

| | Before | After |
|---|--------|-------|
| Text / scope | ... | ... |

**Why:** One sentence — what problem this fixes or what risk it addresses.

**Source:** `brainstorm` | `LensTemper (architecture, implementation, or risk)` | `merge`

**Trigger:** Quote or paraphrase the brainstorm bullet, synthesis finding, or decision that caused this edit.

(repeat for each change)

## Considered but not applied

| Suggestion | Source | Reason kept out |
|------------|--------|-----------------|
| ... | brainstorm / LensTemper | rejected, downgraded, out of scope, deferred, or superseded by ... |

## Iteration delta stats

- **Line change vs `plan-in`:** [approximate % or substantial/minimal]
- **Diminishing returns?** [yes/no — under ~5% substantive change]
```

### Changelog rules

- **Before/after must be specific** — quote or paraphrase the old and new wording, file paths, or task steps; do not write "improved architecture section" without saying how.
- **Why must cite a source** — every row needs a brainstorm item, LensTemper finding (with lens), or explicit merge conflict resolution.
- **One row per material edit** — group related checkbox steps only when they share one rationale.
- **No silent edits** — if the merged plan differs from `plan-in`, the changelog must account for it.
- **Empty iterations** — if nothing changed, state that and list what was reviewed in brainstorm and synthesis.

## Merge log entry (for REFINEMENT_SUMMARY.md)

After each merge, record:

```markdown
## Iteration <N>

- **Baseline:** `<plan-in>`
- **Merged plan:** `iter-<N>-merged.md`
- **Changelog:** `iter-<N>-changelog.md` — read this for the full before/after list and per-change rationale
- **Top changes:** [3–5 bullets — each = what changed + why in one line]
- **Brainstorm highlights:** [1–3 bullets]
- **LensTemper applied:** [accepted critical/important items]
- **Conflicts resolved:** [if any]
- **Line change vs baseline:** [approximate % or "substantial/minimal"]
```

## Stability check

Compare merged output to `plan-in`:

```bash
# Approximate: count changed lines
diff -u plan-in iter-<N>-merged.md | wc -l
```

If under ~5% substantive change, note **diminishing returns** in the merge log. Continue remaining iterations anyway unless the user asked to stop early.
