---
title: "CommonJS and ESM Modules"
date: "2025-09-09"
tags: ["javascript"]
category: "js"
---

## What is a module ?

A module is just a file which contains reusable code serving specific purpose

### CJS

1. Primarily used in Node.JS
2. Modules are loaded only dynamically at runtime.
3.

```javascript
// my-module.js
const value = 42;
module.exports = { value };

// main.js
const myModule = require("./my-module.js");
console.log(myModule.value); // 42
```

### ESM

Important Points

1. Modules always work in strict mode.
2. In a module, “this” is undefined
3. In browsers, module scripts are always deferred (same as `<script defer src="..." />`)
4. Can be static or dynamic
   - `import` declaration is statically loaded at compile-time. (Thus, treeshaking can be done)
   - `import()` function is dynamic (Code splitting / Lazy Loading)
5. If the same module is imported into multiple other modules, its code is executed only once, upon the first import. Then its exports are given to all further importers. Thus, the module level variables behavior.

```javascript
// say.js
index.html

export function sayHi(user) {
  return `Hello, ${user}!`;
}

// import declaration - Statically loaded
<!doctype html>
<script type="module">
  import {sayHi} from './say.js';

  document.body.innerHTML = sayHi('John');
</script>

// import function - Dynamically loaded
const button = document.createElement('button');
button.textContent = 'Load and greet Sarah';
button.onclick = async () => {
  // This only loads when button is clicked
  const module = await import('./say.js');
  alert(module.sayHi('Sarah'));
};
document.body.appendChild(button);

```
