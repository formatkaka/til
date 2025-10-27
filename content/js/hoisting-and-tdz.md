---
title: "Hoisting And Temporal dead zones"
date: "2025-09-09"
tags: ["javascript"]
category: "js"
---

## Hoisting

```
1. Being able to use a variable's value in its scope before the line it is declared. ("Value hoisting")

    - function, async function, import

2. Being able to reference a variable in its scope before the line it is declared, without throwing a ReferenceError, but the value is always undefined. ("Declaration hoisting")

    - var

3. The declaration of the variable causes behavior changes in its scope before the line in which it is declared.

    - let, const, class

4. The side effects of a declaration are produced before evaluating the rest of the code that contains it.

    - import
```


### Is let, const completely non-hoisting ?

```
const x = 1;
{
  console.log(x); // ReferenceError
  const x = 2;
}
```

Ideally x should read the value 1 if there is no hoisting. 
However, because the const declaration still "taints" the entire scope it's defined in, the `console.log(x)` statement reads the x from the `const x = 2` declaration instead, which is not yet initialized, and throws a ReferenceError.
Still, it may be more useful to characterize lexical declarations as non-hoisting, because from a utilitarian perspective, the hoisting of these declarations doesn't bring any meaningful features.

[Reference MDN - Hoisiting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)

## Temporal Dead Zone

`let` and `const` variables are not initialized and accessing them before the declaration will result in a `ReferenceError` exception because they are in a "temporal dead zone" from the start of the block until the declaration is processed.


```
--- TDZ starts for baz and bar ---
console.log(foo); // undefined 
var foo = 'foo';

console.log(baz); // ReferenceError
let baz = 'baz';
--- TDZ ends for baz ---

console.log(bar); // ReferenceError
const bar = 'bar';
--- TDZ ends for bar ---
```