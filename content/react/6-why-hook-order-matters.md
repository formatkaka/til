---
title: "React Callback Refs: A Better Alternative to useRef + useEffect"
date: "2025-10-10"
tags: ["react"]
category: "react"
---

# Custom useState Implementation

## Important: Hooks are Per-Component Instance

Each component instance needs its own hooks array. React maintains a "current fiber" concept - when rendering a component, React sets a global pointer to that component's fiber node, which contains its hooks array.

## Simplified Implementation (Single Component)

```javascript
// Global state to track hooks for the CURRENTLY RENDERING component
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

## More Realistic Implementation (Multiple Components)

```javascript
// Map of component instances to their hook states
const componentHooksMap = new WeakMap();
let currentlyRenderingComponent = null;
let currentHookIndex = 0;

function myUseState(initialValue) {
  // Get the hooks array for the currently rendering component
  let componentHooks = componentHooksMap.get(currentlyRenderingComponent);

  if (!componentHooks) {
    componentHooks = [];
    componentHooksMap.set(currentlyRenderingComponent, componentHooks);
  }

  const hookIndex = currentHookIndex;

  // Initialize hook state if this is the first render
  if (componentHooks[hookIndex] === undefined) {
    componentHooks[hookIndex] = initialValue;
  }

  const setState = (newValue) => {
    componentHooks[hookIndex] = newValue;
    // Rerender only this specific component instance
    rerenderComponent(currentlyRenderingComponent);
  };

  currentHookIndex++;

  return [componentHooks[hookIndex], setState];
}

function renderComponent(component) {
  // Set the global pointer to this component
  currentlyRenderingComponent = component;
  currentHookIndex = 0;

  // Render the component (calls all its hooks)
  const result = component.render();

  // Clear the global pointer
  currentlyRenderingComponent = null;

  return result;
}
```

## How React Actually Does It

React uses a **fiber tree** where each component instance (fiber node) has its own `memoizedState` linked list:

```javascript
// Simplified version of React's actual approach
const fiber = {
  memoizedState: null, // Points to first hook
  // ... other fiber properties
};

// Each hook is a node in a linked list
const hook = {
  memoizedState: value, // The actual state value
  queue: updateQueue, // Pending updates
  next: nextHook, // Points to next hook
};

// When rendering a component:
// 1. React sets currentlyRenderingFiber = thisFiber
// 2. Sets currentHook to fiber.memoizedState (start of linked list)
// 3. Each useState call moves to the next hook in the list
// 4. After render, currentlyRenderingFiber = null
```

**Key points:**

- `currentlyRenderingFiber` is a **global pointer** that changes as React walks the component tree
- Each fiber (component instance) has its **own hooks linked list**
- The global `currentHookIndex` only exists during that component's render
- Multiple instances of the same component each have separate hook states

## How It Works

### First Render

```javascript
const [name, setName] = myUseState("Alice"); // hookIndex=0, stores 'Alice' in componentHooks[0]
const [age, setAge] = myUseState(25); // hookIndex=1, stores 25 in componentHooks[1]
const [isDev, setIsDev] = myUseState(true); // hookIndex=2, stores true in componentHooks[2]

// componentHooks = ['Alice', 25, true]
// currentHookIndex = 3
```

### Second Render (after setState is called)

```javascript
// currentHookIndex reset to 0 before render

const [name, setName] = myUseState("Alice"); // hookIndex=0, reads componentHooks[0] → 'Alice'
const [age, setAge] = myUseState(25); // hookIndex=1, reads componentHooks[1] → 25
const [isDev, setIsDev] = myUseState(true); // hookIndex=2, reads componentHooks[2] → true

// Same order = correct state retrieval
```

## Why Hook Order Matters

React uses an **incrementing index**, not variable names, to track which state belongs to which hook.

### ❌ Broken Example: Conditional Hook

```javascript
function Component() {
  const [name, setName] = myUseState("Alice"); // Always hookIndex=0

  if (someCondition) {
    const [age, setAge] = myUseState(25); // Sometimes hookIndex=1, sometimes skipped
  }

  const [job, setJob] = myUseState("Developer"); // hookIndex=1 or 2 depending on condition!
}

// First render (someCondition = true):
// componentHooks = ['Alice', 25, 'Developer']

// Second render (someCondition = false):
// componentHooks[1] is expected to be 'Developer' but it's 25!
// React gets confused!
```

### ✅ Fixed Example: Always Call Hooks

```javascript
function Component() {
  const [name, setName] = myUseState("Alice"); // Always hookIndex=0
  const [age, setAge] = myUseState(25); // Always hookIndex=1
  const [job, setJob] = myUseState("Developer"); // Always hookIndex=2

  // Conditionally USE the values, not conditionally CALL the hooks
  return (
    <div>
      <p>{name}</p>
      {someCondition && <p>{age}</p>}
      <p>{job}</p>
    </div>
  );
}
```

## Key Insights

1. **React doesn't use variable names** - it only knows "hook #0, hook #1, hook #2..."
2. **The index is captured via closure** - each `setState` remembers its `hookIndex`
3. **The array must stay the same size** - never grows or shrinks between renders
4. **Order is everything** - skip a hook and all subsequent hooks get wrong state
5. **Hooks are per-component instance** - each instance has its own hooks array/linked list

## Example: Multiple Component Instances

```javascript
function Counter() {
  const [count, setCount] = myUseState(0); // Each Counter instance gets its own state
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

function App() {
  return (
    <>
      <Counter /> {/* Instance 1: has its own hooks array */}
      <Counter /> {/* Instance 2: has its own hooks array */}
      <Counter /> {/* Instance 3: has its own hooks array */}
    </>
  );
}

// Each Counter maintains independent state because React tracks hooks
// per component instance (fiber node), not globally
```

## Rules of Hooks

This implementation explains why React has these rules:

- ✅ **Always call hooks at the top level** - never inside conditions, loops, or nested functions
- ✅ **Call hooks in the same order every render** - the index system depends on it
- ✅ **Only call hooks from React functions** - they need the render lifecycle to work

The solution is simple: **Call hooks unconditionally, but use their values conditionally**.
