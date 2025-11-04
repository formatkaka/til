---
title: "React Callback Refs: A Better Alternative to useRef + useEffect"
date: "2025-10-10"
tags: ["react"]
category: "react"
---

# React Callback Refs: A Better Alternative to useRef + useEffect

Many developers reach for this pattern when they need to interact with DOM nodes:

```jsx
const ref = useRef(null);

useEffect(() => {
  ref.current?.focus();
}, []);

return <input ref={ref} />;
```

**Issues with this approach:**

- Effect is bound to the parent component's lifecycle, not the DOM node's
- If the node renders conditionally or is deferred, `ref.current` might be `null` when the effect runs
- Runs twice in strict mode
- Uses two hooks instead of one

### When useRef + useEffect Breaks: Conditional Rendering

Here's a concrete example where the `useRef + useEffect` pattern **fails completely**:

```jsx
function App() {
  const ref = useRef(null);

  useEffect(() => {
    // 🚨 ref.current is ALWAYS null when this runs
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return <Form ref={ref} />;
}

const Form = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  return (
    <form>
      <button type='button' onClick={() => setShow(true)}>
        Show Input
      </button>
      {/* 🧐 Input renders conditionally */}
      {show && <input ref={ref} />}
    </form>
  );
});
```

**What happens:**

1. `Form` component mounts
2. `input` is NOT rendered (because `show` is `false`)
3. `ref.current` is still `null`
4. Effect runs in `App` → does nothing because `ref.current` is `null`
5. User clicks "Show Input" button
6. `input` now renders and `ref` gets populated
7. **But the effect never runs again!** The input is never scrolled to.

**The root issue:** The effect is tied to the `App` component's mount, but we actually want to run code when the **input** renders, which happens later.

### The Callback Ref Solution

```jsx
function App() {
  const scrollToNode = (node) => {
    node?.scrollIntoView({ behavior: "smooth" });
  };

  return <Form ref={scrollToNode} />;
}

const Form = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  return (
    <form>
      <button type='button' onClick={() => setShow(true)}>
        Show Input
      </button>
      {show && <input ref={ref} />}
    </form>
  );
});
```

**What happens:**

1. `Form` component mounts
2. `input` is NOT rendered
3. Callback ref is NOT called yet
4. User clicks "Show Input" button
5. `input` renders
6. **Callback ref is called immediately** with the input node
7. Input scrolls into view ✅

**The fix:** Callback ref is tied to the input's lifecycle, not the parent's, so it runs exactly when we need it to.

## The Solution: Callback Refs

Refs can accept functions, not just ref objects:

```jsx
<input
  ref={(node) => {
    node?.scrollIntoView({ behavior: "smooth" });
  }}
/>
```

**Key insights:**

- Callback refs run **after the DOM node renders**
- They're called with the node when it mounts, and `null` when it unmounts
- They're bound to the node's lifecycle, not the parent component's
- Perfect place for side effects involving DOM nodes

## Three Patterns for Callback Refs

### 1. Extract the Function (Best for Simple Cases)

```jsx
const scrollToNode = (node) => {
  node?.scrollIntoView({ behavior: "smooth" });
};

function CustomInput() {
  return <input ref={scrollToNode} />;
}
```

**Benefits:**

- Function never recreates
- Works perfectly without `useCallback`
- Most explicit about "run once" intent

### 2. Inline Function (When You Need Component State)

```jsx
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = (node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  };

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

**Why this works:**

- Runs on every render initially
- `setState` with same value bails out of re-render
- Stabilizes automatically (no infinite loop)
- **Note:** Only works with primitive values, not objects

### 3. With useCallback (Use Sparingly)

```jsx
const ref = useCallback((node) => {
  node?.scrollIntoView({ behavior: "smooth" });
}, []);

return <input ref={ref} />;
```

**When to use:**

- When you need referential stability
- **Warning:** Don't rely on `useCallback` for correctness (it's a performance hint, not a guarantee)
- React Compiler will make manual `useCallback` unnecessary

## React 19: Cleanup Functions

Callback refs can now return cleanup functions:

```jsx
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = (node) => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });

    observer.observe(node);

    // Cleanup function (new in React 19!)
    return () => {
      observer.disconnect();
    };
  };

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

**Benefits:**

- No more `null` calls on unmount
- Cleaner resource management
- Works like `useEffect` cleanup

## When to Use What?

| Scenario                          | Use                                          |
| --------------------------------- | -------------------------------------------- |
| Need direct DOM node access       | **Callback ref** (especially if extractable) |
| Side effect doesn't need the node | **useEffect**                                |
| One-time DOM operation            | **Extracted callback ref**                   |
| Dynamic measurements              | **Callback ref with cleanup**                |
| Conditional rendering of target   | **Callback ref** (not useEffect)             |

## Key Takeaways

✅ **DO:**

- Use callback refs for DOM node interactions
- Extract functions outside component when possible
- Use cleanup functions in React 19 for resource management
- Think of refs as "run after render" hooks

❌ **DON'T:**

- Don't rely on `useCallback` for correctness
- Don't store objects in state inside callback refs (causes infinite loops)
- Don't use `useRef + useEffect` for simple DOM interactions
- Don't use callback refs for side effects unrelated to the DOM

## The Mental Model

Think of `ref` on a React element as:

```jsx
onAfterRender={(node) => {
  // Do something with the node
}}
```

It's a function that runs after rendering with direct access to the DOM node—the perfect place for DOM-related side effects.

---

**Sources:**

- [Avoiding useEffect with callback refs](https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs)
- [Ref Callbacks, React 19 and the Compiler](https://tkdodo.eu/blog/ref-callbacks-react-19-and-the-compiler)
