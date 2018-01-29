## 闭包

当内部函数比外部函数具有更长的声明周期的时候，外部函数中除了内部函数的其他部分将形成一个不会被函数外访问到的作用域，这个作用域中的内容可以通过内部函数来进行访问，这样就形成了一个闭包。

下面的代码：

```javascript
var myObject = function () {
  var value = 0;
  return {
    increment: funcction (inc) {
      value += typeof inc === 'number' ? inc : 1;
    },
    getValue: function () {
      return value;
    }
  }
}();
```

由于对于`value`变量的引用被外部函数返回的对象字面量使用了，所以，外部函数作用域中的`value`不会被清理，并且这个变量不会直接被程序所访问，只能够通过外部函数暴露出来的方法进行访问。

这样就形成了传统的OO语言的私有属性，只能够在对象内部使用。上面函数返回的两个方法*可以访问到它被创建时候所处的上下文环境，称为闭包。*

并且这个方法访问的并不是变量的复制，而是实际的变量本身，也就是闭包中的内容可以被直接访问到，其修改也会直接影响到其对于外部的接口。

```Javascript
var fade = function (node) {
  var level = 1;
  var step = function () {
    var hex = level.toString(16);
    node.style.backgroundColor = '#FFFF' + hex + hex;
    if (level < 15) {
      level += 1;
      setTimeout(step, 100);
    }
  };
  setTimeout(step, 100);
};
// 可以看到每次递归step函数的时候，都能够直接访问到level变量的当前值，并且也可以对这个值
// 进行修改，修改会直接影响到外层函数内部所有对于level的引用
fade(document.body)
```

下面的例子可以很好的体现函数内部可以直接访问外部变量的值，而不需要复制，每次进行事件处理绑定的时候，事件处理函数仍然可以访问外部函数的变量的，也就是每次调用的时候都会返回`i`的最终值，而不是每次传递进去的值，除非为事件处理函数再写一个闭包：

```javascript
// 这段代码绑定的所有事件处理都会返回同样的值
var add_the_handlers = function (nodes) {
  var i;
  for (i = 0; i < nodes.length; i++) {
    nodes[i].onclick = function (e) {
      alert(i);
    }
  }
}

// 这样修复可以让事件处理函数返回需要的值将变量直接引用改成了将变量作为参数传递进去
var add_the_handlers = function (nodes) {
  var i;
  for (i = 0; i < nodes.length; i++) {
    nodes[i].onclick = function (i) {
      return function(e) {
        alert(i);
      }
    }(i);
  }
}

// 使用let也可以达到一样的效果，但这个和闭包没有什么关系，因为let是有块级作用域的，
// 所以这里的每一个循环都是函数块，都使用的是单独的块级作用域
var add_let_handlers = function (nodes) {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].onclick = function (e) {
      alert(i);
    }
  }
}

```

