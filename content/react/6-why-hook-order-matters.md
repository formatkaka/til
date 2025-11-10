---
title: "React Callback Refs: A Better Alternative to useRef + useEffect"
date: "2025-10-10"
tags: ["react"]
category: "react"
---

```javascript
// Global state to track hooks for the current component
let componentHooks = [];
let currentHookIndex = 0;

// Custom useState implementation
function myUseState(initialValue) {
  // Capture the current hook index (closure)
  const hookIndex = currentHookIndex;

  // Initialize hook state if this is the first render
  if (componentHooks[hookIndex] === undefined) {
    componentHooks[hookIndex] = initialValue;
  }

  // Create setState function
  const setState = (newValue) => {
    componentHooks[hookIndex] = newValue;
    rerender(); // Trigger re-render
  };

  // Increment index for next hook call
  currentHookIndex++;

  // Return current state and setter
  return [componentHooks[hookIndex], setState];
}

// Reset hook index before each render
function rerender() {
  currentHookIndex = 0;
  // ... trigger component re-render
}
```

## HOW IT WORKS:

First render:

- myUseState('Alice') → hookIndex=0, stores 'Alice' in componentHooks[0], returns ['Alice', setState]
- myUseState(25) → hookIndex=1, stores 25 in componentHooks[1], returns [25, setState]
- myUseState(true) → hookIndex=2, stores true in componentHooks[2], returns [true, setState]

Second render (after setState is called):

- currentHookIndex reset to 0
- myUseState('Alice') → hookIndex=0, reads componentHooks[0], returns ['Alice', setState]
- myUseState(25) → hookIndex=1, reads componentHooks[1], returns [25, setState]
- myUseState(true) → hookIndex=2, reads componentHooks[2], returns [true, setState]

The order MUST stay the same! If you conditionally skip a hook:

❌ BROKEN:
if (condition) {
myUseState(25) → Sometimes hookIndex=0, sometimes hookIndex=1!
}

React gets confused because it can't map the correct state to the correct hook.
