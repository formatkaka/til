---
title: "Special Tokens"
date: "2025-12-26"
tags: ["llm", "ai", "tokenizer", "special-tokens"]
category: "llm"
---

## What are special tokens?

Special tokens are markers that help structure the input for language models. They're not regular words - they're control signals that tell the model how to interpret different parts of the text.

Think of them like HTML tags or formatting markers. They define boundaries, roles, and structure.

## Common special tokens

### Start/End markers

- `<|begin_of_text|>` - Marks the start of the input
- `<|end_of_text|>` or `<|eot_id|>` - Marks the end of a section or entire input

### Role markers

- `<|start_header_id|>system<|end_header_id|>` - System prompt section
- `<|start_header_id|>user<|end_header_id|>` - User message section
- `<|start_header_id|>assistant<|end_header_id|>` - Assistant response section

## Example: Simple text with special tokens

Here's how a basic prompt looks with special tokens:

```
<|begin_of_text|>I am excited to show Tokenizers in action to my LLM engineers
```

**Breakdown:**

1. `<|begin_of_text|>` - Special token marking the start
2. `I am excited to show Tokenizers in action to my LLM engineers` - The actual content

The model sees this as: "Start here, then process this text."

## Example: System and user prompts

Here's how a conversation with system instructions looks:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

Cutting Knowledge Date: December 2023

Today Date: 26 Jul 2024

You are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>

Tell a light-hearted joke for a room of Data Scientists<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

**Breakdown:**

1. `<|begin_of_text|>` - Start of entire input
2. `<|start_header_id|>system<|end_header_id|>` - System prompt section begins
3. System instructions (knowledge cutoff, date, role)
4. `<|eot_id|>` - End of system section
5. `<|start_header_id|>user<|end_header_id|>` - User message section begins
6. User's request
7. `<|eot_id|>` - End of user section
8. `<|start_header_id|>assistant<|end_header_id|>` - Assistant response section begins (model fills this)

This structure tells the model:
- What its role is (system)
- What the user wants (user)
- Where to put its response (assistant)

## How models learn special tokens

**Important**: Models are not specifically coded to understand these tokens. There's no hardcoded logic that says "when you see `<|start_header_id|>system`, do X."

Instead, models learn the meaning of these tokens through **pattern recognition** from training data.

### The training process

During training, the model sees millions of examples formatted like this:

```
<|start_header_id|>system<|end_header_id|>
You are a helpful assistant<|eot_id|>
<|start_header_id|>user<|end_header_id|>
What is 2+2?<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
4
```

After seeing this pattern repeated billions of times, the model learns:
- Text after `<|start_header_id|>system` is instructions
- Text after `<|start_header_id|>user` is a question
- Text after `<|start_header_id|>assistant` is where responses go

### Why this matters

This is **emergent behavior**, not programmed logic. The model learned these patterns statistically, not because someone wrote code saying "system tokens mean X."

This is why:
- Different models use different special tokens (they trained on different data)
- Models can sometimes get confused if you use tokens incorrectly
- The same model might interpret tokens slightly differently based on context

## Tokenizer's role

The tokenizer converts these special tokens into specific token IDs, just like regular words. But these IDs are reserved for special meanings.

```
<|begin_of_text|> → Token ID: 128000
<|start_header_id|> → Token ID: 128001
system → Token ID: 8878
<|end_header_id|> → Token ID: 128002
```

The model sees these IDs and recognizes the pattern from training.

