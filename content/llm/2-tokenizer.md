---
title: "Tokenizer Basics"
date: "2025-01-18"
tags: ["llm", "ai", "tokenizer"]
category: "llm"
---

## What is a tokenizer?

A tokenizer converts text into tokens - the numerical representations that language models actually work with.

Models don't understand words directly. They need numbers. The tokenizer is the bridge between human-readable text and the model's internal representation.

## Why tokenization matters

### Models work with numbers

LLMs are neural networks. They process numbers, not strings. Every piece of text must be converted to a sequence of numbers (token IDs) before the model can process it.

### Token limits

Every model has a context window - the maximum number of tokens it can process in one go. This includes both input and output.

- GPT-4: ~8,192 tokens
- GPT-4 Turbo: ~128,000 tokens
- Claude 3 Opus: ~200,000 tokens

You hit the limit? The request fails or gets truncated.

## How tokenization works

### The process

1. **Text in**: "Hello, world!"
2. **Tokenizer splits it**: ["Hello", ",", " world", "!"]
3. **Convert to token IDs**: [9906, 11, 1917, 0]
4. **Model processes**: Neural network operations on these numbers
5. **Detokenize output**: Convert token IDs back to text

### Token ≠ Word

Important: one token is not always one word.

- Short common words: "the" = 1 token
- Long words: "tokenization" might be 2-3 tokens
- Punctuation: Often separate tokens
- Spaces: Sometimes included, sometimes separate

Example: "Hello world!" might be 3-4 tokens depending on the tokenizer.

## Common tokenization approaches

### Subword tokenization

Most modern models use subword tokenization (BPE, SentencePiece, etc.). Splits words into smaller pieces that can be reused.

- "running" → ["run", "ning"]
- "tokenizer" → ["token", "izer"]

This handles:
- Unknown words (by breaking them into known subwords)
- Efficient vocabulary (reuse common substrings)
- Better compression

### Word-level tokenization

Older approach: one token per word. Problem: huge vocabularies, can't handle new words.

### Character-level tokenization

One token per character. Very inefficient, rarely used for LLMs.

## Token counting

### Why it matters

- **Pricing**: Most APIs charge per token
- **Context limits**: Need to know if your prompt fits
- **Performance**: More tokens = slower processing

### Tools

Most providers give you token counting tools:
- OpenAI: `tiktoken` library
- Anthropic: Built into their SDK
- Hugging Face: `transformers` library

## Example

```
Input text: "What is machine learning?"

Tokenizer output (simplified):
[What,  is,  machine,  learning, ?]

Token IDs: [2061, 318, 3174, 2081, 30]
```

The model sees `[2061, 318, 3174, 2081, 30]`, not the original text.

