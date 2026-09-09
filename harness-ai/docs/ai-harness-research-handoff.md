# Handoff: AI Harness Research & Industry Standards

> **Purpose.** Context pack for a follow-up agent that will implement the AI-development harness in the Lalilo monorepo. Captures (1) the reference-repo blueprint read from `ai-learning-intelligence`, (2) industry-standard production-shipping practices with citations, (3) the "don't read the code" discourse and what makes it tenable, and (4) the decided scope for the Lalilo port. Read this before implementing; every claim has a source URL so you can verify rather than trust.

---

## 0. Decided scope (read first)

- **Target repo for implementation:** `/Users/greg/lalilo/monorepo` (5 apps: lalilo-api, pedagogy, student-app, back-office, location).
- **Reference repo (read-only blueprint):** `/Users/greg/ai-learning-intelligence` — do NOT modify.
- **Safe = guard 4 risks**, priority order: (1 TOP) secrets/prod/infra incl. **ArgoCD**, (2) cross-app blast radius, (3) false "done"/unverified, (4) architecture drift.
- **Efficient =** low friction/fewer prompts + reusable across 5 apps + automated quality (refactor/simplify/tech-debt/standards) + self-improving harness.
- **Explicitly OUT of scope for this harness:** feature flags, canary, kill-switch / progressive delivery. The monorepo handles rollback via a **clean revert path** (being worked on separately). The harness must keep changes _cleanly revertible_ (atomic PRs, worktree isolation, provenance tags) but does NOT own runtime traffic-shifting.
- **Deliverables already produced:** `.omc/specs/deep-interview-monorepo-ai-harness.md` (spec), `llm/ai-harness-blueprint.html` (presentation deck).

---

## 1. Reference-repo blueprint — `ai-learning-intelligence` (what a mature harness looks like)

AI-powered math tutoring platform. npm workspaces monorepo, Node 22.22.0, React+Vite+TS, Python evals, ElevenLabs voice agent + MCP UI cards, AWS via Terragrunt. README states: _"Almost all development on this repo happens through Claude Code with the oh-my-claudecode (OMC) plugin. You will rarely type git, npm, or gh directly."_

**Eight harness layers observed:**

1. **CLAUDE.md** — session instructions + table-of-contents to deeper docs. Path: `/CLAUDE.md` (+ `CLAUDE.old.md` archived; each worktree carries a synced copy).
2. **`.claude/rules/`** — auto-loaded domain context: `delivery-harness.md` (EPIC phases → OMC skills), `elevenlabs-transcript.md` (debugging), `deepeval-metrics.md` (eval authoring gotchas).
3. **`.claude/skills/`** — `babysit/` (PR triage via ralph; rule "NEVER include @claude in reply text", max 5 push cycles), `verification-before-done/` (4-tier gate: compile → Playwright MCP → end-user flow → evidence; writes `.omc/state/verification-checklist.json`), `react-doctor/` (health-score no-regression gate).
4. **`.claude/agents/`** — 5 sub-agents (all opus unless noted): `architecture-gardener` (weekly audit, drafts ≤3 new issues/run, ≤5 open), `architecture-updater` (architect→critic two-pass, read-only on source), `issue-implementer` (autonomous; reads CLAUDE.md+golden-principles+ADRs first; no git/gh tools; outputs `## Implementation Summary` as PR body), `ralph-wiggum` (Playwright student-sim against live tutor, no `browser_evaluate`), `tech-debt-collector` (ranks top-10 files by LOC, simplifies, LSP-diagnostics gate, one PR labeled `tech-debt-collector`).
5. **`.claude/hooks/`** — `stop-phrase-guard.sh` (active): blocks Stop on ~35 banned phrases in 3 categories — ownership-dodging ("pre-existing", "not from my changes"), known-limitation dodging ("known limitation", "future work"), session-quitting ("good stopping point", "should I continue", "next session"). Emits `{"decision":"block","reason":"..."}`.
6. **CI workflows** (`.github/workflows/`) — all via **AWS Bedrock**, auth'd by **HashiCorp Vault + GitHub OIDC** (role `eng-ai-tools-prod-01-claudecode`) → short-lived creds, **no API key in CI**. Workflows: Architecture Gardener (Mon 09:00 UTC, ≤5 open issues, arch-accuracy ≥90% before commit), Tech Debt Collector (Mon 09:00, skip if open PR exists, revert files that add TS errors), Claude PR Review (`anthropics/claude-code-action@v1`, `use_bedrock: true`, model `global.anthropic.claude-sonnet-4-6[1m]`, every non-bot PR + `@claude` mentions), Claude Issue Implementation (trigger on `claude` label, 120-min timeout, `Co-Authored-By: Claude`, PR labeled `claude-implementer`).
7. **`.omc/` state** — `project-memory.json`, `sessions/` (59 records), `state/` (autopilot/ralph/verification/simplify checklists), `plans/`.
8. **Worktree isolation** — every non-trivial change in `.worktrees/<name>`.

**Governance docs:** `docs/architecture/golden-principles.md` (27 mechanical rules), ADRs — `ADR-0004-omc-delivery-harness` (formalizes OMC as harness; cites OpenAI "Harness Engineering" Lopopolo Feb 2026 + ThoughtWorks "Future of SWE" retreat), `ADR-0008-claude-issue-automation` (docs-only low-risk vs prod-code medium-risk), `ADR-0009-verification-before-done` (cites 11 sessions where agents prematurely claimed done). `quality-grades.md` updated weekly by gardener.

**KEY FINDING:** a richer `scripts/hooks/verification-stop-hook.mjs` (OMC-state-aware: checks uncommitted changes, committed-not-merged, active modes, simplify+verification checklists) exists **but was dropped from Stop hooks in commit `d5f9ba2`**. Only the simpler phrase-guard is active now. That dropped hook is the strongest false-done guard — worth re-porting to Lalilo.

---

## 2. Industry standards — production-shipping safety (cited)

> Each entry: practice — description — source — dev-time vs production. Concrete mechanisms only.

### Anthropic — Claude Code / harness engineering

- **Tiered permissions (allow/ask/deny, deny-first precedence).** Deny rules from any scope can't be overridden by lower-scope allows. CLAUDE.md shapes what model _tries_; `.claude/settings.json` governs what's _allowed_. https://code.claude.com/docs/en/permissions — both.
- **Minimal-footprint principle.** Request only needed perms; prefer reversible over irreversible; if you can't interrupt an irreversible op mid-run, don't start it autonomously. https://www.anthropic.com/research/building-effective-agents — both.
- **Sandboxed Bash (OS-level).** `/sandbox` uses bubblewrap (Linux) / sandbox-exec (macOS). Boundary substitutes for prompts. https://code.claude.com/docs/en/security — both.
- **Hooks = deterministic enforcement.** `PreToolUse/PostToolUse/PermissionRequest/UserPromptSubmit/SessionStart/SessionEnd/FileChanged/Stop`. Exit code 2 blocks unconditionally even past an allow rule. `allowManagedHooksOnly: true` blocks user hooks overriding org policy. https://code.claude.com/docs/en/hooks — both.
- **Managed settings, fail-closed.** `forceRemoteSettingsRefresh: true` blocks startup until org settings fetched (exits if fetch fails). `allowManagedPermissionRulesOnly: true` stops project/user settings widening perms. https://code.claude.com/docs/en/server-managed-settings — production.
- **Write-scope confinement.** Claude Code writes only to start dir + subdirs; parent dirs need explicit permission. https://code.claude.com/docs/en/security — both.
- **Stop hooks as verification gate.** Stop hook blocks turn-end until deterministic gate (tests/lint/build) passes; harness overrides after 8 consecutive blocks (anti-infinite-loop). https://code.claude.com/docs/en/best-practices — dev/CI.
- **Plan mode = read-only pre-commit gate.** `--permission-mode plan` reads + runs read-only shell, no source edits. Explore/plan before switching to execution. https://code.claude.com/docs/en/best-practices — dev.
- **OpenTelemetry audit trail.** `CLAUDE_CODE_ENABLE_TELEMETRY=1` + `OTEL_LOG_TOOL_DETAILS=1` exports full traces linking prompt → API request → tool execution. Bash/PowerShell children inherit `TRACEPARENT`. Span attrs `session_id`, `request_id`, `agent_id`, `parent_agent_id`. https://code.claude.com/docs/en/monitoring-usage — production.
- **Adversarial review subagent (writer≠reviewer).** Reviewer runs in fresh context (no access to reasoning that wrote the diff). Built-in `/code-review`. https://code.claude.com/docs/en/best-practices — dev/CI.
- **Credential non-exposure via proxy.** Proxy outside agent boundary injects creds into outbound requests; agent never sees keys; proxy enforces domain allowlist + logs. NEVER mount `~/.ssh`, `~/.aws`, `~/.config/gcloud`, `~/.kube/config`, `.npmrc`, `*.pem`. https://code.claude.com/docs/en/agent-sdk/secure-deployment.md — production.
- **Cloud session branch restriction + audit log.** Cloud sessions restrict push to current branch; all ops logged; isolated VM terminated after session. https://code.claude.com/docs/en/security — production.

### Agent security architecture (Willison / academic / Google)

- **Rule of Two.** Allow ≤2 of: (A) process untrusted input, (B) access sensitive systems/data, (C) change state / communicate externally. All three → no autonomous operation; require human-in-loop. https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/ — both.
- **Lethal trifecta.** private data + untrusted content + external comms = exfiltration surface. Real exploits: M365 Copilot, GitHub MCP, GitLab Duo, ChatGPT, Bard, Amazon Q (2023-25). Vendor "95% prevention" insufficient. https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ — production.
- **Dual-LLM pattern.** Privileged LLM has tools, never sees untrusted content; quarantined LLM processes untrusted content, no tools; controller passes only symbolic refs. https://simonwillison.net/2023/Apr/25/dual-llm-pattern/ — production.
- **Six anti-injection design patterns.** Action-Selector, Plan-Then-Execute, LLM Map-Reduce, Dual-LLM, Code-Then-Execute, Context-Minimization. https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/ — production.
- **Google three-layer model.** Human controllers for critical actions + limited/dynamic agent powers + observable actions/planning. Deterministic policy engine + AI risk detection (defense-in-depth). https://simonwillison.net/2025/Jun/15/ai-agent-security/ — production.
- **Static defense insufficiency.** Adaptive attacks beat 12 published injection defenses >90% despite ~0% in original papers. Don't rely on filtering; architect to limit damage. https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/ — production.
- **Docker hardening.** `--cap-drop ALL`, `--security-opt no-new-privileges`, seccomp profile, `--read-only` + `--tmpfs`, `--network none` (comms via Unix socket to proxy), `--memory 2g`, `--pids-limit 100`, `--user 1000:1000`, workspace `:ro`. gVisor for multi-tenant. https://code.claude.com/docs/en/agent-sdk/secure-deployment.md — production.
- **bypassPermissions circuit breakers.** Even in bypass mode: `rm -rf /` and `rm -rf ~` still prompt; explicit `ask` rules still fire. Admins block entirely via `permissions.disableBypassPermissionsMode: "disable"`. Only in isolated VM/container. https://code.claude.com/docs/en/permissions — production.

### Production-shipping (NOTE: progressive-delivery items OUT of scope — listed for completeness; Lalilo uses clean-revert instead)

- **PR as mandatory human handoff gate.** Never push to main directly; agent opens PR; branch restriction enforced at cloud-session level. https://code.claude.com/docs/en/github-actions.md — production. **IN SCOPE.**
- **Required CI status checks before merge.** Compiler + linter + tests + structural/arch tests as required checks blocking AI PRs. ThoughtWorks: "feedback sensors for coding agents." Radar Vol 34. — production/CI. **IN SCOPE.**
- **Automated PR review via second-opinion agent.** Fresh-context Claude reviews diff vs spec on PR open; prompted to find gaps not style. https://code.claude.com/docs/en/code-review.md — production/CI. **IN SCOPE.**
- **AI-change provenance tagging.** Tag commits/PRs/deploys with model + session id → query "which incidents involved AI code?", measure AI-vs-human incident rate. OTel `session_id`/`agent_id` spans. https://code.claude.com/docs/en/monitoring-usage — production. **IN SCOPE.**
- **Architectural fitness functions.** CI tests for import structure, layer boundaries, "no Sequelize outside data-layer" — catch drift reviewers miss. ThoughtWorks Radar Vol 34. (Lalilo already has `yarn test:structure`.) — production/CI. **IN SCOPE.**
- **DORA + rework rate.** Track lead time, deploy freq, MTTR, change-failure-rate, **rework rate** = early warning for AI code passing review but failing prod. ThoughtWorks Radar Vol 34. — production. **IN SCOPE (metric).**
- **First-pass acceptance rate.** % AI PRs merged without revision — better quality signal than PR volume. Radar Vol 34 + https://simonwillison.net/2025/Oct/5/parallel-coding-agents/ — production. **IN SCOPE (metric).**
- **Progressive delivery (release toggle + canary + ops kill-switch).** https://martinfowler.com/articles/feature-toggles.html — production. **OUT OF SCOPE** (monorepo clean-revert path handles this).
- **Stateful checkpointing** for long-running agent workflows (LangGraph/Temporal). Radar Vol 34. — production. (OMC `.omc/state/` already does lightweight version.)

### Evals & regression

- **Test suite = primary verification gate.** The difference between a session you can walk away from and one you must watch. Shopify/Liquid: 974 unit tests → agents safely ran 120+ experiments, committed 93. https://code.claude.com/docs/en/best-practices — dev/CI.
- **Benchmarks = objective correctness.** Numerical pass/fail before giving agent the task (avoids "looks done"). https://simonwillison.net/tags/ai-assisted-programming/ — dev.
- **Test-author ≠ code-author.** One instance writes tests (no knowledge of impl), another implements — tests verify requirement not implementation. https://code.claude.com/docs/en/best-practices — dev.
- **Spec/README-driven.** Full spec before agent implements — guardrails vs scope creep, contract for reviewer agent. — dev.
- **Adversarial self-review for silent regressions.** Fresh-context subagent tries to _refute_ the result (find gaps/edge cases), not confirm success. https://code.claude.com/docs/en/best-practices — dev/CI.
- **Context rot = silent regression risk.** Quality degrades as context fills with failures; same prompt → worse output later. Mitigate: `/clear` between tasks, compact instructions, subagents for investigation. https://code.claude.com/docs/en/best-practices — dev.

### Supply chain & secrets

- **MCP supply-chain risk.** Unreviewed 3rd-party MCP servers; tools can mutate definitions post-install (rug-pull); tool-poisoning hides instructions in descriptions. Anthropic doesn't security-audit MCP servers. Use only audited/own servers. https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/ — both.
- **Slopsquatting (hallucinated deps).** AI invents plausible package names; attacker registers them → malicious install. Pin versions, review lockfile in every AI PR, `npm/yarn audit` + Dependabot as required CI gate. (OWASP LLM Top 10.) https://code.claude.com/docs/en/agent-sdk/secure-deployment.md — production/CI.
- **Never mount host creds into agent containers.** Exclude `.env*`, `~/.git-credentials`, `~/.aws/credentials`, gcloud ADC, `~/.azure/`, `~/.kube/config`, `.npmrc`, `.pypirc`, `*-service-account.json`, `*.pem`, `*.key`. https://code.claude.com/docs/en/devcontainer — production.
- **Short-lived OIDC creds for CI.** AWS IAM OIDC / GCP Workload Identity Federation, not static keys. (Reference repo already does this via Vault+OIDC.) https://code.claude.com/docs/en/github-actions.md — production.
- **Network egress allowlist.** Blocks exfil even if injection succeeds. Anthropic devcontainer `init-firewall.sh` blocks all outbound except listed domains; `--network none` + proxy. https://code.claude.com/docs/en/devcontainer — production.
- **Toxic-flow analysis.** Formal threat-model of agent tool graphs for paths combining sensitive access + untrusted input + external comms. ThoughtWorks Radar Vol 34. — production.

### Known failure modes at scale

- **False productivity / deferred architecture decisions** erode clarity. Keep architecture human-gated. https://simonwillison.net/tags/ai-assisted-programming/ — org.
- **Maintenance-cost inversion.** 2× output + constant per-line maintenance = 2× burden. Monitor rework rate + comprehension. — org.
- **Review overload.** Many parallel agents overwhelm human review; scope tasks w/ detailed specs; scout pattern first. https://simonwillison.net/2025/Oct/5/parallel-coding-agents/ — org.
- **AI fails at design w/o checkable answers.** syntaqlite rebuilt after AI architecture dead-ended. Agent = implementation engine for human-designed systems. — org.
- **No optimization pressure (LLM laziness).** Agents dump code w/o crisp abstractions absent fitness functions. — org/CI.
- **Trust-then-verify gap.** Plausible-looking broken code. "If you can't verify it, don't ship it." https://code.claude.com/docs/en/best-practices — both.
- **Cognitive/codebase debt.** Output outpaces team understanding. Fitness functions + first-pass acceptance + ensure team can explain every shipped module. Radar Vol 34. — org.

---

## 3. "Don't read the code" discourse — and what makes it tenable

**Matt Pocock, most recent — ["9 Ways AI Coding Has Rewired My Brain"](https://www.aihero.dev/ways-ai-coding-has-rewired-my-brain) (Mar 11, 2026).** Does NOT say stop reading. Says architect so you don't have to:

- "Test at the right boundaries and you can ignore what's inside." — **grey-box modules** (small interface, big impl, "look inside if you want but you're not supposed to").
- "Every single change the AI makes should trigger your pre-commit hooks, CI, and type checking so bugs get caught immediately."
- Nine principles: integration testing first, friction (hooks/CI/types) as feedback loop, throwaway-route UI prototyping, deep modules, grey-box testing, Effect.ts DI, delegate triage to AI, avoid doc-rot (prefer just-in-time docs), manage cognitive load via grey-box trust.
- Production workflow ["Real-World Feature Build with Claude Code"](https://www.aihero.dev/real-world-feature-build-with-claude-code) (Mar 20, 2026): brainstorm via `/grill-me` → PRD → GitHub issues → autonomous ralph loops → QA loops.
- ["9 Things People Get Wrong With /grill-me"](https://www.aihero.dev/things-people-get-wrong-with-grill-me-and-grill-with-docs) (May 25, 2026): `/grill-with-docs` builds per-bounded-context `context.md` (DDD); ADRs for hard-to-reverse/surprising/trade-off decisions.

**Who literally stopped reading code:**

- **Karpathy** (coined vibe coding, [tweet Feb 6 2025](https://simonwillison.net/2025/Feb/6/andrej-karpathy/)): _"I 'Accept All' always, I don't read the diffs anymore"_ / "forget that the code even exists." Cursor+Sonnet, **weekend/personal projects**, no harness.
- **Simon Willison**, [May 6 2026](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/): _"I'm not reviewing every line... even for my production level stuff"_ — immediately names it **"normalization of deviance"**, warns "Claude Code does not have a professional reputation, it can't take accountability." [Jun 22 2026](https://simonwillison.net/2026/Jun/22/porting-moebius/): "didn't look at a single line." But [anti-patterns guide](https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/) (Feb 2026): _"Don't file pull requests with code you haven't reviewed yourself."_ Earlier golden rule ([Mar 19 2025](https://simonwillison.net/2025/Mar/19/vibe-coding/)): _"I won't commit any code if I couldn't explain exactly what it does."_ Coined **"vibe engineering"** ([Oct 7 2025](https://simonwillison.net/2025/Oct/7/vibe-engineering/)) = tests + review culture + manual QA + version control discipline + preview envs.
- **Steve Yegge**, ["Vibe Maintainer"](https://steve-yegge.medium.com/vibe-maintainer-a2273a841040) (Mar 31 2026): _"I certainly haven't. No time for field trips."_ — but **The Mayor agent reviews every PR**, ~25% personal review, 88% via fix-merge, architectural isolation rules (cross-project pollution banned, plugin-first, one concern per PR). "There's still a thing called taste that current models can't be trusted with."
- **Emil Stenström** (via [Willison Dec 14 2025](https://simonwillison.net/2025/Dec/14/justhtml/)): HTML parser via Claude Code, hooked into **9,200 conformance tests** from the start. "The agent did the typing; I did the thinking."

**Other positions:**

- **David Crawshaw** ([Jan 6 2025](https://crawshaw.io/blog/programming-with-llms)): "Ask for work that is easy to verify"; always compile+test before reading; still "read the code, think, decide if good."
- **Sean Goedecke** ([May 17 2026](https://www.seangoedecke.com/how-i-use-llms-in-2026/)): heavy skimming, rejects most changes on instinct, doesn't trust agents for UI testing.
- **Geoffrey Huntley** ([Mar 3 2025](https://ghuntley.com/specs/)): specs + strongly-typed compiler soundness as the harness replacing review.
- **Harper Reed** ([Feb 16 2025](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)): aider runs the test suite itself = "even more hands off."

**THE PATTERN (decisive for Lalilo):** Nobody safe stopped reading code and added nothing. They replaced reading with a _heavier harness_ — conformance/eval suites, compiler soundness, agent-as-reviewer, behavioral verification + sandbox, version-control undo. "Don't read the code" is a **consequence** of a strong harness, never a substitute. For real paying customers, not-reading-every-line is only defensible once verification + provenance + clean-revert are strong. The current Lalilo harness is not there yet.

---

## 4. Recommended Lalilo port path (decided phases)

Sequenced, each phase independently shippable, reuses existing thin CLAUDE.md + hooks + skills.

- **P1 — Secrets/prod/infra (TOP).** PreToolUse Bash deny-list (destructive DB, `migrate down`, `kubectl/helm/argocd` mutations) + secret-pattern scan on Edit/Write. Architectural: keep/adopt Bedrock+Vault+OIDC for any CI agent; never store static keys; apply **Rule of Two** — ArgoCD/k8s = sensitive → human-gated, not deny-list-only. Managed settings fail-closed (`allowManagedPermissionRulesOnly`, `forceRemoteSettingsRefresh`).
- **P2 — Cross-app blast radius.** Pre-commit hook rejects staged files outside active app; harden "never `git add .`" into enforcement; worktree-per-ticket (existing start-ticket skill).
- **P3 — Verification-before-done.** Port stop-phrase-guard + re-port the _dropped_ 4-tier verify hook (compile → behavioral/Playwright → end-user flow → evidence) wired to per-app `test:unit/integration/check-types` + migration checks. Reuse watch-ci skill. Add **test-author≠code-author** + **adversarial self-review** for silent regressions.
- **P4 — Architecture-drift rules.** `.claude/rules/<app>.md` encoding layered arch (routes→services→data-layer, no Sequelize outside queries, mergeParams). Extend `yarn test:structure` as required CI fitness function.
- **P5 — Friction + reuse.** Curate `permissions.allow` for safe repeated per-app commands; factor shared skills to repo root; per-app rule files only for diffs.
- **P6 — Self-improving loop.** Weekly CI gardener + tech-debt-collector scoped per app (audit golden principles, draft capped issues, LSP-gated simplification PRs). Track quality grades, **rework rate**, **first-pass acceptance rate**.
- **P7 — Provenance + clean-revert hygiene.** Tag AI commits/PRs with model + session id (OTel `session_id`/`agent_id`); PR-only, never push to main; required CI status checks block merge; second-opinion review agent on PR open. Keep every change atomic/cleanly-revertible so the monorepo's separate clean-revert path can undo a single AI change safely. (Feature-flag/canary/kill-switch intentionally NOT here — owned by the revert-path work.)
- **P8 — Supply chain.** Pin deps; review lockfile diff in every AI PR; `yarn audit`/Dependabot as required gate; audit MCP servers before enabling; treat MCP output as untrusted.

---

## 5. Lalilo repo facts the implementer must respect

- Turbo + Yarn workspaces; Node 22.22.0 via fnm (`.node-version`); SessionStart hook already warns on Node mismatch.
- Conventional commits w/ scope rules; `git pr` (pretty-pull-request) before `gh pr create`; never `git push` without explicit instruction; never `git add .`.
- Per-app tests: `yarn test:unit|test:integration|test:structure` run from app dir; integration needs DB, runs `--runInBand`.
- Sequelize→Drizzle migration in progress; no Sequelize queries outside `data-layer/queries/`; each query file needs matching integration test.
- `yarn check-deps` (syncpack) after any package.json dependency change.
- Existing `.claude/settings.json` already has PostToolUse prettier-on-write + SessionStart Node check.
- Bedrock + `[1m]` model context; sub-agents need tier aliases (resolver env vars configured).

## 6. Artifacts produced this session

- `/Users/greg/lalilo/monorepo/.omc/specs/deep-interview-monorepo-ai-harness.md` — deep-interview spec.
- `/Users/greg/lalilo/monorepo/llm/ai-harness-blueprint.html` — presentation deck (updated with production-gap + don't-read-code + P1–P8).
- `/Users/greg/lalilo/monorepo/llm/ai-harness-research-handoff.md` — this file.
