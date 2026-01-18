---
title: "LLM Day 1 Basics"
date: "2025-12-26"
tags: ["llm", "ai", "api"]
category: "llm"
---

## Types of models

### Frontier models

The bleeding-edge stuff. These are the most capable models from companies like OpenAI, Anthropic, Google. Think GPT-4, Claude Opus, Gemini Ultra.

They're expensive but powerful. Best reasoning, longest context windows, most reliable outputs.

### Open source models

Models you can download and run yourself. Llama, Mistral, Phi - there are tons now.

Tradeoff: less capable than frontier models, but you control the infrastructure. No API costs if you self-host, and your data stays private.

## 3 ways to use models

### 1. Playground/Chat interface

The easy on-ramp. Just type in a web UI and get responses. Good for experimentation and one-off tasks.

Every provider has one: ChatGPT, Claude.ai, Gemini chat.

### 2. API calls

Programmatic access. You send HTTP requests, get responses back. This is how you integrate LLMs into actual applications.

Most common for production use. Pay per token.

### 3. Self-hosted

Download the model weights, run them on your own hardware. Needs GPUs with enough VRAM.

Only realistic with open source models. Full control, but you handle all the infrastructure.

## Completions API basics

At its core, stupidly simple: you send text in, get text out.

### The basic flow

```
POST /v1/chat/completions
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "What is 2+2?"}
  ]
}
```

Response:

```
{
  "choices": [
    {"message": {"content": "4"}}
  ]
}
```
