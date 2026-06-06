---
name: plan-refinement-pipeline
description: >-
  Run when the user says "create plan", "create a plan", or enters plan mode
  for implementation planning. After the initial plan is approved, runs 3
  refinement iterations (headless brainstorming, LensTemper review, tri-plan
  merge) and writes a final consolidated plan.
---

# Plan Refinement Pipeline

**Announce at start:** "Running plan-refinement-pipeline (3 iterations)."

## When to use

- User says "create plan", "create a plan", or similar
- User enters plan mode for implementation planning
- A `postToolUse` hook on `CreatePlan` injects follow-up context after plan creation

## Hard gates

- Do **NOT** start refinement until the user approves the initial `CreatePlan`
- Do **NOT** invoke implementation skills (`executing-plans`, `subagent-driven-development`, etc.) during refinement
- Do **NOT** skip iterations unless the user explicitly asks to stop early
- Complete all **3 iterations** before presenting the final plan

## Cost expectation

3 iterations × 3 LensTemper lenses ≈ 9 subagent review runs plus 3 brainstorm passes and 3 merges. Expect **15–45 minutes** and significant token usage per run.

## Paths and constants

| Constant | Value |
|----------|-------|
| Iteration count | `3` |
| LensTemper pack root | `~/.cursor/skills/lens-temper/` |
| Selected lenses | `architecture`, `implementation`, `risk` |
| `run_mode` | `full_hosted` |
| `run_scope` | `selected_lenses` (change to `six_lens` for all 6 lenses) |
| Artifact root | `docs/plans/refinement/<yyyy-mm-dd>-<feature-slug>/` |

## Phase 0 — Initial plan

1. Research the codebase and user request.
2. Create the initial plan via `CreatePlan` (or follow `writing-plans` if not in plan mode).
3. **Wait for user approval** before starting Phase 1.
4. After approval, derive `<feature-slug>` from the plan title (kebab-case, max 40 chars).
5. Create artifact directory: `docs/plans/refinement/<yyyy-mm-dd>-<feature-slug>/`
6. Save the approved plan as `docs/plans/refinement/<slug>/iter-0-baseline.md`

## Phase 1–3 — Refinement loop

For each iteration `N` in `1..3`:

### Step 1: Baseline input

- **N = 1:** use `iter-0-baseline.md`
- **N > 1:** use `iter-<N-1>-merged.md`

Set `plan-in` to that file path.

### Step 2: Headless brainstorming

Read `headless-brainstorm.md` in this skill directory and follow it.

**Output:** `docs/plans/refinement/<slug>/iter-<N>-brainstorm.md`

### Step 3: LensTemper review

1. Read `~/.cursor/skills/lens-temper/reviews/README.md` and `reviews/AGENT.md`
2. Read `~/.cursor/skills/lens-temper/skills/plan-review-orchestrator/SKILL.md`
3. Set pass ID: `<slug>-pr-<N>`
4. Archive directory: `docs/plans/refinement/<slug>/iter-<N>-lenstemper/`
5. Compute target revision: `git hash-object -- <plan-in>` (fallback: SHA-256 of file)
6. Create ledger at `iter-<N>-lenstemper/ledger.json` with:
   - `pass_id`, `target_path`, `target_revision`
   - `run_mode: full`, `run_scope: selected_lenses`, `execution_mode: fresh_spawned_lens_reviewers`
7. For each lens in `architecture`, `implementation`, `risk`, write a spawn handoff at `iter-<N>-lenstemper/<lens>.spawn.md`:

```markdown
Role: Fresh LensTemper <LensName> reviewer (read-only).

Pass ID: <slug>-pr-<N>
Target plan (read from workspace): <plan-in>
LensTemper pack root: ~/.cursor/skills/lens-temper/

Read before reviewing:
- ~/.cursor/skills/lens-temper/reviews/reviewer-template.md
- ~/.cursor/skills/lens-temper/reviews/lenses/lens-<lens>.md
- ~/.cursor/skills/lens-temper/reviews/manifests/lenses/<lens>.json

Review the target plan through the <LensName> lens only.
Write output to: docs/plans/refinement/<slug>/iter-<N>-lenstemper/captured/<lens>.md
Return exactly the sections required by reviewer-template.md.
Do not edit files, synthesize other lenses, or use inherited chat context.
```

8. Spawn **parallel** `Task` subagents (`subagent_type: generalPurpose`, `readonly: true`) — one per lens, each given only its `*.spawn.md` handoff.
9. Run synthesis per `~/.cursor/skills/lens-temper/skills/synthesize-review-feedback/SKILL.md`
   - Read `merge-protocol.md` in this skill directory for merge-relevant extraction
   - Write `iter-<N>-lenstemper/synthesis.md`

**Note:** `assemble-review-prompt.mjs` resolves paths against the LensTemper pack root only. For project-local plans under `docs/plans/refinement/`, use the spawn handoffs above instead of that script.

### Step 4: Tri-plan merge

Read `merge-protocol.md` in this skill directory.

**Inputs:**

- `plan-in` (baseline for this iteration)
- `iter-<N>-brainstorm.md`
- `iter-<N>-lenstemper/synthesis.md`

**Output:** `docs/plans/refinement/<slug>/iter-<N>-merged.md`

Append a short entry to a running merge log (in memory until Phase 4).

### Step 5: Stability note

Compare `iter-<N>-merged.md` to `plan-in`. If line change is under ~5%, note diminishing returns in the merge log (informational only — continue to next iteration).

## Phase 4 — Final outputs

After iteration 3:

1. Copy `iter-3-merged.md` → `final-plan.md`
2. Write `REFINEMENT_SUMMARY.md` containing:
   - Original request and slug
   - Per-iteration summary: key brainstorm findings, LensTemper critical/accepted items applied, merge decisions
   - Stability notes per iteration
   - Remaining risks and deferred items
   - Paths to all artifacts
3. Present `final-plan.md` to the user with a brief summary of what changed across iterations

## Upgrading to six lenses

In Step 3, set `run_scope: six_lens` and spawn subagents for all lenses listed in `~/.cursor/skills/lens-temper/reviews/registry.json`: architecture, implementation, risk, data-model, product-ux, test-strategy.

## Reference files

- `headless-brainstorm.md` — critique-only brainstorming adapter
- `merge-protocol.md` — tri-plan merge rules
