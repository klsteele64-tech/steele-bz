#!/usr/bin/env bash
# postToolUse hook: after CreatePlan completes, inject refinement pipeline context.
set -euo pipefail

input=$(cat)

emit_context() {
  if command -v jq >/dev/null 2>&1; then
    jq -n --arg ctx "$1" '{ "additional_context": $ctx }'
  else
    node -e "console.log(JSON.stringify({ additional_context: process.argv[1] }))" "$1"
  fi
}

tool_name=""
if command -v jq >/dev/null 2>&1; then
  tool_name=$(echo "$input" | jq -r '.tool_name // .toolName // empty' 2>/dev/null || true)
fi

# Match CreatePlan regardless of JSON field naming.
if [[ -z "$tool_name" ]]; then
  if echo "$input" | grep -qi 'CreatePlan'; then
    tool_name="CreatePlan"
  fi
fi

if [[ "$tool_name" != "CreatePlan" ]]; then
  echo '{}'
  exit 0
fi

emit_context "Plan created via CreatePlan. The user must approve the plan first. Once approved, REQUIRED: read and follow the plan-refinement-pipeline skill (.cursor/skills/plan-refinement-pipeline/SKILL.md) and run all 3 refinement iterations (headless brainstorm, LensTemper review, tri-plan merge) before any implementation work. Announce: Running plan-refinement-pipeline (3 iterations)."
