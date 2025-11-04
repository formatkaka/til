---
title: "React Clone Element API"
date: "2025-10-10"
tags: ["react"]
category: "react"
---

[`cloneElement`](https://react.dev/reference/react/cloneElement) is a React utility that creates a copy of a React element and allows you to override its props. 

Usage: Overriding props of a component


```javascript
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

`cloneElement` is now considered legacy API and following alternatives must be used when needed.
- Render Props
- Context
- Custom Hook