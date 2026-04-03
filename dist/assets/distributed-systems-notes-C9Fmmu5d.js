const e=`---
title: Designing Backpressure Before You Need It
date: 2026-03-22
excerpt: A short note on why I care more about bounded queues and visible failure modes than theoretical throughput.
published: true
tags: [distributed systems, concurrency, operations]
---

# Designing Backpressure Before You Need It

The failure mode I trust least in a backend system is "it was fast until it suddenly was not."

To me, that usually means the system accepted more work than it could safely process, hid the pressure for a while, and then failed somewhere downstream where the signal was harder to interpret. A queue grew without limits. Retries amplified the traffic. Latency moved from predictable to chaotic.

## What I actually want from concurrency

I do not want maximum parallelism by default. I want **bounded throughput** with visible tradeoffs:

- A fixed amount of in-flight work
- Predictable memory usage
- Clear rejection behavior when the system is full
- Enough instrumentation to know whether the bottleneck is CPU, I/O, or an external dependency

That is why I usually prefer a bounded worker pool over an "unlimited goroutines" style of pipeline.

## The practical pattern

At the edge, accept work only if capacity exists. If capacity is full, fail early or defer explicitly. The key is that pressure becomes observable.

\`\`\`go
type Job struct {
    ID   string
    Task func(context.Context) error
}

type Pool struct {
    jobs chan Job
}

func NewPool(size int, buffer int) *Pool {
    pool := &Pool{
        jobs: make(chan Job, buffer),
    }

    for i := 0; i < size; i++ {
        go func() {
            for job := range pool.jobs {
                _ = job.Task(context.Background())
            }
        }()
    }

    return pool
}

func (p *Pool) Submit(job Job) bool {
    select {
    case p.jobs <- job:
        return true
    default:
        return false
    }
}
\`\`\`

My point is not that this code is production-ready. My point is the shape:

- submission is non-blocking
- rejection is intentional
- the queue is bounded

From there you can layer metrics, retries with budgets, deadlines, and task-level tracing.

## Where teams usually get this wrong

Most teams treat backpressure as a scaling problem when it is really a **control-plane problem**. If the system cannot decide what to do under load, it is already under-specified.

The questions I care about are:

1. What gets dropped first?
2. Which work can be retried safely?
3. How do operators know saturation is happening before users feel it?

For me, those answers matter more than squeezing out another optimistic benchmark.

## Closing note

Throughput is attractive because it is easy to talk about. Pressure is more important because it is what production actually feels.

If a service will ever sit in front of real traffic, I would rather see its limits designed early than discovered by accident.
`;export{e as default};
