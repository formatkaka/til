---
title: "Framer Motion Layout Animations"
date: "2026-01-09"
tags: ["ui", "ux", "animation", "framer", "react"]
category: "ui-ux"
---

## What is it

Framer Motion's `layout` prop enables automatic layout animations. Just add it to any motion component:

```jsx
<motion.div layout />
```

When the element changes position or size, it smoothly transitions instead of jumping. No manual animation code needed.

## Layout changes

A layout change happens when an element changes position in a way that affects other elements on the page. Examples:
- Changing width/height (neighboring elements have to move)
- Changing `justify-content` (children reposition)

Using `transform` properties like `scale` is NOT a layout change because transforms don't affect other elements.

## Why not CSS?

CSS transitions have limitations:
1. Can't animate un-animatable properties like `justify-content`
2. Performance hit - browser recalculates layout 60 times per second for a 60 FPS animation

Transform animations are way faster because they don't trigger layout recalculations.

## How it works: FLIP

Framer Motion uses the **FLIP technique** to animate layout changes using fast transforms instead of slow layout properties:

1. **First** - Measure element's initial position
2. **Last** - Let layout change happen, measure final position
3. **Invert** - Apply transform to make it look like it's still in initial position
4. **Play** - Animate transform back to zero (final position)

Result: layout change appears animated, but it's actually just a transform animation.

## The tricky parts

**Transform origins** - When animating both position and size, you need to account for transform origin. The inverse step must compare distances between transform origins, not just top-left corners.

**Scale correction** - When a parent scales during animation, children get distorted. Solution: apply inverse scale to children every frame during the animation. The timing is non-linear (not the same as parent scale).

Framer Motion calculates `1 / parentScale` for each child on every frame to keep them the correct size.

## Why it matters

Layout animations are automatic. You declare what the layout should be, the animation figures itself out. No manual choreography for every state transition.

## Sources

[1] https://www.nan.fyi/magic-motion
