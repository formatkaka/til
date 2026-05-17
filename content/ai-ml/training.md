---
title: "Training, Generalisation & Transfer Learning"
date: "2026-05-17"
tags: ["ai", "ml", "training", "deep-learning"]
category: "ai-ml"
---

## Training

You feed the model examples, it makes predictions, compares them to the right answers, and adjusts its weights to do better. Repeat millions of times.

Dataset is split into training (learns from this), validation (checks progress), and test (final score, held back till the end).

## Generalisation

A model generalises when it works on data it hasn't seen before — not just the training set.

- **Overfitting** — memorised the training data, falls apart on new data
- **Underfitting** — too simple, bad on everything

Goal is the sweet spot between the two.

## Transfer Learning

Take a model already trained on a huge dataset, adapt it to your task. Reusing knowledge instead of starting from scratch.

- **Feature extraction** — freeze the weights, add a small layer on top for your task
- **Fine-tuning** — unfreeze some weights and keep training on your data

Most real-world ML builds on top of foundation models this way — training from scratch costs millions.
