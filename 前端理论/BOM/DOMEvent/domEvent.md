## DOM Event

### 注册事件监听

Event接口表示在DOM中发生的任何事件，在现代浏览器中，为DOM元素添加事件监听处理函数的方法有三种：

1. `EventTarget.addEventListener`方法可以为所有的元素添加各种类型的事件监听。但是这个方法在IE6~IE8中不适用，需要用`EventTarget.attachEvent`来替代。
2. 可以直接通过HTML属性来为元素添加事件处理方法，*这种方法会导致HTML的可读性和可维护性变差，所以尽量不要使用这种方法*。
3. DOM元素属性，也是通过HTML添加的，通过获取DOM元素并且为其添加相应的属性，这样对于每一个元素只能够添加一个事件处理。

### 事件流的三个阶段

在DOM事件中，事件流从触发到完成共有三个阶段，分别是：事件捕获阶段、目标阶段以及事件冒泡阶段。

在任何对象触发事件开始之前，必须要确定一个事件的传播路径。传播路径是一个有序的当前事件传递的一个列表。这个列表是基于当前文档结构产生的。这个列表的最后一个节点是当前触发事件的元素。之前的节点都是这个元素的祖先。

当这个传播路径被确定了之后，事件开始其三个传播阶段，如果事件不支持该阶段，那么这个阶段会被跳过，或者这个事件对象的冒泡可能被停止。当调用`stopPropagation`或者传入的`bubbles`参数为`false`都会导致事件的一部分被中断。

* 捕获阶段：从`window`对象一直到触发事件的DOM元素的父元素。
* 目标阶段：然后事件对象会到达触发该事件的对象，如果事件类型参数指定了不进行冒泡的话，那么事件对象将会在这个阶段结束之后停止传播。
* 冒泡阶段：和捕获阶段刚好是相反的，从触发事件元素的父元素一直到`window`对象。

### 事件方法

#### event对象

无论是位于任何阶段中的任何DOM元素，其事件监听函数中获取的`event`对象都是对于真正触发事件的元素而言的，也就是这些`event`对象其实都是一个对象，`event`对象的`target`属性都表示当前触发事件的DOM元素。

`addEventListener`函数除了接收事件名、处理函数两个参数之外，还可以接受一个处理函数是否会在捕获阶段触发，默认情况下是不能够在捕获阶段触发事件处理函数的，除非显式指定这参数为`true`。

```javascript
const doc = document;
const body = doc.body;
doc.addEventListener('click', function (e) {
  console.log('Gotcha doc');
});
body.addEventListener('click', function (e) {
  console.log('Gotcha body');
});
// Gotcha body
// Gotcha doc
doc.addEventListener('click', function (e) {
  console.log('Gotcha doc')
}, true);
body.addEventListener('click', function (e) {
  console.log('Gotcha body')
}, true);
// Gotcha doc
// Gotcha body
```

上面的代码在页面上随便点击一下，会首先触发body的回调，再触发doc的回调，也就是在捕获阶段，这两个事件处理函数都没有执行。

而如果加上第三个参数`addEventListener('click', handler, true)`。那么事件的捕获阶段就会直接触发事件处理函数。

#### event.stopPropagation()

这个方法会停止事件的冒泡阶段，也就是事件对象完成了目标阶段之后，整个事件流就结束了。这时如果没有指明事件绑定时候启用捕获阶段的话，那么也不会发生捕获，这时候就只会触发事件的目标阶段(target phase)了。

```javascript
const doc = document;
const body = doc.body;
doc.addEventListener('click', function (event) {
  event.stopPropagation();
  console.log('Gotcha doc');
});
body.addEventListener('click', function (event) {
  event.stopPropagation();
  console.log('Gotcha body');
})
// 这时候在body上随便点击一下，只会显示 Gotcha body
```

#### event.preventDefault()

该方法用来阻止和事件关联的默认动作，比如`submit`按钮，点击这个按钮会导致表单的提交，如果在事件处理函数里面的调用了这个方法的话，可以阻止表单的提交。

### 事件委托

有些时候，对于循环生成的DOM元素来说，如果要添加事件处理程序是很麻烦的事情，为一个元素都要添加一次事件处理程序。但是这样又存在一些问题，比如，如果需要新增一个元素，那么就又要添加一次事件处理函数。这样冗余的监听器数量过于庞大。

这时候可以使用事件委托机制来优化这个操作：

```javascript
// 不采用事件委托，逐个添加事件处理函数
const ol = document.createElement('ol');
for (let i = 0; i < 5; i++) {
  let li = document.createElement('li');
  li.addEventListener('click', function (event) {
    console.log(event.target);
  });
  li.textContent = `This is the ${i} element`;
  ol.appendChild(li);
}

// 采用事件委托，将所有的li元素的事件操作都委托给其父元素
const ol = document.createElement('ol');
ol.addEventListener('click', function (event) {
  const target = event.target;
  const toString = Object.prototype.toString;
  // 这里其实可以不添加这个判断的，因为默认的触发元素会是最底层的元素，而我们需要绑定的元素
  // 恰恰是最底层的，而在一些元素嵌套比较深的情况，我们需要触发事件的又是一个中间层元素，
  // 那么这个时候就必须要判断当前目标元素是否为我们需要触发事件的元素了，可以使用一个while
  // 循环来遍历父元素，直到遍历到一个我们需要触发事件的元素为止
  if (toString.call(target) === '[object HTMLLIElement]') {
    console.log(event.target);
  }
})
for (let i = 0; i < 5; i++) {
  let li = document.createElement('li');
  li.textContent = `This is the ${i} element`;
  ol.appendChild(li)
}
```

使用事件委托机制可以减少对于DOM元素的操作，因为对于DOM元素的操作可能引起重绘或者回流，严重影响渲染速度。尤其是当需要添加事件处理的元素非常多的时候，比如，我们的列表中100个元素，使用事件委托只需要给一个元素添加事件监听就可以了，对于动态添加进来的元素甚至不需要进行DOM操作。

但也不是将事件委托的越高越好，有时候委托的高了会导致一个事件处理函数里面要对多种元素的事件进行处理，也会影响事件处理的速度。除了像React这种需要对事件统一管理的框架，需要将事件委托在一个合理的高度，尽量保证委托在所有迭代生成元素的冒泡路径上的第一个公共父元素上面。

事件委托也是有使用限制的，必须要是可以进行冒泡的事件，比如`click`、`mousedown`等，对于不能够冒泡的事件，或者是比较难以处理的事件，比如需要计算位置的`mousemove`事件，还是需要使用一般的绑定方法。

### IE事件模型和传统事件模型

使用`on`+事件名方式绑定事件处理器的方式叫做传统事件模型，比如`window.onload`或者`obj.onclick`这样的方式添加事件处理器。但是这种方式不能够支持事件捕获，只能够支持事件冒泡，并且对于一个元素的一个事件来说，只能够绑定唯一的事件处理器。

W3C标准的事件模型使用`addEventListener`方法绑定事件，并且使用事件处理函数传入的`event`来获取事件对象。

而IE的事件模型通过`attachEvent`和`detachEvent`两个函数来绑定事件处理函数，并且事件对象使用`window.event`这个专门的事件对象来获取。