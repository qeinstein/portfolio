---
title: Delta
excerpt: I built Delta as an autonomous local agent system around planning, persistent memory, sandboxed execution, and self-extension.
published: true
tags: [agents, autonomy, local ai, orchestration]
stack: [Python, Gemini, SQLite, RestrictedPython]
role: AI systems engineer
status: Active build
link: ""
repo: "https://github.com/JohnOjure/Delta"
---

# Delta

I built Delta to move beyond the usual single prompt-response loop. I wanted an agent system with a planning layer, an execution layer, persistent memory, extension loading, and a local runtime surface that can actually do work on a machine.

## What the project does

The core idea behind Delta is straightforward: I take a user goal, turn it into a plan, execute it through controlled capabilities, and preserve enough state for the system to behave like durable software instead of a temporary chat session.

In the current build, I gave it:

- a CLI and interactive mode
- an agent core that plans, executes, reflects, and iterates
- persistent memory and audit logging
- a sandbox layer for generated extension code
- desktop, web, daemon, voice, and hotkey surfaces

## Why it stands out

What matters to me in Delta is that I treated autonomy as a systems problem, not just a prompting problem. I separated reasoning from execution, gave the agent a registry for extensions, and added memory, optimization, and safety hooks so the runtime can improve without turning into an unbounded shell.

This is the kind of internal shape I wanted:

```python
self._executor = Executor(adapter.get_resource_limits())
self._planner = Planner()
self._generator = ExtensionGenerator()
self._introspector = ExtensionIntrospector()

self._safety = SafetyManager.get_instance()
self._audit = AuditLogger.get_instance()
self._optimizer = OptimizationEngine()
```

## How it is put together

I wired together a desktop adapter, model client, extension registry, and background autonomy loop into a single runtime. That gave me a practical architecture for long-running local use instead of a one-off demo flow.

```python
adapter = DesktopAdapter(
    api_key=config.api_key,
    working_directory=Path.cwd(),
    data_directory=data_dir,
    power_mode=config.power_mode
)
await adapter.initialize()

gemini = GeminiClient(config.api_key, model=config.model_name)
registry = ExtensionRegistry(data_dir / "extensions.db")
agent = Agent(adapter, gemini, registry)
```

The sandbox layer matters just as much to me. Since Delta can generate and run extension code, I wanted clear execution boundaries instead of treating the machine like an unrestricted shell.

## Repository

- GitHub: [github.com/JohnOjure/Delta](https://github.com/JohnOjure/Delta)

## Takeaway

Delta is my attempt at a local autonomous agent runtime that feels like real software architecture: stateful, extensible, and much more durable than a thin chat wrapper.
