---
title: Intelligent Proxy
excerpt: I built this Python proxy server to combine request filtering, dynamic blocklists, caching, tunneling, and lightweight traffic controls.
published: true
tags: [networking, security, proxies, python]
stack: [Python, HTTP, Requests, ThreadingTCPServer]
role: Backend and security engineer
status: Working prototype
link: ""
repo: "https://github.com/qeinstein/intelligent_proxy"
---

# Intelligent Proxy

I built Intelligent Proxy as a lightweight Python proxy that does more than blind forwarding. It sits in the middle of traffic, blocks known bad destinations, inspects responses for suspicious content, caches safe responses, and exposes a small admin surface for visibility.

## What it actually includes

In the current build, I cover:

- HTTP GET and POST forwarding
- HTTPS CONNECT tunneling
- static and remotely refreshed blocklists
- response caching in memory and on disk
- request rate limiting per client IP
- authorization checks for protected operations
- an admin dashboard endpoint

The main request path reflects the behavior I wanted:

```python
cached = load_from_cache(full_url)
if cached:
    self.send_response(200)
    self.end_headers()
    self.wfile.write(cached)
    return

resp = requests.get(full_url, headers=headers, timeout=5)
if contains_malicious_keyword(resp.text, MALICIOUS_KEYWORDS):
    self.send_response(403)
    self.end_headers()
    self.wfile.write(b"Malicious content blocked")
    return
```

## Why the project is interesting

I was not trying to pretend this was a full enterprise security appliance. The value for me was combining a few useful edge controls in one understandable codebase:

- block malicious hosts
- score content cheaply
- keep repeated requests fast with cache reuse
- reject abusive clients before they dominate the process

The rate limiter is simple, but it fits the current scope well:

```python
def is_rate_limited(client_ip):
    now = time.time()
    logs = REQUEST_LOG[client_ip]
    REQUEST_LOG[client_ip] = [t for t in logs if now - t < 60]
    if len(REQUEST_LOG[client_ip]) >= RATE_LIMIT:
        return True
    REQUEST_LOG[client_ip].append(now)
    return False
```

## Repository

- GitHub: [github.com/qeinstein/intelligent_proxy](https://github.com/qeinstein/intelligent_proxy)

## Takeaway

Intelligent Proxy is a practical networking project where I explored traffic control, caching, filtering, and proxy behavior without hiding the logic behind unnecessary complexity.
