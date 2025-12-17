---
title: "Finite and Infinite State Machines"
date: "2025-12-17"
tags: ["computer-science", "state-machines"]
category: "core"
---

## Finite State Machines (FSM)

Basically a system that can be in one state at a time from a fixed set of states. Changes state based on inputs/events.

Think of it like:
- Traffic light: Red → Green → Yellow → Red
- UI state: Loading → Success/Error
- Game: Menu → Playing → Paused → GameOver

Simple door lock example:
```
LOCKED + insert coin → UNLOCKED
UNLOCKED + push → LOCKED
```

Two main types:
- **DFA** (Deterministic): one clear next state for each input
- **NFA** (Non-deterministic): multiple possible next states

Perfect for UI state management, simple protocols, anything with predictable states.

## Infinite State Machines

Has unlimited possible states. Think of a calculator - it can theoretically hold any number, so infinite states. Or a counter that keeps incrementing forever.

More powerful than FSM because it has unbounded memory (like a Turing machine with infinite tape, or stack that can grow forever).

Can solve problems that FSMs can't - like matching nested parentheses of any depth.

## The Difference

**Finite**: Fixed number of states, no external memory. Great for simple logic.
**Infinite**: Unlimited states, has memory. Needed for general computation.

Most real-world apps use FSMs because they're easier to understand and debug. Infinite state machines are more theoretical (Turing machines, etc).

---

Resources:
- [XState - JS state machine library](https://xstate.js.org/)
- [State Machines Basics](https://statecharts.dev/)
- [Turing Machines](https://plato.stanford.edu/entries/turing-machine/)
