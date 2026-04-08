const e=`---
title: Delta
excerpt: A local-first autonomous agent platform built with a friend — combining recursive planning, persistent memory, sandboxed execution, and an optional control plane for team deployments.
published: true
featured: true
tags: [agents, autonomy, local ai, orchestration]
stack: [Python, Gemini, SQLite, Docker, FastAPI, PostgreSQL]
role: Co-engineer
status: Active build
link: ""
repo: "https://github.com/JohnOjure/Delta"
---

# Delta

Delta is a local-first autonomous agent platform I built together with my best friend [John](https://github.com/JohnOjure). What started as a shared frustration with the usual prompt-response loop became a real system with a planning layer, persistent memory, sandboxed execution, a web interface, and an optional control plane for multi-user deployments.

## What it does

Delta takes a goal, decomposes it into a plan, executes it through capability modules, and preserves enough state to behave like durable software — not a one-off chat session.

The runtime is structured around a tripartite kernel:

- **Reasoning layer** — Gemini or any OpenAI-compatible model, selected through a provider abstraction
- **Runtime layer** — local execution with capability policies, session tracking, audit logging, and file checkpoints
- **Control plane** — optional Postgres queue and S3-backed artifact storage for team deployments

At the core:

\`\`\`python
self._executor = Executor(adapter.get_resource_limits())
self._planner = Planner()
self._generator = ExtensionGenerator()
self._introspector = ExtensionIntrospector()

self._safety = SafetyManager.get_instance()
self._audit = AuditLogger.get_instance()
self._optimizer = OptimizationEngine()
\`\`\`

## Capabilities

Beyond the standard file, shell, and network primitives, Delta has a few things worth calling out:

**Persistent identity.** Delta keeps a \`SOUL.md\` and \`USER.md\` that survive restarts. It remembers what you care about, how you prefer things done, and what it has built for you before.

**Self-correction.** When an execution fails — syntax error, API timeout, wrong output — the agent reformulates and retries without being prompted. It also backs up files before destructive writes and auto-restores on failure.

**Self-optimization.** Running \`delta optimize\` triggers an autonomous cycle that reads past audit logs, identifies failed or inefficient extensions, and refactors them.

**Extension generation.** Delta can write and register new Python tools at runtime. These run through a \`RestrictedPython\` sandbox — not an unrestricted shell — with policy gates for filesystem writes, shell access, and network calls.

**Approval inbox.** Plans and actions can be routed through a human-in-the-loop review step before execution. This lives in the web interface.

## Surfaces

We shipped multiple interaction modes because different contexts need different entry points:

| Surface | How |
|---|---|
| CLI | \`delta "your goal"\` or \`delta --interactive\` |
| Web UI | \`delta --web\` → \`localhost:8000\` |
| Background daemon | \`delta --daemon\` with heartbeat monitoring |
| Voice | "Hey Delta" wake word |
| Global hotkey | \`Ctrl+Shift+D\` from anywhere |
| Telegram bot | Polling or webhook delivery |

## Deployment

Local single-user setup is one command:

\`\`\`bash
./install.sh   # Linux / macOS
install.bat    # Windows
\`\`\`

For teams, the control-plane mode separates web and worker processes with Postgres for state and MinIO for artifacts:

\`\`\`bash
export DELTA_STATE_BACKEND=postgres
export DELTA_QUEUE_BACKEND=postgres
export DELTA_ARTIFACT_BACKEND=s3
export DELTA_EMBEDDED_WORKER=false

delta-web    # serves the UI and API
delta-worker # processes queued jobs
\`\`\`

A reference \`docker-compose.yml\` ships with Postgres, MinIO, web, and worker pre-wired.

## Security design

Autonomy without safety boundaries is a liability. The security layer includes:

- **Encrypted secret store** — credentials resolve through \`secret://...\` references, never plain-text config
- **RBAC** — bearer auth, service-account API keys, and OIDC/hybrid auth modes
- **Policy gates** — shell, filesystem writes, and network access can be allowed, blocked, or approval-routed per workspace
- **Audit log** — every action written to \`~/.delta/audit/audit.jsonl\`
- **Prometheus metrics** — \`GET /metrics\` for operator visibility
- **Backup and restore** — \`delta backup\` and \`delta restore\` with a disaster-recovery drill command

## Takeaway

Delta is the project where John and I tried to answer the question: what does an autonomous local agent look like if you take the engineering seriously? Stateful, extensible, sandboxed, auditable — and actually useful on a real machine, not just a demo.
`;export{e as default};
