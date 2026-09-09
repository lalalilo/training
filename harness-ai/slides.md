---
theme: dracula
title: Basic principles around AI harness
transition: slide-left
---

# Basic principles around AI harness

<p class="text-sm opacity-70 mt-1">Increase agent trust and autonomy</p>

<!--
- month working with Carlos on a tutoring app for students.

- Approach really different -- don't read the code
-->

---

# Disclaimer

I'm not an AI wizard at all

More confidence than expertise — hard to turn into a talk

---

# "I don't read code anymore"

Not reading the code means <b>trusting</b> the AI:

<div class="bricks">

<div class="brick brick-blue">
AI is not <span class="highlight-yellow">deterministic</span>
</div>

<div class="brick brick-blue">
AI is confident even when wrong
</div>

</div>

<div class="closing">
So how can you improve your trust in AI? → <span class="highlight-yellow">Harness</span> to the rescue
</div>

---

# What's an AI harness ?

<div class="harness-diagram">

<div class="harness-circles">
  <div class="harness-circle harness-circle-outer">
    <span class="harness-circle-label">USER HARNESS</span>
  </div>
  <div class="harness-circle harness-circle-middle">
    <span class="harness-circle-label">BUILDER HARNESS</span>
  </div>
  <div class="harness-circle harness-circle-inner">
    <span class="harness-circle-label">MODEL</span>
  </div>
</div>

<div class="harness-legend">
  <div><span class="harness-legend-label harness-legend-pink">MODEL</span> — the LLM, the thing being harnessed</div>
  <div><span class="harness-legend-label harness-legend-purple">BUILDER HARNESS</span> — system prompt, tools, retrieval, built by the agent's creators (Claude, codex)</div>
  <div><span class="harness-legend-label harness-legend-blue">USER HARNESS</span> — CLAUDE.md, rules, hooks, CI — yours to build</div>
</div>

</div>

<div class="harness-tagline mt-4">A harness is the <span class="highlight-plain">safety setup around the AI</span></div>

<div class="harness-link">

[Learn more](https://martinfowler.com/articles/harness-engineering.html)

</div>

---

# The harness is the product

<div class="bricks">

<div class="brick brick-blue">
Not reading the code isn't free — the effort doesn't disappear, <span class="highlight-yellow">it moves</span>
</div>

<div class="brick brick-blue">
It moves into building and improving the harness: the layers that constrain the AI, check it, and catch what slips through
</div>

<div class="brick brick-blue">
Each layer is cheap — together, they're a guardrail system strong enough to trust
</div>

</div>

<div class="closing">I don't read code anymore is <span class="highlight-yellow">earned</span>, never free.</div>

---

# Why

<div class="bricks">

<div class="brick brick-blue">
One of the goals is to increase the <span class="highlight-yellow">autonomy</span> of the agent
</div>

<div class="brick brick-blue">
<span class="highlight-yellow">Parallelization</span> and productivity increase as well
</div>

<div class="brick brick-blue">
Ease onboarding for external team members/contractors
</div>

</div>

---

# Practical bricks for concrete example

<div class="roadmap">

<div class="roadmap-loop"></div>

<div class="roadmap-step brick-blue"><b>Write it right</b><div class="roadmap-step-desc">CLAUDE.md · rules · hooks · worktree</div></div>

<div class="roadmap-arrow">↓</div>

<div class="roadmap-step brick-amber"><b>Verify &amp; ship</b><div class="roadmap-step-desc">review · tests · CI</div></div>

<div class="roadmap-arrow">↓</div>

<div class="roadmap-step brick-green"><b>Improve it</b><div class="roadmap-step-desc">self-improving agents</div></div>

</div>

---

# Write it right

<div class="bricks bricks-compact">

<div class="brick brick-blue brick-compact">
<div class="brick-title mono">git worktree</div>
<div class="brick-desc">Its own folder + branch per agent/session</div>
<ul>
<li>Contains the blast radius: a mistake stays in its own worktree</li>
<li>Enables parallelization: several agents work at once without stepping on each other</li>
<li>Example: <a href="https://code.claude.com/docs/en/worktrees">Claude Code worktree docs</a></li>
</ul>
</div>

<div class="brick brick-blue brick-compact">
<div class="brick-title">CLAUDE.md</div>
<div class="brick-desc">Global project context, loaded once at session start</div>
<ul>
<li>Saves re-explaining the basics every session</li>
<li>Fades over a long session (context rot)</li>
</ul>
</div>

<div class="brick brick-blue brick-compact">
<div class="brick-title mono">.claude/rules/</div>
<div class="brick-desc">Separate files, each tied to a topic or file path</div>
<ul>
<li>Detail only pulled in when relevant — doesn't weigh down every session</li>
<li>Only loaded when you touch that topic — stays fresh instead of fading</li>
<li>Example: <a href="https://github.com/RenaissancePlace/ai-learning-intelligence/blob/main/.claude/rules/deepeval-metrics.md">deepeval-metrics.md</a></li>
</ul>
</div>

<div class="brick brick-blue brick-compact">
<div class="brick-title">Hooks</div>
<div class="brick-desc">An automatic check tied to an event</div>
<ul>
<li><span class="mono">PreToolUse</span> — blocks it outright. Example: a destructive DB migration (<span class="mono">migrate down</span>)</li>
<li><span class="mono">PostToolUse</span> — fixes it after. Example: runs the linter/formatter right after a file edit</li>
</ul>
</div>

</div>

<!--
Rule of thumb:

relevant to every task → CLAUDE.md. Relevant to one topic/path only → a rule.
-->

---

# Verify & ship

<div class="bricks">

<div class="brick brick-amber">
<div class="brick-title">Type-check + tests + CI</div>
<div class="brick-desc">Required checks before merge unlocks</div>
<ul>
<li>Catches the AI's confident-but-wrong code before it ships</li>
</ul>
</div>

<div class="brick brick-amber">
<div class="brick-title">Multi-agent review</div>
<div class="brick-desc">A security-focused reviewer + an architecture-focused reviewer, each in a fresh context</div>
<ul>
<li>Isolation matters: the AI that wrote the code can't be the one that grades it</li>
</ul>
</div>

<div class="brick brick-amber">
<div class="brick-title">PR required</div>
<div class="brick-desc">No direct push to <span class="mono">main</span></div>
<ul>
<li>One human checkpoint on output that isn't deterministic</li>
</ul>
</div>

</div>

---

# Improve it

<div class="bricks">

<div class="brick brick-green">
<div class="brick-title">Self-improving agents</div>
<div class="brick-desc">Audit the codebase/harness on their own schedule</div>
<ul>
<li>Examples: <a href="https://github.com/RenaissancePlace/ai-learning-intelligence/blob/main/.claude/agents/architecture-gardener.md">architect-gardener</a></li>
<li>Closes the loop: what they find goes back into Write it right</li>
</ul>
</div>

<div class="brick brick-green">
<div class="brick-title">Track rework rate</div>
<div class="brick-desc">Code reverted/rewritten within ~2 weeks of merge</div>
<ul>
<li>Watch the trend as AI usage grows — rising rework is the earliest warning</li>
</ul>
</div>

</div>

---

# What changed for me

<div class="bricks">

<div class="brick brick-purple">
<div class="brick-title">Stop</div>
<div class="brick-desc">Blaming Claude for generating bad output</div>
</div>

<div class="brick brick-purple">
<div class="brick-title">Start</div>
<div class="brick-desc">Debugging Claude like debugging an issue — what happened, why, how do I prevent it next time</div>
</div>

<div class="brick brick-purple">
<div class="brick-title">Continue</div>
<div class="brick-desc">Building trust in my harness, not just the AI</div>
</div>

</div>

<div class="closing">Still not a wizard — but I trust my harness now.</div>
