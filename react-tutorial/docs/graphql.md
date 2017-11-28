# GraphQL的用法

GraphQL 是一种客户端与 API 的通信语言，具体来说，就是客户端向 API 查询数据的语法。与传统的 REST 方式相比，GraphQL 效率更高，更节省带宽，只取回需要的数据。

## 简介

我们希望取回下面的数据。

```javascript
{
  "id": "c49bc1e1-26c1-49c5-b9c5-c89e24be0ac4",
  "url": "https://pics.example.com/dog",
  "caption": "My Dog",
  "author": {
    "id": "5a0cba48-c014-4cf0-b6fb-0bf7514b8165",
    "name": "Alice"
  }
}
```

GraphQL就可以写成下面的样子。

```javascript
node(id: "c49bc1e1-26c1-49c5-b9c5-c89e24be0ac4") {
  id,
  url,
  caption,
  author {
    id,
    name
  }
}
```
