---
title: "Is JS pass by value or reference ?"
date: "2025-10-30"
tags: ["javascript"]
category: "js"
---

What we generally think ?

> Primitives are passed by value; objects are passed by reference.

The most shared example to validate this claim is

```javascript
const changeObj = (obj) => {
  obj.key1 = "value2";
  console.log(obj.key1); // value2
};

const obj = { key1: "value1" };
console.log(obj.key1); // value1
changeObj(obj);
console.log(obj.key1); // value2
```

### Asking what is pass by reference ?

True References Are <b>Aliases</b>. They actually share the same address.

```c++
  #include <iostream>

  void swap(int& a, int& b) {
      int temp = a;
      a = b;
      b = temp;
  }

  int main() {
      int x = 5;
      int y = 6;
      //  x = 6, y = 5
      swap(x, y);
  }

```

### What javascript object references are ?

JS object references are pointers. The variable points to object in memory. But if we change the value of object variable, the original variable still points to the original object.

```javascript
function changeObject(x) {
  x = { member: "bar" };
  console.log("in changeObject: " + x.member);
}

function changeMember(x) {
  x.member = "bar";
  console.log("in changeMember: " + x.member);
}

var x = { member: "foo" };

console.log("before changeObject: " + x.member);
changeObject(x);
console.log("after changeObject: " + x.member); /* change did not persist */

console.log("before changeMember: " + x.member);
changeMember(x);
console.log("after changeMember: " + x.member); /* change persists */
```

Sources:

1. [Stack Overflow - Is JavaScript a pass-by-reference or pass-by-value language?](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language/3638034#3638034)
2. [Blog - Is JavaScript Pass by Reference?](https://www.aleksandrhovhannisyan.com/blog/javascript-pass-by-reference)
