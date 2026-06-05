---
title: Rate Limiter Service
excerpt: A production-grade FastAPI service implementing token-bucket rate limiting with deterministic middleware, latency tracking, and thread-safe metrics collection.
published: true
featured: false
tags: [backend, rate-limiting, fastapi, security]
stack: [Python, FastAPI, Docker, Pytest]
role: Creator
status: Shipped
link: ""
repo: "https://github.com/qeinstein/rate_limiter"
---

# Rate Limiter Service

This project is a high-availability, microsecond-latency API rate-limiting service built with FastAPI and Python. It implements a per-client token-bucket rate limiting algorithm to prevent abuse while ensuring high quality-of-service for authentic users.

## Engineering Features

- **Starlette BaseHTTPMiddleware**: Engineered a custom Starlette middleware that intercepts incoming HTTP requests, checks token balances, appends rate-limiting headers to responses, and logs metrics.
- **Concurrency & Thread Safety**: Uses thread-safe memory caches and atomic counters for metrics tracking to eliminate race conditions under high concurrency.
- **Comprehensive Testing**: Covered with a complete Pytest suite checking middleware bounds, edge-case headers, token-bucket replenishment rates, and error responses.
- **Deployment**: Fully dockerized with multi-stage build pipelines, enabling zero-dependency container deployment.
