---
title: TurboQuant
excerpt: An implementation and extension of TurboQuant (arXiv:2504.19874)—a two-stage LLM KV cache compression pipeline combining Lloyd-Max scalar quantization with 1-bit QJL inner product correction.
published: true
featured: true
tags: [llm-opt, quantization, py-torch, math]
stack: [Python, PyTorch, GPT-2, WikiText-2]
role: Lead Researcher & Engineer
status: Completed Research
link: "https://arxiv.org/abs/2504.19874"
repo: "https://github.com/qeinstein/TurboQuant"
---

# TurboQuant

TurboQuant is a two-stage LLM Key-Value (KV) cache compression pipeline designed to reduce memory footprints in long-context text generation. This project implements and benchmark-tests the TurboQuant framework (arXiv:2504.19874), combining Lloyd-Max scalar quantization with a 1-bit Quantized Johnson-Lindenstrauss (QJL) inner product corrector.

## Core Innovations

- **Quantization Schema**: Achieves **4.7× compression** using 4-bit key quantization combined with 2-bit value quantization, preserving a cosine similarity of ~0.92 compared to standard float16.
- **Inner Product Correction**: Uses a 1-bit QJL sketch mapping to adjust dot products in the attention calculation, correcting for quantization bias.
- **Empirical Breakthrough**: During testing on WikiText-2 and GPT-2, I identified and empirically verified an unexplored configuration: doubling the QJL sketch size to $m = 2d$ (a parameter not tested in the original TurboQuant or PolarQuant papers). This configuration cuts the perplexity gap from +21.11 down to +9.83, less than half the baseline quality loss at minimal computational overhead.

## Benchmarks & Testing

- Implemented an **82-test validation suite** ensuring unbiasedness, mean squared error (MSE) bounds, bit-packing efficiency, and end-to-end generation correctness.
- Evaluated models on WikiText-2 with GPT-2 baselines.
