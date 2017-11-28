# React 概述

React 的内核相当精简，包括以下三个部分。

- Elements API
- Components API
- Prototypes

## React Elements

Elements API 定义了最基本的渲染单位。

每个 React 元素都是一个具有以下结构的对象。

```javascript
{
  type: /* ... */,
  key: /* ... */,
  ref: /* ... */,
  props: {
    // ...
    children: /* ... */,
    // ...
  }
}
```
