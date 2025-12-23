---
title: "TS files and config part 1"
date: "2025-12-23"
tags: ["tooling"]
category: "tooling"
---

### Typescript runs in 2 phases:

1.  Real-Time Type Checking

> tsc, deno, bun... commonly used for this step

```
You type code in VSCode
     ↓
TypeScript Language Service (separate process)
        ↓
Reads tsconfig.json
        ↓
Analyzes your code in memory
        ↓
Shows red squiggles for errors
        ↓
Provides autocomplete, hover info, etc.
```

2.  Build-Time Compilation

> tsc, deno, swc, esbuild, babel... can be used here

```
Execute the build step
TypeScript Compiler (tsc) starts
        ↓
1. Reads tsconfig.json configuration
        ↓
2. Type checks all files (same as VSCode)
        ↓
3. If errors found → BUILD FAILS ❌
        ↓
4. If no errors → Transpiles TypeScript to JavaScript
        ↓
5. Outputs files to dist/ folder
```

### Config Files associated with typescript

1.  `tsconfig.json` - TS config file.  
    Tell tsc how to compile the code.

```json
{
  "extends": "./path/to/base",           // Inherit from another config
  "compilerOptions": { ... },            // How to compile TypeScript
  "include": ["src/**/*"],               // What files to compile
  "exclude": ["node_modules"],           // What files to skip
  "files": ["specific-file.ts"],         // Specific files to include
  "references": [{ "path": "./lib" }]    // Project references (monorepos)
}
```

2.  `package.json` - TypeScript-related fields for publishing packages.

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "./dist/index.js", // Entry point for CommonJS
  "module": "./dist/index.mjs", // Entry point for ES modules
  "types": "./dist/index.d.ts", // Entry point for TypeScript types
  // or "typings": "./dist/index.d.ts"   // Older alias for "types"

  "exports": {
    // Modern way to define exports
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs", // For ES modules
      "require": "./dist/index.js" // For CommonJS
    }
  }
}
```

### Build Output Files

These files are generated during the TypeScript compilation process and typically found in `dist/` or `build/` directories:

1. `.d.ts files` - TypeScript declaration/type definition files.  
   These describe the types, interfaces, and function signatures.  
   Allow TypeScript to provide autocomplete and type checking when other projects import your code.

2. `.d.ts.map files` - Source map files.  
   Link the compiled .d.ts files back to the original .tsx source files.  
   Help IDEs show you the original source code when you "Go to Definition".

3. `tsconfig.tsbuildinfo` - TypeScript build cache.  
   Stores incremental build information.  
   Makes subsequent builds faster by tracking what changed.
