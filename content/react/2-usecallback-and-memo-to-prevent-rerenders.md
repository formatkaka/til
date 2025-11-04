---
title: "React Vocab 1"
date: "2025-09-21"
tags: ["react"]
category: "react"
---

## Using useCallback and React.memo to prevent re-renders

```javascript
export default function useBoolean(initialValue) {
  const [state, setState] = useState(initialValue || false);

  return {
    value: state,
    setTrue: () => setState(true),
    setFalse: () => setState(false),
  }
}

// CompA:

const {value, setTrue, setFalse} = useBoolean();

return (
  <>
    <CompB value={value} />
    <CompC setFalse={setFalse} />
    <CompD setTrue={setTrue} />
  </>
)
```

In the above example , if `CompA` re-renders, the hook `useBoolean` runs again. Now when this runs, in it's return `setTrue` and `setFalse` are created with new references. This will cause everything to re-render. To optimise this, We can 

1. Add useCallback to react hook returns
2. Wrap `CompC` and `CompD` with `React.memo`


```javascript
export default function useBoolean(initialValue) {
  const [state, setState] = useState(initialValue || false);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  return {
    value: state,
    setTrue,
    setFalse,
  }
}

// CompA:

/**
  If value is used like this
  const usebool = useBoolean();

  if usebool is used directly , then the return from hook must be memoized
*/

const {value, setTrue, setFalse} = useBoolean();

return (
  <>
    <CompB value={value} />
    <CompC setFalse={setFalse} />
    <CompD setTrue={setTrue} />
  </>
)

// CompC: React.memo(CompCImplementation)
// CompD: React.memo(CompDImplementation)
```