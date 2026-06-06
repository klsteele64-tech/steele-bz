# Headless Brainstorming (Critique Mode)

Adapted from superpowers `brainstorming` for plan refinement. The plan already exists — do not run interactive gates.

## Purpose

Critique the current plan iteration: find gaps, unstated assumptions, weak sections, and alternative approaches. Output a structured critique document, not a replacement plan.

## Steps (in order)

### 1. Explore project context

- Read the target plan (`plan-in`)
- Read files referenced in the plan (paths listed under Files / tasks)
- Skim recent related code or docs if the plan touches them
- Note what the plan assumes about the codebase that may be wrong or outdated

### 2. Identify weak sections

For each major section of the plan (Goal, Architecture, tasks), ask:

- Is anything ambiguous or interpretable two ways?
- Are success criteria missing?
- Are dependencies or ordering risks unstated?
- Does the plan match existing project conventions?

List weak sections with a one-line reason each.

### 3. Propose 2–3 alternative approaches

For each weak section (or the top 3 weakest if many), propose 2–3 alternatives with trade-offs. Lead with your recommendation and why.

Do not expand scope beyond the original plan unless a critical gap requires it.

### 4. Write critique document

Save to `docs/plans/refinement/<slug>/iter-<N>-brainstorm.md` using this structure:

```markdown
# Brainstorm Critique — Iteration <N>

> Target plan: `<plan-in path>`
> Mode: headless critique (no user gates)

## Context notes

- [What you verified in the codebase]
- [Assumptions the plan makes]

## Weak sections

| Section | Issue |
|---------|-------|
| ... | ... |

## Alternative approaches

### [Section name]

**Current plan approach:** ...

**Alternative A:** ... — trade-offs: ...
**Alternative B:** ... — trade-offs: ...
**Recommendation:** ...

(repeat for each weak section)

## Gaps and assumptions

- [Unstated requirements or missing error handling, testing, rollout, etc.]

## Suggested plan changes (non-binding)

- [Bullet list of concrete edits to consider in merge step]
```

## Do NOT

- Ask clarifying questions — infer from plan and codebase
- Wait for user approval
- Write a full replacement plan (merge step handles that)
- Invoke `writing-plans` or any implementation skill
- Commit to git unless the user explicitly asks
