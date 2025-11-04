---
title: "Understanding useRef and closures in React"
date: "2025-10-10"
tags: ["react"]
category: "react"
---

Closures capture values when they're created. If you capture a function in useEffect, it stays the same even when the function changes.

```javascript
// Problem: listener captures old handler
useEffect(() => {
  const listener = () => handler();
  element.addEventListener("click", listener);
}, []);
```

useRef solves this by letting you mutate an object's property:

```javascript
const latestHandler = useRef(handler);
latestHandler.current = handler;

useEffect(() => {
  const listener = () => latestHandler.current(); // reads current value
  element.addEventListener("click", listener);
}, []);
```

The closure captures the ref object (which never changes), but you keep updating `.current`. When the listener runs, it reads whatever's in `.current` at that moment.

**Why wrapping in a callback doesn't help:**

```javascript
useEffect(() => {
  const cb = (...args) => handler(...args);
  element.addEventListener("click", cb);

  return () => element.removeEventListener("click", cb);
}, [handler]);
```

This looks like it should work - the cleanup captures the same `cb` that was added. And it does work correctly! The catch is performance: every time `handler` changes, you remove and re-add the event listener. With useRef, the listener is added once and always calls the latest handler.

**This pattern works with any object:**

```javascript
function makeLogger() {
  const obj = { value: 1 };

  const logger = () => console.log(obj.value); // closure over obj

  obj.value = 2; // mutate property
  logger(); // logs 2 ✅

  // obj = { value: 3 }; // can't reassign - obj is const
  return logger;
}
```

Closures capture object references, not their contents. As long as you mutate properties instead of reassigning the object, the closure reads the latest values.

useRef is just React's way to guarantee the same object across renders.
