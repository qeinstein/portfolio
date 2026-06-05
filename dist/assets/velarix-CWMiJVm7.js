const e=`---
title: Velarix
excerpt: A decision-integrity and symbolic mechanistic interpretability engine for AI agents that eliminates logical hallucinations by offloading stateful reasoning to a deterministic Go kernel.
published: true
featured: true
tags: [ai-safety, mechanistic-interpretability, agents, go]
stack: [Go, Python, TypeScript, SQLite, PostgreSQL, spaCy, GLiNER]
role: Creator & Lead Architect
status: Shipped
link: ""
repo: "https://github.com/qeinstein/velarix"
---

# Velarix

Velarix is a symbolic mechanistic interpretability and decision-integrity engine for AI agents. Rather than relying entirely on probabilistic LLMs for planning, memory, and auditing, Velarix offloads stateful reasoning to a deterministic Go-based kernel. This approach ensures 100% verifiable causal traces, robust belief revision, and zero-inference-cost logical checks.

## Key Architecture

Velarix splits execution into two halves:
1. **The Epistemic Go Kernel**: A fast, deterministic core implementing a symbolic **Truth Maintenance System (TMS)**. It constructs an OR-of-AND justification graph, detects cycles at assertion time, and handles non-monotonic belief revision.
2. **The Cognitive Sidecar (Delta)**: A high-performance NLP fact extraction pipeline written in Python using spaCy, coreferee, and GLiNER. It parses text into logical assertions at low latency (p50: 35.6 ms, p99: 56.3 ms) and high accuracy (96.3% triple recall) with zero LLM API cost.

## Features

- **Verifiable Causal Traces**: Every decision or belief of an AI agent is tracked through a directed acyclic graph (DAG) of justifications. If an underlying premise changes, Velarix automatically recalculates the agent's belief state using truth maintenance, preventing hallucinated conclusions.
- **Interoperability**: First-class integration surfaces for LangGraph, CrewAI, LlamaIndex, and OpenAI.
- **Enterprise-Grade Backend**: Postgres-backed persistent storage with JWT authentication, tenant isolation, actor attribution, and a powerful \`vlx\` CLI tool for counterfactual auditing and root-cause analysis.
`;export{e as default};
